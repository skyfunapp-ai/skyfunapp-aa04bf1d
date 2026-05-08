// RevenueCat webhook -> credits skoin_balance based on purchased product ID.
// Configure in RevenueCat dashboard: Project Settings -> Integrations -> Webhooks
//   URL: https://<project-ref>.functions.supabase.co/revenuecat-webhook
//   Authorization header: Bearer <REVENUECAT_WEBHOOK_SECRET>
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

// Map RevenueCat / store product identifiers -> coins to credit
const PRODUCT_TO_COINS: Record<string, number> = {
  skoin_1: 1,
  skoin_12: 12,
  skoin_25: 25,
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Shared-secret auth: RevenueCat sends the value you configured in the dashboard
    const expected = Deno.env.get("REVENUECAT_WEBHOOK_SECRET");
    const auth = req.headers.get("authorization") || req.headers.get("Authorization") || "";
    if (!expected || auth !== `Bearer ${expected}`) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = await req.json();
    const event = payload?.event;
    if (!event) {
      return new Response(JSON.stringify({ error: "missing event" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Only credit on real purchases. Ignore everything else (renewals not used; consumables only).
    const creditableTypes = new Set(["INITIAL_PURCHASE", "NON_RENEWING_PURCHASE", "PRODUCT_CHANGE"]);
    if (!creditableTypes.has(event.type)) {
      return new Response(JSON.stringify({ ok: true, ignored: event.type }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const productId: string | undefined = event.product_id;
    const userId: string | undefined = event.app_user_id;
    const txId: string | undefined = event.transaction_id || event.original_transaction_id || event.id;
    const coins = productId ? PRODUCT_TO_COINS[productId] : undefined;

    if (!userId || !productId || !coins || !txId) {
      return new Response(
        JSON.stringify({ error: "missing fields", productId, userId, txId }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Idempotency: reuse skoin_transactions table; stripe_session_id stores RC transaction id (prefixed)
    const dedupeKey = `rc_${txId}`;
    const { data: existing } = await admin
      .from("skoin_transactions")
      .select("id")
      .eq("stripe_session_id", dedupeKey)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ ok: true, already_processed: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: insertError } = await admin.from("skoin_transactions").insert({
      user_id: userId,
      stripe_session_id: dedupeKey,
      coins,
    });

    if (insertError) {
      if (insertError.code === "23505") {
        return new Response(JSON.stringify({ ok: true, already_processed: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(insertError.message);
    }

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("skoin_balance")
      .eq("id", userId)
      .single();
    if (profileError || !profile) throw new Error("profile not found");

    const { error: updateError } = await admin
      .from("profiles")
      .update({
        skoin_balance: profile.skoin_balance + coins,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
    if (updateError) throw new Error(updateError.message);

    return new Response(
      JSON.stringify({ ok: true, credited: coins, newBalance: profile.skoin_balance + coins }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
