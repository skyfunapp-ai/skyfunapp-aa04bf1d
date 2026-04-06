import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { userCache } from "@/data/messageStore";

interface Notification {
  id: string;
  fromUserId: string;
  fromUserName: string;
  message: string;
  timestamp: number;
  read: boolean;
}

interface NotificationContextType {
  unreadCount: number;
  notifications: Notification[];
  addMessageNotification: (fromUserId: string, fromUserName: string, message: string) => void;
  clearUnread: () => void;
  markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  notifications: [],
  addMessageNotification: () => {},
  clearUnread: () => {},
  markAllRead: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const navigate = useNavigate();

  const addMessageNotification = useCallback((fromUserId: string, fromUserName: string, message: string) => {
    const notification: Notification = {
      id: `${Date.now()}-${fromUserId}`,
      fromUserId,
      fromUserName,
      message,
      timestamp: Date.now(),
      read: false,
    };

    setNotifications((prev) => [notification, ...prev]);

    try {
      const audio = new Audio("/notification.wav");
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch {}

    toast(`💬 ${fromUserName}`, {
      description: message.length > 50 ? message.slice(0, 50) + "…" : message,
      duration: 4000,
      action: {
        label: "Open",
        onClick: () => navigate(`/messages/${fromUserId}`),
      },
    });
  }, [navigate]);

  // Global real-time listener for all incoming messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`global-notif-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        async (payload) => {
          const row = payload.new as any;

          // Look up sender name
          let senderName = userCache[row.sender_id]?.name;
          if (!senderName) {
            const { data } = await supabase
              .from("profiles")
              .select("name")
              .eq("id", row.sender_id)
              .single();
            senderName = data?.name || "Someone";
            if (data) userCache[row.sender_id] = { id: row.sender_id, name: data.name || "", profilePhoto: undefined };
          }

          addMessageNotification(
            row.sender_id,
            senderName,
            row.text || "📷 Photo"
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, addMessageNotification]);

  const clearUnread = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ unreadCount, notifications, addMessageNotification, clearUnread, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
