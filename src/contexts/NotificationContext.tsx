import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { toast } from "sonner";

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
  const [notifications, setNotifications] = useState<Notification[]>([]);

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

    toast(`💬 ${fromUserName}`, {
      description: message.length > 50 ? message.slice(0, 50) + "…" : message,
      duration: 4000,
    });
  }, []);

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
