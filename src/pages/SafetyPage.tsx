import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { ShieldCheck } from "lucide-react";

const SafetyPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />
      <main className="flex-1 flex flex-col items-center pt-20 sm:pt-24 pb-20 px-4">
        <h1 className="text-3xl font-bold text-primary-foreground mb-6 flex items-center gap-2">
          <ShieldCheck size={28} /> Safety
        </h1>
        <div className="max-w-md space-y-4">
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">Your Privacy Matters</h3>
            <p className="text-muted-foreground text-sm">We never share your personal information with third parties without your consent.</p>
          </div>
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">Safe Meetups</h3>
            <p className="text-muted-foreground text-sm">Always meet in public places and let someone know your plans when meeting fellow travelers.</p>
          </div>
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">Report Concerns</h3>
            <p className="text-muted-foreground text-sm">If you encounter suspicious behavior, use the report feature or contact our safety team.</p>
            <p className="text-muted-foreground text-sm mt-2 font-semibold">For immediate response, please contact your local police department.</p>
          </div>
        </div>
      </main>
      <BottomNav activePage="profile" />
    </div>
  );
};

export default SafetyPage;
