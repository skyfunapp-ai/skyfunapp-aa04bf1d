import { PlaneTakeoff, Pencil } from "lucide-react";

const HeaderMinimal = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="w-full px-4 h-24 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PlaneTakeoff size={48} className="text-primary-foreground -rotate-12 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          <span className="text-3xl font-bold italic text-primary-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">SkyFunApp</span>
        </div>
        <button className="p-2 hover:bg-accent rounded-md transition-colors">
          <Pencil size={28} className="text-primary-foreground" />
        </button>
      </div>
    </header>
  );
};

export default HeaderMinimal;
