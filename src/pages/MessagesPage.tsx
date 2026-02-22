import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { appUsers } from "@/data/flights";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, ArrowLeft, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

// Store messages per-user so they don't leak across conversations
const messageStore: Record<string, { text: string; fromMe: boolean }[]> = {};

const MessagesPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<{ text: string; fromMe: boolean }[]>([]);
  const [input, setInput] = useState("");

  const selectedUser = userId ? appUsers.find((u) => u.id === userId) : null;

  // Check Skoin balance
  const getSkoinBalance = () => Number(localStorage.getItem("skoinBalance") ?? "5");

  // Load per-user messages
  useEffect(() => {
    if (userId) {
      setMessages(messageStore[userId] || []);
    }
  }, [userId]);

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
    setMessages(newMessages);
    setInput("");

    // Simulate reply
    setTimeout(() => {
      const reply = [...(messageStore[userId] || []), { text: "Thanks for reaching out! ✈️", fromMe: false }];
      messageStore[userId] = reply;
      setMessages(reply);
    }, 1200);
  };

  // Chat view
  if (selectedUser) {
    const userBlocked = isBlocked(selectedUser.id);

    return (
      <div className="min-h-screen flex flex-col bg-background">
        <HeaderMinimal />

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

  // User list view - filter out blocked users
  const blockedUsers: string[] = JSON.parse(localStorage.getItem("blockedUsers") || "[]");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />

      <main className="flex-1 flex flex-col pt-20 sm:pt-24 pb-20 px-4">
        <h2 className="text-lg font-bold text-primary-foreground mb-4">Messages</h2>

        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {appUsers
              .filter((u) => !blockedUsers.includes(u.id))
              .map((user) => (
                <div
                  key={user.id}
                  onClick={() => navigate(`/messages/${user.id}`)}
                  className="flex items-center gap-3 bg-card/80 backdrop-blur rounded-xl px-4 py-3 border border-border/50 cursor-pointer hover:bg-card/95 transition-colors"
                >
                  <Avatar className="w-10 h-10 shrink-0">
                    <AvatarImage src={user.photo} alt={user.name} />
                    <AvatarFallback className="text-sm font-bold">{user.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-card-foreground truncate">{user.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin size={12} />
                      {user.location}
                    </div>
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
              ))}
          </div>
        </ScrollArea>
      </main>

      <BottomNav activePage="messages" />
    </div>
  );
};

export default MessagesPage;
