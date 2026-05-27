import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify the calling user from the JWT
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Delete user-owned data across tables (best effort)
    await admin.from("messages").delete().or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
    await admin.from("blocked_users").delete().eq("user_id", userId);
    await admin.from("connections").delete().eq("user_id", userId);
    await admin.from("referrals").delete().or(`referrer_id.eq.${userId},referred_id.eq.${userId}`);
    await admin.from("referral_codes").delete().eq("user_id", userId);
    await admin.from("skoin_transactions").delete().eq("user_id", userId);
    await admin.from("skoin_balances").delete().eq("user_id", userId);
    await admin.from("profiles").delete().eq("id", userId);

    // Delete profile photos in storage
    try {
      const { data: files } = await admin.storage.from("profile-photos").list(userId);
      if (files && files.length) {
        await admin.storage
          .from("profile-photos")
          .remove(files.map((f) => `${userId}/${f.name}`));
      }
    } catch (_) {
      // ignore
    }

    // Finally delete the auth user
    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    if (delErr) {
      return new Response(JSON.stringify({ error: delErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
