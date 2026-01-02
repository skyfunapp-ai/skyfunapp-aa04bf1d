import { User, Search, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BottomNavProps {
  activePage: "profile" | "search" | "messages";
}

const BottomNav = ({ activePage }: BottomNavProps) => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border py-4">
      <div className="flex justify-around items-center">
        <button 
          onClick={() => navigate("/dashboard")}
          className="p-2 hover:bg-accent/20 rounded-full transition-colors"
        >
          <User 
            size={28} 
            className={activePage === "profile" ? "text-muted-foreground" : "text-primary-foreground"} 
          />
        </button>
        <button 
          onClick={() => navigate("/search")}
          className="p-2 hover:bg-accent/20 rounded-full transition-colors"
        >
          <Search 
            size={28} 
            className={activePage === "search" ? "text-muted-foreground" : "text-primary-foreground"} 
          />
        </button>
        <button 
          onClick={() => navigate("/messages")}
          className="p-2 hover:bg-accent/20 rounded-full transition-colors"
        >
          <MessageCircle 
            size={28} 
            className={activePage === "messages" ? "text-muted-foreground" : "text-primary-foreground"} 
          />
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
