import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { Coins } from "lucide-react";

const SkoinPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />

      <main className="flex-1 flex flex-col items-center justify-center pt-20 sm:pt-24 pb-20 px-4">
        <h1 className="text-4xl font-bold text-primary-foreground mb-12">Skoin</h1>

        <div className="space-y-8 w-full max-w-xs">
          {/* 1 Gold Coin */}
          <div className="flex items-center justify-between bg-card/80 backdrop-blur rounded-2xl px-6 py-5 border border-border/50">
            <div className="flex items-center gap-3">
              <Coins size={36} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
              <span className="text-lg font-semibold text-card-foreground">1 Gold Coin</span>
            </div>
            <span className="text-xl font-bold text-primary-foreground">$.99</span>
          </div>

          {/* 6 Gold Coins */}
          <div className="flex items-center justify-between bg-card/80 backdrop-blur rounded-2xl px-6 py-5 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Coins size={36} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                <span className="absolute -top-1 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">6</span>
              </div>
              <span className="text-lg font-semibold text-card-foreground">6 Gold Coins</span>
            </div>
            <span className="text-xl font-bold text-primary-foreground">$4.99</span>
          </div>

          {/* 12 Gold Coins */}
          <div className="flex items-center justify-between bg-card/80 backdrop-blur rounded-2xl px-6 py-5 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Coins size={36} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                <span className="absolute -top-1 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">12</span>
              </div>
              <span className="text-lg font-semibold text-card-foreground">12 Gold Coins</span>
            </div>
            <span className="text-xl font-bold text-primary-foreground">$9.99</span>
          </div>
        </div>
      </main>

      <BottomNav activePage="profile" />
    </div>
  );
};

export default SkoinPage;
