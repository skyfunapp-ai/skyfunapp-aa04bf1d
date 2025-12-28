import Header from "@/components/Header";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Globe Icon & Auth Links */}
        <div className="flex flex-col items-center space-y-6">
          <div className="animate-spin-slow" style={{ transformStyle: 'preserve-3d' }}>
            <Globe size={240} className="text-emerald-400" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col items-center space-y-4 text-primary-foreground">
            <button className="text-5xl font-medium hover:underline">Check In (Log In)</button>
            <button className="text-3xl opacity-80 hover:underline">Purchase Flight (Create Account)</button>
          </div>
        </div>

        {/* Social Login Options */}
        <div className="mt-12 flex flex-col items-center space-y-4">
          <p className="text-xl text-muted-foreground">Continue with</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" size="lg" className="text-xl px-6 py-4 h-auto">
              Google
            </Button>
            <Button variant="outline" size="lg" className="text-xl px-6 py-4 h-auto">
              Instagram
            </Button>
            <Button variant="outline" size="lg" className="text-xl px-6 py-4 h-auto">
              Facebook
            </Button>
            <Button variant="outline" size="lg" className="text-xl px-6 py-4 h-auto">
              TikTok
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
