import { PlaneTakeoff } from "lucide-react";

const HeaderMinimal = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container max-w-2xl mx-auto px-4 h-32 flex items-center justify-start">
        <PlaneTakeoff size={72} className="text-primary-foreground -rotate-12 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
      </div>
    </header>
  );
};

export default HeaderMinimal;
