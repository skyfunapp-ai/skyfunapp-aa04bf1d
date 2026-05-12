import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { Coins, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useIAP, IAPPackage } from "@/hooks/useIAP";

const SkoinPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading, refetchProfile } = useProfile();
  const { toast } = useToast();
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const { isNative, ready, packages, error: iapError, purchase, restore } = useIAP();

  // Fallback display tiers (used on web, or before RevenueCat offerings load)
  const fallbackOptions = [
    { id: "skoin_1", coins: 1, price: ".99", label: "1 Gold Coin", badge: null },
    { id: "skoin_12", coins: 12, price: "9.99", label: "12 Gold Coins", badge: "12" },
    { id: "skoin_25", coins: 25, price: "19.99", label: "25 Gold Coins", badge: "25" },
  ];

  const handleNativePurchase = async (pkg: IAPPackage) => {
    setPurchasing(pkg.identifier);
    try {
      await purchase(pkg);
      await refetchProfile();
      toast({ title: "Purchase successful", description: "Your Skoin balance has been updated." });
    } catch (err: any) {
      if (err?.userCancelled) return;
      toast({ title: "Purchase Error", description: err?.message || "Could not complete purchase", variant: "destructive" });
    } finally {
      setPurchasing(null);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      await restore();
      await refetchProfile();
      toast({ title: "Purchases restored", description: "Any previous purchases tied to your account have been restored and your balance refreshed." });
    } catch (err: any) {
      toast({ title: "Restore Error", description: err?.message || "Could not restore purchases", variant: "destructive" });
    } finally {
      setRestoring(false);
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

        {!isNative && user && (
          <div className="mb-8 w-full max-w-xs text-center text-sm text-muted-foreground bg-card/60 border border-border/50 rounded-2xl px-4 py-3">
            For a limited time, enjoy your new travel SkyFunApp friends on us.
          </div>
        )}

        <div className="space-y-8 w-full max-w-xs">
          {isNative && ready && packages.length > 0 ? (
            packages.map((pkg) => (
              <button
                key={pkg.identifier}
                onClick={() => handleNativePurchase(pkg)}
                disabled={purchasing !== null}
                className="w-full flex items-center justify-between bg-card/80 backdrop-blur rounded-2xl px-6 py-5 border border-border/50 hover:bg-card/95 transition-colors cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <Coins size={36} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                  <span className="text-lg font-semibold text-card-foreground">{pkg.product.title || pkg.identifier}</span>
                </div>
                <span className="text-xl font-bold text-primary-foreground">
                  {purchasing === pkg.identifier ? "..." : pkg.priceString}
                </span>
              </button>
            ))
          ) : (
            fallbackOptions.map((option) => (
              <div
                key={option.id}
                className="w-full flex items-center justify-between bg-card/80 backdrop-blur rounded-2xl px-6 py-5 border border-border/50 opacity-70"
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
                <span className="text-xl font-bold text-primary-foreground">${option.price}</span>
              </div>
            ))
          )}
        </div>

        {isNative && user && (
          <div className="mt-8 w-full max-w-xs flex flex-col items-center gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleRestore}
              disabled={restoring}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${restoring ? "animate-spin" : ""}`} />
              {restoring ? "Restoring..." : "Restore Purchases"}
            </Button>
            {iapError && (
              <p className="text-xs text-destructive text-center">{iapError}</p>
            )}
          </div>
        )}
      </main>

      <BottomNav activePage="profile" />
    </div>
  );
};

export default SkoinPage;
