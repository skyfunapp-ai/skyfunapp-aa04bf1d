import Header from "@/components/Header";
import { Earth } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-lg mx-auto px-4 pt-20 pb-8 h-screen flex flex-col">
        {/* Earth Globe & Auth Links */}
        <div className="flex flex-col items-center py-8 space-y-4">
          <div className="animate-spin-slow">
            <Earth size={120} className="text-sky-500" strokeWidth={1} />
          </div>
          <div className="flex flex-col items-center space-y-2 text-primary-foreground">
            <button className="text-lg font-medium hover:underline">Check In (Log In)</button>
            <button className="text-xl font-bold hover:underline">Purchase Flight (Create Account)</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
