import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Registers the device with FCM/APNs and stores the token in `device_tokens`.
 * Only runs on native platforms (iOS/Android). No-op on web.
 */
export function usePushNotifications() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    if (!Capacitor.isNativePlatform()) return;

    let unsubTokenListener: (() => void) | undefined;
    let unsubReceivedListener: (() => void) | undefined;
    let unsubActionListener: (() => void) | undefined;

    (async () => {
      try {
        const { PushNotifications } = await import("@capacitor/push-notifications");

        const perm = await PushNotifications.checkPermissions();
        let status = perm.receive;
        if (status === "prompt" || status === "prompt-with-rationale") {
          const req = await PushNotifications.requestPermissions();
          status = req.receive;
        }
        if (status !== "granted") return;

        await PushNotifications.register();

        const tokenHandle = await PushNotifications.addListener("registration", async (t) => {
          const platform = Capacitor.getPlatform() as "ios" | "android";
          await supabase.from("device_tokens").upsert(
            { user_id: user.id, token: t.value, platform },
            { onConflict: "token" }
          );
        });
        unsubTokenListener = () => tokenHandle.remove();

        const errHandle = await PushNotifications.addListener("registrationError", (e) => {
          console.warn("Push registration error", e);
        });

        const recHandle = await PushNotifications.addListener("pushNotificationReceived", () => {
          // foreground: in-app toast already handled by NotificationContext
        });
        unsubReceivedListener = () => recHandle.remove();

        const actHandle = await PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
          const data: any = action.notification?.data || {};
          if (data.fromUserId) navigate(`/messages/${data.fromUserId}`);
        });
        unsubActionListener = () => actHandle.remove();
      } catch (err) {
        console.warn("Push setup failed", err);
      }
    })();

    return () => {
      unsubTokenListener?.();
      unsubReceivedListener?.();
      unsubActionListener?.();
    };
  }, [user, navigate]);
}
