import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { Coins, CheckCircle } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

const SkoinSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const coins = Number(searchParams.get("coins") || "0");
  const { updateProfile, profile, loading } = useProfile();

  useEffect(() => {
    if (!loading && coins > 0) {
      updateProfile({ skoinBalance: profile.skoinBalance + coins });
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />

      <main className="flex-1 flex flex-col items-center justify-center pt-20 sm:pt-24 pb-20 px-4 text-center">
        <CheckCircle size={64} className="text-green-500 mb-4" />
        <h1 className="text-3xl font-bold text-primary-foreground mb-2">Thank You!</h1>
        <p className="text-lg text-muted-foreground mb-2">Payment Successful</p>

        <div className="flex items-center gap-2 mt-4 mb-8">
          <Coins size={32} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
          <span className="text-xl font-bold text-primary-foreground">
            {coins} Gold Coin{coins > 1 ? "s" : ""} added to your balance
          </span>
        </div>

        <button
          onClick={() => navigate("/skoin")}
          className="px-8 py-3 bg-accent text-accent-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Back to Skoin
        </button>
      </main>

      <BottomNav activePage="profile" />
    </div>
  );
};

export default SkoinSuccessPage;
