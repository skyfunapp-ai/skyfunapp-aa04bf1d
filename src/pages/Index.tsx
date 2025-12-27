import Header from "@/components/Header";
import { Globe } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Globe Icon & Auth Links */}
        <div className="flex flex-col items-center space-y-6">
          <div className="animate-spin-slow">
            <Globe size={80} className="text-emerald-400" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col items-center space-y-2 text-primary-foreground">
            <button className="text-lg font-medium hover:underline">Check In (Log In)</button>
            <button className="text-sm opacity-80 hover:underline">Purchase Flight (Create Account)</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
