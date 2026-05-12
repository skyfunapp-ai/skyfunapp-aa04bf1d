import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Heartbeat that keeps `profiles.last_seen` fresh while the user has the
 * app open. Used by the notification system to decide whether to deliver
 * a push/email instead of just an in-app toast.
 */
export function usePresence() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const ping = () => {
      supabase
        .from("profiles")
        .update({ last_seen: new Date().toISOString() })
        .eq("id", user.id)
        .then(() => {});
    };

    ping();
    const interval = setInterval(ping, 60_000);
    const onVisible = () => { if (document.visibilityState === "visible") ping(); };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [user]);
}
