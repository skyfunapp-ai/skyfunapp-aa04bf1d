import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { appUsers } from "@/data/flights";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, ArrowLeft, Send, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

// Store messages per-user so they don't leak across conversations
const messageStore: Record<string, { text: string; fromMe: boolean }[]> = {};
// Track how many messages were seen per conversation
const readCountStore: Record<string, number> = {};

const MessagesPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<{ text: string; fromMe: boolean }[]>([]);
  const [input, setInput] = useState("");
  const [incomingPopup, setIncomingPopup] = useState<{ userId: string; name: string; photo: string; avatar: string; message: string } | null>(null);

  const selectedUser = userId ? appUsers.find((u) => u.id === userId) : null;

  // Check Skoin balance
  const getSkoinBalance = () => Number(localStorage.getItem("skoinBalance") ?? "5");

  // Load per-user messages & mark as read
  useEffect(() => {
    if (userId) {
      setMessages(messageStore[userId] || []);
      readCountStore[userId] = (messageStore[userId] || []).length;
    }
  }, [userId]);

  // Simulate incoming message from a random user while in a chat
  useEffect(() => {
    if (!userId) return;
    const blockedUsers: string[] = JSON.parse(localStorage.getItem("blockedUsers") || "[]");
    const otherUsers = appUsers.filter((u) => u.id !== userId && !blockedUsers.includes(u.id));
    if (otherUsers.length === 0) return;

    const timer = setTimeout(() => {
      const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
      setIncomingPopup({
        userId: randomUser.id,
        name: randomUser.name,
        photo: randomUser.photo,
        avatar: randomUser.avatar,
        message: "Hey! Are you at the airport? ✈️",
      });
      // Store the incoming message
      const existing = messageStore[randomUser.id] || [];
      messageStore[randomUser.id] = [...existing, { text: "Hey! Are you at the airport? ✈️", fromMe: false }];
    }, 8000 + Math.random() * 7000);

    return () => clearTimeout(timer);
  }, [userId]);

  const handleIncomingClick = useCallback(() => {
    if (!incomingPopup) return;
    const targetId = incomingPopup.userId;
    // Auto-connect receiver without deducting Skoin
    const connectedUsers: string[] = JSON.parse(localStorage.getItem("connectedUsers") || "[]");
    if (!connectedUsers.includes(targetId)) {
      connectedUsers.push(targetId);
      localStorage.setItem("connectedUsers", JSON.stringify(connectedUsers));
    }
    setIncomingPopup(null);
    navigate(`/messages/${targetId}`);
  }, [incomingPopup, navigate]);

  // Check if user is blocked
  const isBlocked = (id: string) => {
    const blocked: string[] = JSON.parse(localStorage.getItem("blockedUsers") || "[]");
    return blocked.includes(id);
  };

  const handleSend = () => {
    if (!input.trim() || !userId) return;

    // Check if blocked
    if (isBlocked(userId)) {
      toast({ title: "User is blocked", description: "Unblock this user to send messages." });
      return;
    }

    const newMessages = [...messages, { text: input.trim(), fromMe: true }];
    messageStore[userId] = newMessages;
    readCountStore[userId] = newMessages.length;
    setMessages(newMessages);
    setInput("");

    // Simulate reply
    setTimeout(() => {
      const reply = [...(messageStore[userId] || []), { text: "Thanks for reaching out! ✈️", fromMe: false }];
      messageStore[userId] = reply;
      readCountStore[userId] = reply.length;
      setMessages(reply);
    }, 1200);
  };

  // Chat view
  if (selectedUser) {
    const userBlocked = isBlocked(selectedUser.id);

    return (
      <div className="min-h-screen flex flex-col bg-background">
        <HeaderMinimal />

        {/* Incoming message popup */}
        {incomingPopup && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
            <div
              onClick={handleIncomingClick}
              className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3 shadow-lg cursor-pointer hover:bg-card/90 transition-colors max-w-xs"
            >
              <Avatar className="w-10 h-10 shrink-0">
                <AvatarImage src={incomingPopup.photo} alt={incomingPopup.name} />
                <AvatarFallback className="text-sm font-bold">{incomingPopup.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-card-foreground truncate">{incomingPopup.name}</p>
                <p className="text-xs text-muted-foreground truncate">{incomingPopup.message}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setIncomingPopup(null); }}
                className="text-muted-foreground hover:text-card-foreground p-1"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 flex flex-col pt-20 sm:pt-24 pb-20 px-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate("/messages")}
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <Avatar className="w-9 h-9">
              <AvatarImage src={selectedUser.photo} alt={selectedUser.name} />
              <AvatarFallback className="text-xs font-bold">{selectedUser.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-primary-foreground">{selectedUser.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{selectedUser.status}</p>
            </div>
          </div>

          <ScrollArea className="flex-1 mb-4">
            <div className="space-y-3 min-h-[200px]">
              {messages.length === 0 && !userBlocked && (
                <p className="text-center text-muted-foreground text-sm mt-12">
                  Say hello to {selectedUser.name}!
                </p>
              )}
              {userBlocked && (
                <p className="text-center text-destructive text-sm mt-12">
                  You have blocked this user. Unblock from their profile to chat.
                </p>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                      msg.fromMe
                        ? "bg-accent text-accent-foreground rounded-br-sm"
                        : "bg-card text-card-foreground border border-border/50 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {!userBlocked && (
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-card text-card-foreground border border-border rounded-full px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                onClick={handleSend}
                className="p-2.5 bg-accent text-accent-foreground rounded-full hover:opacity-90 transition-opacity"
              >
                <Send size={18} />
              </button>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center mt-2">
            Skoin balance: {getSkoinBalance()}
          </p>
        </main>

        <BottomNav activePage="messages" />
      </div>
    );
  }

  // Connected users only - no user directory
  const connectedUsers: string[] = JSON.parse(localStorage.getItem("connectedUsers") || "[]");
  const blockedUsers: string[] = JSON.parse(localStorage.getItem("blockedUsers") || "[]");
  const chatUsers = appUsers.filter((u) => connectedUsers.includes(u.id) && !blockedUsers.includes(u.id));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />

      <main className="flex-1 flex flex-col pt-20 sm:pt-24 pb-20 px-4">
        <h2 className="text-lg font-bold text-primary-foreground mb-4">Messages</h2>

        <ScrollArea className="flex-1">
          {chatUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground text-sm text-center">No conversations yet.</p>
              <p className="text-muted-foreground text-xs text-center mt-1">
                Connect with users from the Search page to start chatting.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {chatUsers.map((user) => {
                const lastMessages = messageStore[user.id];
                const lastMsg = lastMessages?.[lastMessages.length - 1];
                const totalCount = lastMessages?.length || 0;
                const readCount = readCountStore[user.id] || 0;
                const unreadCount = Math.max(0, totalCount - readCount);
                return (
                  <div
                    key={user.id}
                    onClick={() => navigate(`/messages/${user.id}`)}
                    className="flex items-center gap-3 bg-card/80 backdrop-blur rounded-xl px-4 py-3 border border-border/50 cursor-pointer hover:bg-card/95 transition-colors"
                  >
                    <div className="relative shrink-0">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.photo} alt={user.name} />
                        <AvatarFallback className="text-sm font-bold">{user.avatar}</AvatarFallback>
                      </Avatar>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${unreadCount > 0 ? "font-bold text-card-foreground" : "font-semibold text-card-foreground"}`}>{user.name}</p>
                      <p className={`text-xs truncate ${unreadCount > 0 ? "text-card-foreground font-medium" : "text-muted-foreground"}`}>
                        {lastMsg ? (lastMsg.fromMe ? `You: ${lastMsg.text}` : lastMsg.text) : "Tap to chat"}
                      </p>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full shrink-0 ${
                        user.status === "online"
                          ? "bg-green-500"
                          : user.status === "away"
                          ? "bg-yellow-500"
                          : "bg-muted-foreground/40"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </main>

      <BottomNav activePage="messages" />
    </div>
  );
};

export default MessagesPage;
