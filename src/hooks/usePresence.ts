import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Updates the user's last_seen timestamp while active.
// Throttles writes; only pings when tab is visible and user is interacting.
export function usePresenceHeartbeat() {
  const { user } = useAuth();
  const lastPingRef = useRef(0);
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    if (!user) return;

    const ACTIVE_WINDOW_MS = 60_000; // consider active if interacted in last 60s
    const PING_INTERVAL_MS = 60_000; // write at most once a minute

    const ping = async (force = false) => {
      const now = Date.now();
      if (!force && now - lastPingRef.current < PING_INTERVAL_MS) return;
      // Only ping if user has been active recently or forced
      if (!force && now - lastActivityRef.current > ACTIVE_WINDOW_MS) return;
      lastPingRef.current = now;
      await supabase
        .from("profiles")
        .update({ last_seen: new Date().toISOString() })
        .eq("id", user.id);
    };

    const markActivity = () => {
      lastActivityRef.current = Date.now();
      ping();
    };

    // Initial ping
    ping(true);

    const events = ["mousemove", "keydown", "click", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, markActivity, { passive: true }));

    const interval = setInterval(() => ping(), PING_INTERVAL_MS);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        markActivity();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      events.forEach((e) => window.removeEventListener(e, markActivity));
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(interval);
    };
  }, [user]);
}

export type PresenceStatus = "online" | "idle" | "offline";

export function getPresenceStatus(lastSeen?: string | null): PresenceStatus {
  if (!lastSeen) return "offline";
  const diffMs = Date.now() - new Date(lastSeen).getTime();
  const minutes = diffMs / 60_000;
  if (minutes <= 2) return "online";
  if (minutes <= 30) return "idle";
  return "offline";
}

export function getPresenceDotClass(status: PresenceStatus): string {
  switch (status) {
    case "online":
      return "bg-green-500";
    case "idle":
      return "bg-orange-500";
    default:
      return "bg-red-500";
  }
}
