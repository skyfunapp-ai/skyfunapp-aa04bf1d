import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { Info } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />
      <main className="flex-1 flex flex-col items-center pt-20 sm:pt-24 pb-20 px-4">
        <h1 className="text-3xl font-bold text-primary-foreground mb-6 flex items-center gap-2">
          <Info size={28} /> About SkyFunApp
        </h1>
        <div className="max-w-md text-center space-y-4">
          <p className="text-primary-foreground/80">
            SkyFunApp is your ultimate travel companion — connecting travelers worldwide, helping you find flights, and making every journey an adventure.
          </p>
          <p className="text-primary-foreground/80">
            Meet fellow travelers, share experiences, and explore the world together.
          </p>
          <p className="text-muted-foreground text-sm mt-8">Version 1.0.0</p>
        </div>
      </main>
      <BottomNav activePage="profile" />
    </div>
  );
};

export default AboutPage;
