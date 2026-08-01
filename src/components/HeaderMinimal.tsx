import { PlaneTakeoff, Pencil, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderMinimalProps {
  onEditClick?: () => void;
  showEdit?: boolean;
}

const HeaderMinimal = ({ onEditClick, showEdit = false }: HeaderMinimalProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { unreadCount, notifications, markAllRead } = useNotifications();
  const [popup, setPopup] = useState<{ fromUserId: string; fromUserName: string; message: string } | null>(null);

  const latestUnread = notifications.find((n) => !n.read);

  useEffect(() => {
    if (!latestUnread) return;
    setPopup({
      fromUserId: latestUnread.fromUserId,
      fromUserName: latestUnread.fromUserName,
      message: latestUnread.message,
    });
    const t = setTimeout(() => setPopup(null), 6000);
    return () => clearTimeout(t);
  }, [latestUnread?.id]);

  const isLoggedIn = !!user;


  const menuItems = isLoggedIn
    ? [
        { label: "About", path: "/about" },
        { label: "Profile", path: "/dashboard" },
        { label: "Search", path: "/search" },
        { label: "Messages", path: "/messages" },
        { label: "Safety", path: "/safety" },
        { label: "Help", path: "/help" },
        { label: "Terms of Service", path: "/terms" },
        { label: "Privacy & Policy", path: "/privacy" },
        { label: "Log Out", path: "/logout" },
      ]
    : [
        { label: "Home", path: "/" },
        { label: "About", path: "/about" },
        
        { label: "Safety", path: "/safety" },
        { label: "Help", path: "/help" },
        { label: "Terms of Service", path: "/terms" },
        { label: "Privacy & Policy", path: "/privacy" },
      ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="w-full px-4 h-16 sm:h-24 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <PlaneTakeoff className="text-primary-foreground -rotate-12 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] w-7 h-7 sm:w-12 sm:h-12" />
          <span className="text-xl sm:text-3xl font-bold italic text-primary-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">SkyFunApp</span>
        </div>
        <div className="flex items-center gap-2">
          {showEdit && onEditClick && (
            <button
              onClick={onEditClick}
              className="p-2 hover:bg-accent rounded-md transition-colors"
            >
              <Pencil size={20} className="text-primary-foreground" />
            </button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-accent rounded-md transition-colors relative">
                <Menu size={28} className="text-primary-foreground" />
                {isLoggedIn && unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary-foreground text-background text-[11px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-border">
              <SheetHeader>
                <SheetTitle className="text-primary-foreground text-xl">Menu</SheetTitle>
              </SheetHeader>
              {isLoggedIn && unreadCount > 0 && (
                <button
                  onClick={() => {
                    markAllRead();
                    navigate("/messages");
                  }}
                  className="mt-4 w-full flex items-center gap-3 rounded-lg border border-primary-foreground/40 bg-primary-foreground/10 px-4 py-3 text-left"
                >
                  <MessageCircle size={20} className="text-primary-foreground shrink-0" />
                  <span className="text-base font-semibold text-primary-foreground">
                    {unreadCount} unread message{unreadCount > 1 ? "s" : ""}
                  </span>
                </button>
              )}
              <nav className="mt-6 space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={async () => {
                      if (item.path === "/logout") {
                        await signOut();
                        navigate("/");
                      } else {
                        navigate(item.path);
                      }
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg text-lg font-medium text-primary-foreground hover:bg-accent/20 transition-colors flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    {item.path === "/messages" && unreadCount > 0 && (
                      <span className="bg-primary-foreground text-background text-[11px] font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {isLoggedIn && popup && (
        <div className="absolute right-3 top-full mt-2 w-[min(20rem,calc(100vw-1.5rem))] rounded-xl border border-primary-foreground/40 bg-background/95 backdrop-blur-lg shadow-[0_0_20px_rgba(0,0,0,0.35)] p-3">
          <div className="flex items-start gap-3">
            <MessageCircle size={20} className="text-primary-foreground shrink-0 mt-0.5" />
            <button
              onClick={() => {
                setPopup(null);
                markAllRead();
                navigate(`/messages/${popup.fromUserId}`);
              }}
              className="flex-1 text-left"
            >
              <p className="text-base font-semibold text-primary-foreground">
                New message from {popup.fromUserName}
              </p>
              <p className="text-sm text-primary-foreground/80 line-clamp-2">{popup.message}</p>
            </button>
            <button onClick={() => setPopup(null)} aria-label="Dismiss notification">
              <X size={18} className="text-primary-foreground/70" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};


export default HeaderMinimal;
