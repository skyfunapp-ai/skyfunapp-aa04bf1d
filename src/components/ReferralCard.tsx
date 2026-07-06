import { useEffect, useState } from "react";
import { Copy, Check, Gift, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const ReferralCard = () => {
  const { user } = useAuth();
  const [code, setCode] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let active = true;

    (async () => {
      const { data: codeData, error } = await supabase.rpc("get_or_create_referral_code");
      if (!active) return;
      if (!error && codeData) setCode(codeData as string);

      const { count: refCount } = await supabase
        .from("referrals")
        .select("*", { count: "exact", head: true })
        .eq("referrer_id", user.id);
      if (active && refCount !== null) setCount(refCount);
      if (active) setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [user]);

  if (!user || loading || !code) return null;

  const inviteUrl = `${window.location.origin}/create-account?ref=${code}`;
  const shareText = `Join me on SkyFunApp ✈️ and we both earn 5 Skoins! Use my invite: ${inviteUrl}`;

  const copyCode = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast({ title: "Invite link copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "SkyFunApp invite", text: shareText, url: inviteUrl });
      } catch {
        /* cancelled */
      }
    } else {
      copyCode();
    }
  };

  return (
    <div className="mx-4 mt-3 mb-2 rounded-2xl bg-primary/40 border border-accent/30 p-4 text-left shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <Gift size={18} className="text-accent" />
        <p className="text-primary-foreground font-semibold">Invite & Earn 5 Skoins</p>
      </div>
      <p className="text-primary-foreground text-sm mb-3">
        Share your code. You and your friend both get 5 Skoins when they sign up.
      </p>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 bg-background/40 border border-accent/20 rounded-lg px-3 py-2 font-mono text-primary-foreground tracking-widest text-center">
          {code}
        </div>
        <button
          onClick={copyCode}
          className="px-3 py-2 bg-accent text-accent-foreground rounded-lg font-semibold flex items-center gap-1.5 text-sm"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-primary-foreground text-sm">
          <Users size={14} />
          <span>{count} {count === 1 ? "friend joined" : "friends joined"}</span>
        </div>
        <button
          onClick={share}
          className="px-4 py-1.5 bg-primary-foreground/10 hover:bg-primary-foreground/20 border border-accent/30 text-primary-foreground rounded-full text-sm font-semibold"
        >
          Share invite
        </button>
      </div>
    </div>
  );
};

export default ReferralCard;
