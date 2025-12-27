import { PlaneTakeoff, PlaneLanding } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container max-w-lg mx-auto px-4 h-16 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <PlaneTakeoff size={24} className="text-primary-foreground -rotate-12" />
          <span className="text-xl font-bold text-primary-foreground">
            SkyFunApp
          </span>
          <PlaneLanding size={24} className="text-primary-foreground rotate-12" />
        </div>
      </div>
    </header>
  );
};

export default Header;
