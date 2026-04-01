import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user) throw new Error("User not authenticated");

    const { session_id } = await req.json();
    if (!session_id || typeof session_id !== "string") {
      throw new Error("Missing or invalid session_id");
    }

    // Verify the Stripe Checkout session
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Verify payment was successful
    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    // Verify this session belongs to this user
    if (session.metadata?.user_id !== user.id) {
      throw new Error("Session does not belong to this user");
    }

    const coins = parseInt(session.metadata?.coins || "0", 10);
    if (coins <= 0) {
      throw new Error("Invalid coin amount");
    }

    // Use admin client to atomically increment the balance
    // First get current balance
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("skoin_balance")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      throw new Error("Could not fetch profile");
    }

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        skoin_balance: profile.skoin_balance + coins,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      throw new Error("Could not update balance");
    }

    return new Response(
      JSON.stringify({ success: true, coins, newBalance: profile.skoin_balance + coins }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
