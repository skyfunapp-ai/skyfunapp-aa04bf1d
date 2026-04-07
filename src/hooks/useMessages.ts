import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { userCache } from "@/data/messageStore";

export interface Message {
  id: string;
  text: string | null;
  image: string | null;
  fromMe: boolean;
  status: "sent" | "delivered" | "seen";
  timestamp: number;
  senderId: string;
  receiverId: string;
}

export const useMessages = (otherUserId?: string) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  

  const mapRow = useCallback((row: any): Message => ({
    id: row.id,
    text: row.text,
    image: row.image,
    fromMe: row.sender_id === user?.id,
    status: row.status,
    timestamp: new Date(row.created_at).getTime(),
    senderId: row.sender_id,
    receiverId: row.receiver_id,
  }), [user?.id]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async () => {
    if (!user || !otherUserId) { setLoading(false); return; }
    setLoading(true);

    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`
      )
      .order("created_at", { ascending: true });

    if (data) {
      setMessages(data.map(mapRow));
      // Mark received messages as seen
      const unseenIds = data
        .filter((m) => m.receiver_id === user.id && m.status !== "seen")
        .map((m) => m.id);
      if (unseenIds.length > 0) {
        await supabase
          .from("messages")
          .update({ status: "seen" })
          .in("id", unseenIds);
      }
    }
    setLoading(false);
  }, [user, otherUserId, mapRow]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // Real-time subscription
  useEffect(() => {
    if (!user || !otherUserId) return;

    const channel = supabase
      .channel(`messages-${user.id}-${otherUserId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const row = payload.new as any;
          const isMine = row.sender_id === user.id;
          const isConversation =
            (row.sender_id === user.id && row.receiver_id === otherUserId) ||
            (row.sender_id === otherUserId && row.receiver_id === user.id);

          if (isConversation) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === row.id)) return prev;
              return [...prev, mapRow(row)];
            });

            // Auto-mark as seen if it's from the other user
            if (!isMine) {
              supabase
                .from("messages")
                .update({ status: "seen" })
                .eq("id", row.id)
                .then(() => {});
            }
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          const row = payload.new as any;
          setMessages((prev) =>
            prev.map((m) => (m.id === row.id ? { ...m, status: row.status } : m))
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, otherUserId, mapRow]);


  const sendMessage = useCallback(async (text: string, image?: string) => {
    if (!user || !otherUserId) return;

    // Optimistic insert for instant UI feedback
    const optimisticId = `opt-${Date.now()}`;
    const optimisticMsg: Message = {
      id: optimisticId,
      text: text || null,
      image: image || null,
      fromMe: true,
      status: "sent",
      timestamp: Date.now(),
      senderId: user.id,
      receiverId: otherUserId,
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: user.id,
        receiver_id: otherUserId,
        text: text || null,
        image: image || null,
        status: "sent",
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to send message:", error);
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      return;
    }

    // Replace optimistic message with real one
    if (data) {
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticId ? mapRow(data) : m))
      );
    }

    // Trigger email notification (non-blocking)
    try {
      const senderName = userCache[user.id]?.name || "A SkyFunApp user";
      supabase.functions.invoke("notify-message", {
        body: { receiverId: otherUserId, senderName, messageText: text || null },
      }).catch(() => {});
    } catch {}

    // Update status to delivered after a short delay
    if (data) {
      setTimeout(() => {
        supabase
          .from("messages")
          .update({ status: "delivered" })
          .eq("id", data.id)
          .eq("sender_id", user.id)
          .then(() => {});
      }, 500);
    }
  }, [user, otherUserId, mapRow]);

  return { messages, loading, sendMessage, refetch: fetchMessages };
};

// Hook to get conversation list with last messages
export const useConversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<{
    userId: string;
    lastMessage: Message;
    unreadCount: number;
  }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);

    // Get all messages involving current user
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (data) {
      const convMap = new Map<string, { lastMessage: any; unreadCount: number }>();
      
      for (const row of data) {
        const otherId = row.sender_id === user.id ? row.receiver_id : row.sender_id;
        if (!convMap.has(otherId)) {
          convMap.set(otherId, {
            lastMessage: row,
            unreadCount: 0,
          });
        }
        if (row.receiver_id === user.id && row.status !== "seen") {
          const conv = convMap.get(otherId)!;
          conv.unreadCount++;
        }
      }

      const result = Array.from(convMap.entries()).map(([userId, { lastMessage, unreadCount }]) => ({
        userId,
        lastMessage: {
          id: lastMessage.id,
          text: lastMessage.text,
          image: lastMessage.image,
          fromMe: lastMessage.sender_id === user.id,
          status: lastMessage.status,
          timestamp: new Date(lastMessage.created_at).getTime(),
          senderId: lastMessage.sender_id,
          receiverId: lastMessage.receiver_id,
        },
        unreadCount,
      }));

      setConversations(result);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  // Debounced real-time updates for conversation list
  useEffect(() => {
    if (!user) return;
    let debounceTimer: ReturnType<typeof setTimeout>;

    const channel = supabase
      .channel(`conversations-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => fetchConversations(), 500);
        }
      )
      .subscribe();

    return () => {
      clearTimeout(debounceTimer);
      supabase.removeChannel(channel);
    };
  }, [user, fetchConversations]);

  return { conversations, loading, refetch: fetchConversations };
};
