import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Send, Camera, Paperclip, Check, CheckCheck, Loader2, X, Smile } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { useProfile, useConnections, useBlockedUsers } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import ChatProfileModal from "@/components/ChatProfileModal";
import { useMessages, useConversations } from "@/hooks/useMessages";
import { userCache } from "@/data/messageStore";

interface DbUser {
  id: string;
  name: string;
  profilePhoto?: string;
}

const MessagesPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [selectedUser, setSelectedUser] = useState<DbUser | null>(null);
  const [chatUsers, setChatUsers] = useState<DbUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const typingChannelRef = useRef<any>(null);

  const handleSwipe = (e: React.TouchEvent, type: "start" | "end") => {
    if (userId) return; // No swipe in chat view
    if (type === "start") { touchStartX.current = e.touches[0].clientX; return; }
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 60) navigate("/search");
  };

  const { profile } = useProfile();
  const { connectedUserIds } = useConnections();
  const { blockedUserIds, isBlocked } = useBlockedUsers();
  const { messages, loading: messagesLoading, sendMessage } = useMessages(userId);
  const { conversations } = useConversations();

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Typing indicator via Supabase broadcast
  useEffect(() => {
    if (!user || !userId) return;

    const channelName = [user.id, userId].sort().join("-");
    const channel = supabase
      .channel(`typing-${channelName}`)
      .on("broadcast", { event: "typing" }, (payload: any) => {
        if (payload.payload?.userId === userId) {
          setIsOtherTyping(true);
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setIsOtherTyping(false), 2500);
        }
      })
      .subscribe();

    typingChannelRef.current = channel;

    return () => {
      clearTimeout(typingTimeoutRef.current);
      supabase.removeChannel(channel);
      typingChannelRef.current = null;
    };
  }, [user, userId]);

  const broadcastTyping = useCallback(() => {
    if (typingChannelRef.current && user) {
      typingChannelRef.current.send({
        type: "broadcast",
        event: "typing",
        payload: { userId: user.id },
      });
    }
  }, [user]);

  useEffect(() => {
    if (!userId) { setSelectedUser(null); return; }
    if (userCache[userId]) {
      setSelectedUser(userCache[userId]);
      return;
    }
    const fetchUser = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, name, profile_photo")
        .eq("id", userId)
        .single();
      if (data) {
        const u: DbUser = { id: data.id, name: data.name || "", profilePhoto: data.profile_photo || undefined };
        userCache[userId] = u;
        setSelectedUser(u);
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    const fetchConnectedUsers = async () => {
      setLoadingUsers(true);
      // Combine connected users with users who have conversations
      const conversationUserIds = conversations.map((c) => c.userId);
      const allUserIds = [...new Set([
        ...connectedUserIds.filter((id) => !isBlocked(id)),
        ...conversationUserIds.filter((id) => !isBlocked(id)),
      ])];
      
      if (allUserIds.length === 0) { setChatUsers([]); setLoadingUsers(false); return; }
      const { data } = await supabase
        .from("profiles")
        .select("id, name, profile_photo")
        .in("id", allUserIds);
      if (data) {
        const users = data.map((p) => ({
          id: p.id,
          name: p.name || "",
          profilePhoto: p.profile_photo || undefined,
        }));
        users.forEach((u) => { userCache[u.id] = u; });
        setChatUsers(users);
      }
      setLoadingUsers(false);
    };
    if (!userId) fetchConnectedUsers();
  }, [userId, connectedUserIds, blockedUserIds, conversations]);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleSend = async () => {
    if (previewImage) {
      await sendMessage(input.trim(), previewImage);
      setInput("");
      setPreviewImage(null);
      return;
    }
    if (!input.trim()) return;
    if (isBlocked(userId || "")) {
      toast({ title: "User is blocked", description: "Unblock this user to send messages." });
      return;
    }
    await sendMessage(input.trim());
    setInput("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Only images are supported", description: "Please select an image file." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  if (userId && selectedUser) {
    const userBlocked = isBlocked(selectedUser.id);

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="min-h-screen flex flex-col bg-background">
        <HeaderMinimal />

        {showProfile && (
          <ChatProfileModal userId={selectedUser.id} onClose={() => setShowProfile(false)} />
        )}

        <div className="fixed top-14 sm:top-16 left-0 right-0 z-30 bg-background border-b border-border/30 shadow-md px-4 py-2.5">
          <div className="flex items-center">
            <button onClick={() => navigate("/search")} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors shrink-0">
              <ArrowLeft size={20} />
            </button>
            <button onClick={() => setShowProfile(true)} className="flex-1 flex items-center justify-center gap-2 hover:opacity-80 transition-opacity -ml-5">
              <Avatar className="w-8 h-8">
                <AvatarImage src={selectedUser.profilePhoto} alt={selectedUser.name} />
                <AvatarFallback className="text-xs font-bold">{getInitials(selectedUser.name)}</AvatarFallback>
              </Avatar>
              <p className="text-sm font-semibold text-primary-foreground">{selectedUser.name}</p>
            </button>
          </div>
        </div>

        <main className="flex-1 flex flex-col pt-32 sm:pt-36 pb-20 px-4">

          <ScrollArea className="flex-1 mb-4" ref={scrollRef}>
            <div className="space-y-3 min-h-[200px]">
              {messagesLoading && (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-muted-foreground" size={24} />
                </div>
              )}
              {!messagesLoading && messages.length === 0 && !userBlocked && (
                <p className="text-center text-muted-foreground text-sm mt-12">Say hello to {selectedUser.name}!</p>
              )}
              {userBlocked && (
                <p className="text-center text-destructive text-sm mt-12">You have blocked this user. Unblock from their profile to chat.</p>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.fromMe ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${msg.fromMe ? "bg-accent text-accent-foreground rounded-br-sm" : "bg-card text-card-foreground border border-border/50 rounded-bl-sm"}`}>
                    {msg.image && (
                      <img src={msg.image} alt="Shared" className="rounded-lg mb-1 max-w-full max-h-48 object-cover" />
                    )}
                    {msg.text && <span>{msg.text}</span>}
                  </div>
                  <div className={`flex items-center gap-1 mt-0.5 px-1 ${msg.fromMe ? "flex-row-reverse" : ""}`}>
                    <span className="text-[10px] text-muted-foreground">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.fromMe && (
                      <span className="flex items-center">
                        {msg.status === "seen" ? <CheckCheck size={12} className="text-accent" /> : msg.status === "delivered" ? <CheckCheck size={12} className="text-muted-foreground" /> : <Check size={12} className="text-muted-foreground" />}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {!userBlocked && (
            <div>
              {previewImage && (
                <div className="relative inline-block mb-2">
                  <img src={previewImage} alt="Preview" className="h-20 rounded-lg border border-border/50" />
                  <button onClick={() => setPreviewImage(null)} className="absolute -top-2 -right-2 p-0.5 bg-destructive text-destructive-foreground rounded-full">
                    <X size={14} />
                  </button>
                </div>
              )}
              {showEmoji && (
                <div className="flex flex-wrap gap-1 mb-2 p-2 bg-card border border-border rounded-xl max-h-32 overflow-y-auto">
                  {["😀","😂","😍","🥰","😎","🤩","😢","😡","👍","👎","❤️","🔥","🎉","✈️","🌍","💬","🙏","👋","😊","🤔","😅","🥺","💀","🫡","✨","💯","🙌","😭","🤣","😘"].map((emoji) => (
                    <button key={emoji} type="button" onClick={() => { setInput((prev) => prev + emoji); setShowEmoji(false); }} className="text-xl p-1 hover:bg-muted rounded">
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-end gap-2">
                <button onClick={() => cameraInputRef.current?.click()} className="p-2.5 text-muted-foreground hover:text-primary-foreground transition-colors shrink-0">
                  <Camera size={20} />
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="p-2.5 text-muted-foreground hover:text-primary-foreground transition-colors shrink-0">
                  <Paperclip size={20} />
                </button>
                <button onClick={() => setShowEmoji(!showEmoji)} className="p-2.5 text-muted-foreground hover:text-primary-foreground transition-colors shrink-0">
                  <Smile size={20} />
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  rows={1}
                  className="flex-1 bg-card text-card-foreground border border-border rounded-2xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none max-h-24 overflow-y-auto"
                  style={{ minHeight: '40px' }}
                  onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 96) + 'px'; }}
                />
                <button onClick={handleSend} className="p-2.5 bg-accent text-accent-foreground rounded-full hover:opacity-90 transition-opacity shrink-0">
                  <Send size={18} />
                </button>
              </div>
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileSelect} />
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center mt-2">Skoin balance: {profile.skoinBalance}</p>
        </main>

        <BottomNav activePage="messages" />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="min-h-screen flex flex-col bg-background" onTouchStart={(e) => handleSwipe(e, "start")} onTouchEnd={(e) => handleSwipe(e, "end")}>
      <HeaderMinimal />

      <main className="flex-1 flex flex-col pt-20 sm:pt-24 pb-20 px-4">
        <h2 className="text-lg font-bold text-primary-foreground mb-4">Messages</h2>

        <ScrollArea className="flex-1">
          {loadingUsers ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-muted-foreground" size={24} />
            </div>
          ) : chatUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground text-sm text-center">No conversations yet.</p>
              <p className="text-muted-foreground text-xs text-center mt-1">Connect with users from the Search page to start chatting.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {chatUsers.map((u) => {
                const conv = conversations.find((c) => c.userId === u.id);
                const lastMsg = conv?.lastMessage;
                const unreadCount = conv?.unreadCount || 0;
                return (
                  <div
                    key={u.id}
                    onClick={() => navigate(`/messages/${u.id}`)}
                    className="flex items-center gap-3 bg-card/80 backdrop-blur rounded-xl px-4 py-3 border border-border/50 cursor-pointer hover:bg-card/95 transition-colors"
                  >
                    <div className="relative shrink-0">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={u.profilePhoto} alt={u.name} />
                        <AvatarFallback className="text-sm font-bold">{getInitials(u.name)}</AvatarFallback>
                      </Avatar>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{unreadCount}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${unreadCount > 0 ? "font-bold text-card-foreground" : "font-semibold text-card-foreground"}`}>{u.name}</p>
                      <p className={`text-xs truncate ${unreadCount > 0 ? "text-card-foreground font-medium" : "text-muted-foreground"}`}>
                        {lastMsg ? (lastMsg.image ? (lastMsg.fromMe ? "You: 📷 Photo" : "📷 Photo") : lastMsg.fromMe ? `You: ${lastMsg.text}` : lastMsg.text) : "Tap to chat"}
                      </p>
                    </div>
                    <div className="w-3 h-3 rounded-full shrink-0 bg-green-500" />
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </main>

      <BottomNav activePage="messages" />
    </motion.div>
  );
};

export default MessagesPage;
