import { PlaneTakeoff, PlaneLanding } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container max-w-2xl mx-auto px-4 h-32 flex items-center justify-center">
        <div className="flex items-center gap-4">
          <PlaneTakeoff size={72} className="text-primary-foreground -rotate-12 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          <span className="text-6xl font-bold text-primary-foreground drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] [text-shadow:_0_0_30px_rgba(255,255,255,0.3),_0_0_60px_rgba(52,211,153,0.3)]">
            SkyFunApp
          </span>
          <PlaneLanding size={72} className="text-primary-foreground rotate-12 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </div>
      </div>
    </header>
  );
};

export default Header;
