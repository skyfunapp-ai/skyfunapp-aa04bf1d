import { useEffect, useState } from "react";
import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SkoinPage = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    setBalance(Number(localStorage.getItem("skoinBalance") ?? "5"));
  }, []);

  const coinOptions = [
    { coins: 1, price: ".99", label: "1 Gold Coin", badge: null },
    { coins: 6, price: "4.99", label: "6 Gold Coins", badge: "6" },
    { coins: 12, price: "9.99", label: "12 Gold Coins", badge: "12" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />

      <main className="flex-1 flex flex-col items-center justify-center pt-20 sm:pt-24 pb-20 px-4">
        <h1 className="text-4xl font-bold text-primary-foreground mb-2">Skoin</h1>
        <p className="text-lg text-muted-foreground mb-10">
          Balance: <span className="text-primary-foreground font-bold">{balance}</span> Skoin
        </p>

        <div className="space-y-8 w-full max-w-xs">
          {coinOptions.map((option) => (
            <button
              key={option.coins}
              onClick={() => navigate(`/skoin/payment?coins=${option.coins}&price=${option.price}`)}
              className="w-full flex items-center justify-between bg-card/80 backdrop-blur rounded-2xl px-6 py-5 border border-border/50 hover:bg-card/95 transition-colors cursor-pointer"
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
            </button>
          ))}
        </div>
      </main>

      <BottomNav activePage="profile" />
    </div>
  );
};

export default SkoinPage;
