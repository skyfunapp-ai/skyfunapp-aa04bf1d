import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user) throw new Error("Not authenticated");

    const { connected_user_id } = await req.json();
    if (!connected_user_id) throw new Error("Missing connected_user_id");

    // Check if already connected (no double deduction)
    const { data: existingConn } = await supabaseAdmin
      .from("connections")
      .select("id")
      .eq("user_id", user.id)
      .eq("connected_user_id", connected_user_id)
      .maybeSingle();

    if (existingConn) {
      return new Response(
        JSON.stringify({ success: true, already_connected: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isUnlimitedUser = user.email === "skyfunapp@gmail.com";

    if (!isUnlimitedUser) {
      // Check balance
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("skoin_balance")
        .eq("id", user.id)
        .single();

      if (!profile || profile.skoin_balance < 1) {
        return new Response(
          JSON.stringify({ error: "Insufficient Skoin balance" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }

      // Deduct 1 Skoin
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({ skoin_balance: profile.skoin_balance - 1, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (updateError) throw new Error("Could not deduct Skoin");
    }

    if (updateError) throw new Error("Could not deduct Skoin");

    // Create connection
    const { error: connError } = await supabaseAdmin
      .from("connections")
      .insert({ user_id: user.id, connected_user_id });

    if (connError) {
      // Rollback balance if connection insert fails
      await supabaseAdmin
        .from("profiles")
        .update({ skoin_balance: profile.skoin_balance, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      throw new Error("Could not create connection");
    }

    return new Response(
      JSON.stringify({ success: true, newBalance: profile.skoin_balance - 1 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
