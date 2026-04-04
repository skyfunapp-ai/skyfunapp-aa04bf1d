import { PlaneTakeoff, PlaneLanding } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="w-full px-4 h-20 sm:h-32 flex items-center justify-center">
        <div className="flex items-center gap-2 sm:gap-4">
          <PlaneTakeoff className="text-primary-foreground -rotate-12 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] w-8 h-8 sm:w-[72px] sm:h-[72px]" />
          <span className="text-2xl sm:text-6xl font-bold text-primary-foreground drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] [text-shadow:_0_0_30px_rgba(255,255,255,0.3),_0_0_60px_rgba(52,211,153,0.3)]">
            SkyFunApp
          </span>
          <PlaneLanding className="text-primary-foreground rotate-12 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] w-8 h-8 sm:w-[72px] sm:h-[72px]" />
        </div>
      </div>
    </header>
  );
};

export default Header;
