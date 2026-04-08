import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const SkoinPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading } = useProfile();
  const { toast } = useToast();
  const [purchasing, setPurchasing] = useState<number | null>(null);

  const coinOptions = [
    { coins: 1, price: ".99", label: "1 Gold Coin", badge: null },
    { coins: 12, price: "9.99", label: "12 Gold Coins", badge: "12" },
    { coins: 25, price: "19.99", label: "25 Gold Coins", badge: "25" },
  ];

  const handlePurchase = async (coins: number) => {
    setPurchasing(coins);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke("create-skoin-checkout", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
        body: { coins },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      const msg = err.message?.toLowerCase() || "";
      const isAuthError = !user || msg.includes("not authenticated") || msg.includes("authorization") || msg.includes("non-2xx");
      toast({ 
        title: "Payment Error", 
        description: isAuthError 
          ? "Please Log In to Purchase Skoin" 
          : (err.message || "Could not start checkout"), 
        variant: "destructive" 
      });
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />

      <main className="flex-1 flex flex-col items-center justify-center pt-20 sm:pt-24 pb-20 px-4">
        <h1 className="text-4xl font-bold text-primary-foreground mb-2">Skoin</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Balance: <span className="text-primary-foreground font-bold">{loading ? "..." : profile.skoinBalance}</span> Skoin
        </p>
        <p className="text-sm text-muted-foreground text-center max-w-xs mb-10">
          Skoin is SkyFunApp's virtual currency that serves as a connection fee. When you want to message someone for the first time, 1 Skoin is deducted from your balance — after that, all future messages with that person are free. New users start with 5 free Skoins, and additional Skoins can be purchased in tiers.
        </p>

        {!user && (
          <div className="mb-8 w-full max-w-xs flex flex-col items-center gap-3">
            <p className="text-muted-foreground text-center">Log in or create an account to purchase Skoin</p>
            <div className="flex gap-3 w-full">
              <Button variant="gradient" className="flex-1" onClick={() => navigate("/")}>Log In</Button>
              <Button variant="outline" className="flex-1" onClick={() => navigate("/create-account")}>Sign Up</Button>
            </div>
          </div>
        )}

        <div className="space-y-8 w-full max-w-xs">
          {coinOptions.map((option) => (
            <button
              key={option.coins}
              onClick={() => handlePurchase(option.coins)}
              disabled={purchasing !== null}
              className="w-full flex items-center justify-between bg-card/80 backdrop-blur rounded-2xl px-6 py-5 border border-border/50 hover:bg-card/95 transition-colors cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Coins size={36} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                  {option.badge && (
                    <span className="absolute -top-1 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{option.badge}</span>
                  )}
                </div>
                <span className="text-lg font-semibold text-card-foreground">{option.label}</span>
              </div>
              <span className="text-xl font-bold text-primary-foreground">
                {purchasing === option.coins ? "..." : `$${option.price}`}
              </span>
            </button>
          ))}
        </div>
      </main>

      <BottomNav activePage="profile" />
    </div>
  );
};

export default SkoinPage;
