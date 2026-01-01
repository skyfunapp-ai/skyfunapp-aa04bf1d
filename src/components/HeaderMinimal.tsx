import { PlaneTakeoff, Pencil } from "lucide-react";

const HeaderMinimal = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="w-full px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PlaneTakeoff size={32} className="text-foreground -rotate-12" />
          <span className="text-xl font-bold text-foreground">SkyFunApp</span>
        </div>
        <button className="p-2 hover:bg-accent rounded-md transition-colors">
          <Pencil size={24} className="text-foreground" />
        </button>
      </div>
    </header>
  );
};

export default HeaderMinimal;
