import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable/index";
import { useToast } from "@/hooks/use-toast";

const SocialAuthButtons = ({ label = "Continue" }: { label?: string }) => {
  const { toast } = useToast();
  const [busy, setBusy] = useState<string | null>(null);

  const go = async (provider: "google" | "apple") => {
    setBusy(provider);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast({ title: "Sign in failed", description: String(result.error.message ?? result.error), variant: "destructive" });
      setBusy(null);
      return;
    }
    if (result.redirected) return;
    window.location.href = "/dashboard";
  };

  return (
    <div className="w-full max-w-sm space-y-3">
      <Button type="button" variant="outline" className="w-full h-12 text-base bg-background text-foreground" disabled={!!busy} onClick={() => go("apple")}>
        <FaApple size={22} className="mr-2" /> {busy === "apple" ? "Connecting..." : `${label} with Apple`}
      </Button>
      <Button type="button" variant="outline" className="w-full h-12 text-base bg-background text-foreground" disabled={!!busy} onClick={() => go("google")}>
        <FcGoogle size={22} className="mr-2" /> {busy === "google" ? "Connecting..." : `${label} with Google`}
      </Button>
      <div className="flex items-center gap-3 text-primary-foreground text-sm">
        <div className="h-px flex-1 bg-primary-foreground/40" /> or <div className="h-px flex-1 bg-primary-foreground/40" />
      </div>
    </div>
  );
};

export default SocialAuthButtons;
