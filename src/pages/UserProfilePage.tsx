import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { appUsers } from "@/data/flights";
import { MapPin, ArrowLeft, MessageCircle, ShieldAlert, ShieldCheck } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useProfile, useConnections, useBlockedUsers } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = appUsers.find((u) => u.id === userId);

  const { profile, updateProfile } = useProfile();
  const { addConnection, isConnected } = useConnections();
  const { isBlocked, blockUser, unblockUser } = useBlockedUsers();

  const blocked = userId ? isBlocked(userId) : false;

  useEffect(() => {
    if (userId && blocked) {
      navigate("/search", { replace: true });
    }
  }, [userId, blocked, navigate]);

  const toggleBlock = async () => {
    if (!userId || !user) return;
    if (blocked) {
      await unblockUser(userId);
      toast({ title: `${user.name} unblocked` });
    } else {
      await blockUser(userId);
      toast({ title: `${user.name} blocked` });
      setTimeout(() => navigate("/search", { replace: true }), 500);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <HeaderMinimal />
        <main className="flex-1 flex items-center justify-center pt-20 sm:pt-24 pb-20">
          <p className="text-primary-foreground">User not found</p>
        </main>
        <BottomNav activePage="search" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />

      <main className="flex-1 flex flex-col items-center pt-20 sm:pt-24 pb-20 px-4">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </button>

          <div className="flex flex-col items-center">
            <Avatar className="w-28 h-28 mb-4">
              <AvatarImage src={user.photo} alt={user.name} />
              <AvatarFallback className="text-2xl font-bold">{user.avatar}</AvatarFallback>
            </Avatar>

            <h1 className="text-2xl font-bold text-primary-foreground">{user.name}</h1>

            <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
              <MapPin size={14} />
              <span className="text-sm">{user.location}</span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  user.status === "online"
                    ? "bg-green-500"
                    : user.status === "away"
                    ? "bg-yellow-500"
                    : "bg-muted-foreground/40"
                }`}
              />
              <span className="text-sm text-muted-foreground capitalize">{user.status}</span>
            </div>

            <p className="text-primary-foreground/80 mt-4 text-center">{user.bio}</p>

            <div className="flex items-center gap-3 mt-6 bg-card/80 backdrop-blur rounded-xl px-5 py-3 border border-border/50">
              {blocked ? <ShieldAlert size={18} className="text-destructive" /> : <ShieldCheck size={18} className="text-green-500" />}
              <Label htmlFor="block-toggle" className="text-sm text-primary-foreground cursor-pointer">
                {blocked ? "Blocked" : "Block User"}
              </Label>
              <Switch id="block-toggle" checked={blocked} onCheckedChange={toggleBlock} />
            </div>

            {!blocked && (
              <button
                onClick={async () => {
                  if (!isConnected(user.id)) {
                    try {
                      const { data: { session } } = await supabase.auth.getSession();
                      const { data, error } = await supabase.functions.invoke("deduct-skoin", {
                        headers: { Authorization: `Bearer ${session?.access_token}` },
                        body: { connected_user_id: user.id },
                      });
                      if (error) throw error;
                      if (data?.error) {
                        toast({ title: "No Skoin remaining", description: "Purchase Skoin to connect with new users." });
                        navigate("/skoin");
                        return;
                      }
                      if (!data?.already_connected) {
                        await addConnection(user.id);
                        toast({ title: `Connected with ${user.name}`, description: "1 Skoin used. You can now chat freely!" });
                      }
                    } catch (err: any) {
                      toast({ title: "Error", description: err.message || "Could not connect", variant: "destructive" });
                      return;
                    }
                  }
                  navigate(`/messages/${user.id}`);
                }}
                className="mt-4 flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                <MessageCircle size={18} />
                Send Message
              </button>
            )}
          </div>
        </div>
      </main>

      <BottomNav activePage="search" />
    </div>
  );
};

export default UserProfilePage;
