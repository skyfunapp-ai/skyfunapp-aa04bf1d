import { PlaneTakeoff, PlaneLanding } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container max-w-2xl mx-auto px-4 h-32 flex items-center justify-center">
        <div className="flex items-center gap-4">
          <PlaneTakeoff size={72} className="text-primary-foreground -rotate-12" />
          <span className="text-6xl font-bold text-primary-foreground">
            SkyFunApp
          </span>
          <PlaneLanding size={72} className="text-primary-foreground rotate-12" />
        </div>
      </div>
    </header>
  );
};

export default Header;
