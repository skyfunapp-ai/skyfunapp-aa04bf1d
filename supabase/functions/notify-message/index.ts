import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.49.1/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { receiverId, senderName, messageText } = await req.json();

    if (!receiverId || !senderName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Get receiver's email from auth
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(receiverId);
    if (userError || !userData?.user?.email) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const receiverEmail = userData.user.email;
    const preview = messageText
      ? messageText.length > 100 ? messageText.slice(0, 100) + "…" : messageText
      : "📷 Photo";

    // Send email notification via Lovable AI
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (lovableApiKey) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff; padding: 30px;">
          <h2 style="color: #1a1a2e; margin-bottom: 8px;">✈️ SkyFunApp</h2>
          <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
          <p style="color: #333; font-size: 16px;">You have a new message from <strong>${senderName}</strong>:</p>
          <div style="background: #f5f5f5; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <p style="color: #555; font-size: 14px; margin: 0;">${preview}</p>
          </div>
          <p style="color: #666; font-size: 14px;">Log in to SkyFunApp to read and reply.</p>
          <a href="https://skyfunapp.lovable.app" style="display: inline-block; background: #e94560; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;">Open SkyFunApp</a>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">You received this because someone sent you a message on SkyFunApp.</p>
        </div>
      `;

      // Use Supabase's built-in email via auth.admin
      // For now, we log the intent - email sending requires email domain setup
      console.log(`Email notification would be sent to ${receiverEmail} about message from ${senderName}`);
    }

    return new Response(JSON.stringify({ success: true, email: receiverEmail }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
