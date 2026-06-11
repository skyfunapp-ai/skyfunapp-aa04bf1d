// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OFFLINE_THRESHOLD_MS = 2 * 60 * 1000; // 2 minutes

// ---------- FCM HTTP v1 helpers ----------
async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const cleaned = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const bin = Uint8Array.from(atob(cleaned), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8",
    bin,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

function b64url(bytes: Uint8Array | string): string {
  const str = typeof bytes === "string" ? bytes : String.fromCharCode(...bytes);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getFcmAccessToken(serviceAccountJson: string): Promise<{ token: string; projectId: string } | null> {
  try {
    const sa = JSON.parse(serviceAccountJson);
    const now = Math.floor(Date.now() / 1000);
    const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const claims = b64url(JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }));
    const signingInput = `${header}.${claims}`;
    const key = await importPrivateKey(sa.private_key);
    const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(signingInput));
    const jwt = `${signingInput}.${b64url(new Uint8Array(sig))}`;

    const resp = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });
    const data = await resp.json();
    if (!data.access_token) {
      console.error("FCM token error", data);
      return null;
    }
    return { token: data.access_token, projectId: sa.project_id };
  } catch (e) {
    console.error("FCM auth failed", e);
    return null;
  }
}

async function sendFcmPush(
  accessToken: string,
  projectId: string,
  deviceToken: string,
  title: string,
  body: string,
  data: Record<string, string>,
) {
  const resp = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: {
        token: deviceToken,
        notification: { title, body },
        data,
        apns: {
          payload: {
            aps: { sound: "default", badge: 1 },
          },
        },
        android: { priority: "HIGH", notification: { sound: "default" } },
      },
    }),
  });
  if (!resp.ok) {
    const txt = await resp.text();
    console.warn("FCM send failed", resp.status, txt);
    return { ok: false, status: resp.status, body: txt };
  }
  return { ok: true };
}

const escHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // Require authenticated caller
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const earlyUrl = Deno.env.get("SUPABASE_URL")!;
    const userClient = createClient(earlyUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userRes, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userRes?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const callerId = userRes.user.id;

    const { receiverId, senderName, messageText } = await req.json();
    if (!receiverId || !senderName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (callerId === receiverId) {
      return new Response(JSON.stringify({ error: "Invalid recipient" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Check receiver's online status
    const { data: profile } = await supabase
      .from("profiles")
      .select("last_seen")
      .eq("id", receiverId)
      .maybeSingle();

    const lastSeen = profile?.last_seen ? new Date(profile.last_seen).getTime() : 0;
    const isOnline = lastSeen && Date.now() - lastSeen < OFFLINE_THRESHOLD_MS;

    if (isOnline) {
      return new Response(JSON.stringify({ skipped: "user_online" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Honor user notification preferences
    const { data: prefs } = await supabase
      .from("notification_preferences")
      .select("push_enabled,email_enabled")
      .eq("user_id", receiverId)
      .maybeSingle();
    const pushEnabled = prefs?.push_enabled ?? true;
    const emailEnabled = prefs?.email_enabled ?? true;

    const preview = messageText
      ? (messageText.length > 120 ? messageText.slice(0, 120) + "…" : messageText)
      : "📷 Photo";
    const title = `💬 ${senderName}`;

    // ---------- Native push via FCM ----------
    const fcmJson = Deno.env.get("FCM_SERVICE_ACCOUNT_JSON");
    let pushResults: any[] = [];
    let tokenCount = 0;

    if (fcmJson && pushEnabled) {
      const { data: tokens } = await supabase
        .from("device_tokens")
        .select("token, platform")
        .eq("user_id", receiverId);

      tokenCount = tokens?.length ?? 0;

      if (tokens && tokens.length) {
        const auth = await getFcmAccessToken(fcmJson);
        if (auth) {
          for (const row of tokens) {
            const result = await sendFcmPush(
              auth.token,
              auth.projectId,
              row.token,
              title,
              preview,
              { fromUserId: "", type: "message" },
            );
            // Clean up dead tokens
            if (!result.ok && (result.status === 404 || result.status === 400)) {
              await supabase.from("device_tokens").delete().eq("token", row.token);
            }
            pushResults.push({ platform: row.platform, ok: result.ok });
          }
        }
      }
    } else {
      console.log("FCM_SERVICE_ACCOUNT_JSON not configured — skipping native push");
    }

    // ---------- Email fallback ----------
    const { data: userData } = await supabase.auth.admin.getUserById(receiverId);
    const email = emailEnabled ? userData?.user?.email : null;

    let emailSent = false;
    if (email) {
      // Try Lovable transactional email if available, else log.
      try {
        const lovableKey = Deno.env.get("LOVABLE_API_KEY");
        if (lovableKey) {
          const html = `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 30px;">
              <h2 style="color:#e94560;">✈️ SkyFunApp</h2>
              <p>You have a new message from <strong>${senderName}</strong>:</p>
              <div style="background:#f5f5f5;border-radius:12px;padding:16px;margin:16px 0;">
                <p style="margin:0;color:#333;">${preview}</p>
              </div>
              <a href="https://skyfunapp.lovable.app" style="display:inline-block;background:#e94560;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Open SkyFunApp</a>
              <p style="color:#999;font-size:12px;margin-top:24px;">You're receiving this because you missed a message on SkyFunApp.</p>
            </div>`;

          const r = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${serviceKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: email,
              subject: `New message from ${senderName} on SkyFunApp`,
              html,
              templateName: "message_notification",
              purpose: "transactional",
            }),
          });
          emailSent = r.ok;
          if (!r.ok) console.log("Email fallback unavailable:", await r.text());
        }
      } catch (e) {
        console.log("Email fallback error:", (e as Error).message);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        delivered: { pushTokens: tokenCount, pushResults, emailSent },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("notify-message error", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
