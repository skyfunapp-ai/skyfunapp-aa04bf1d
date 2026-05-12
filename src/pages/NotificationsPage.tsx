import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { Switch } from "@/components/ui/switch";
import { Bell, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Capacitor } from "@capacitor/core";

interface Prefs {
  push_enabled: boolean;
  email_enabled: boolean;
  marketing_emails: boolean;
  consent_at: string | null;
}

const DEFAULT_PREFS: Prefs = {
  push_enabled: true,
  email_enabled: true,
  marketing_emails: false,
  consent_at: null,
};

const NotificationsPage = () => {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("notification_preferences")
        .select("push_enabled,email_enabled,marketing_emails,consent_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) setPrefs(data as Prefs);
      else {
        await supabase
          .from("notification_preferences")
          .upsert({ user_id: user.id }, { onConflict: "user_id" });
      }
      setLoading(false);
    })();
  }, [user]);

  const updatePref = async (patch: Partial<Prefs>) => {
    if (!user) return;
    const next = { ...prefs, ...patch };
    setPrefs(next);
    setSaving(true);
    const { error } = await supabase
      .from("notification_preferences")
      .upsert(
        { user_id: user.id, ...next, consent_at: next.consent_at ?? new Date().toISOString() },
        { onConflict: "user_id" },
      );
    setSaving(false);
    if (error) {
      toast({ title: "Could not save", description: error.message, variant: "destructive" });
    }
  };

  const handlePushToggle = async (checked: boolean) => {
    if (checked && Capacitor.isNativePlatform()) {
      try {
        const { PushNotifications } = await import("@capacitor/push-notifications");
        const status = await PushNotifications.checkPermissions();
        if (status.receive !== "granted") {
          const req = await PushNotifications.requestPermissions();
          if (req.receive !== "granted") {
            toast({
              title: "Permission needed",
              description: "Enable notifications for SkyFunApp in your device settings.",
            });
            return;
          }
        }
        await PushNotifications.register();
      } catch {}
    }
    if (!checked && user) {
      // Remove this device's registered tokens to stop pushes
      await supabase.from("device_tokens").delete().eq("user_id", user.id);
    }
    await updatePref({ push_enabled: checked });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />
      <main className="flex-1 flex flex-col items-center pt-20 sm:pt-24 pb-24 px-4">
        <div className="max-w-md w-full">
          <Link
            to="/privacy"
            className="inline-flex items-center gap-1 text-primary-foreground/80 hover:text-primary-foreground mb-4 text-sm"
          >
            <ArrowLeft size={16} /> Back
          </Link>
          <h1 className="text-3xl font-bold text-primary-foreground mb-6 flex items-center gap-2">
            <Bell size={28} /> Notifications
          </h1>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-primary-foreground" />
            </div>
          ) : (
            <div className="space-y-3">
              <PrefRow
                title="Push notifications"
                description="Get a banner on your device when someone messages you."
                checked={prefs.push_enabled}
                onChange={handlePushToggle}
              />
              <PrefRow
                title="Email notifications"
                description="Email you when you miss a message while offline."
                checked={prefs.email_enabled}
                onChange={(v) => updatePref({ email_enabled: v })}
              />
              <PrefRow
                title="News & promotions"
                description="Occasional updates about new features and offers."
                checked={prefs.marketing_emails}
                onChange={(v) => updatePref({ marketing_emails: v })}
              />

              <div className="bg-card/60 backdrop-blur rounded-xl p-4 border border-border/40 mt-6">
                <h3 className="font-semibold text-card-foreground mb-1 text-sm">Your consent</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  By enabling notifications you consent to SkyFunApp sending you push and email messages
                  related to your activity. You can change these preferences at any time.
                  {prefs.consent_at && (
                    <span className="block mt-2 opacity-70">
                      Last updated: {new Date(prefs.consent_at).toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>

              {saving && (
                <p className="text-xs text-muted-foreground text-center pt-2">Saving…</p>
              )}
            </div>
          )}
        </div>
      </main>
      <BottomNav activePage="profile" />
    </div>
  );
};

const PrefRow = ({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50 flex items-start justify-between gap-4">
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-card-foreground text-base">{title}</h3>
      <p className="text-muted-foreground text-sm mt-1">{description}</p>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

export default NotificationsPage;
