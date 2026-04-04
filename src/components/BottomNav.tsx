import { User, Search, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";

interface BottomNavProps {
  activePage: "profile" | "search" | "messages";
}

const BottomNav = ({ activePage }: BottomNavProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { unreadCount, clearUnread } = useNotifications();

  if (!user) return null;

  const handleMessagesClick = () => {
    clearUnread();
    navigate("/messages");
  };

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
          onClick={handleMessagesClick}
          className="p-2 hover:bg-accent/20 rounded-full transition-colors relative"
        >
          <MessageCircle 
            size={28} 
            className={activePage === "messages" ? "text-muted-foreground" : "text-primary-foreground"} 
          />
          {unreadCount > 0 && activePage !== "messages" && (
            <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
