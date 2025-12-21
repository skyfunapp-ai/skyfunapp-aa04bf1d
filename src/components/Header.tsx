import { Heart, User, MessageCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
        <Button variant="ghost" size="icon">
          <Settings size={22} className="text-muted-foreground" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Heart size={24} className="text-primary" fill="currentColor" />
          <span className="text-xl font-bold gradient-primary bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Spark
          </span>
        </div>
        
        <Button variant="ghost" size="icon">
          <MessageCircle size={22} className="text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
