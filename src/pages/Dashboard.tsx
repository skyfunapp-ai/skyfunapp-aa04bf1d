import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Coins, Plane, Camera, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import EditProfileModal from "@/components/EditProfileModal";
import ShareBanner from "@/components/ShareBanner";
import ReferralCard from "@/components/ReferralCard";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useProfile, type ProfileData } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const WELCOME_KEY = "skyfun_last_welcome_at";
const WELCOME_HOURS = 12;
const REF_PENDING_KEY = "skyfun_pending_ref_code";

const Dashboard = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const { profile, loading, updateProfile } = useProfile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const touchStartX = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Welcome-back toast (max once per WELCOME_HOURS)
  useEffect(() => {
    if (!user) return;
    const last = Number(localStorage.getItem(WELCOME_KEY) || 0);
    const hours = (Date.now() - last) / (1000 * 60 * 60);
    if (hours >= WELCOME_HOURS) {
      localStorage.setItem(WELCOME_KEY, String(Date.now()));
      setTimeout(() => {
        toast({
          title: "Welcome back ✈️",
          description: "Share SkyFunApp with a friend and earn 5 Skoins each!",
        });
      }, 600);
    }
  }, [user]);

  // Redeem pending referral code after sign-in
  useEffect(() => {
    if (!user) return;
    const pending = sessionStorage.getItem(REF_PENDING_KEY) || localStorage.getItem(REF_PENDING_KEY);
    if (!pending) return;
    sessionStorage.removeItem(REF_PENDING_KEY);
    localStorage.removeItem(REF_PENDING_KEY);
    (async () => {
      const { data, error } = await supabase.rpc("redeem_referral", { p_code: pending });
      if (error) return;
      const result = data as { success?: boolean; error?: string; reward?: number };
      if (result?.success) {
        toast({ title: "Referral applied! 🎉", description: `You earned ${result.reward} Skoins.` });
      }
    })();
  }, [user]);

  const handleSwipe = (e: React.TouchEvent, type: "start" | "end") => {
    if (type === "start") { touchStartX.current = e.touches[0].clientX; return; }
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff < -60) navigate("/search");
  };

  const handleSaveProfile = async (data: ProfileData) => {
    const result = await updateProfile(data);
    if (result?.error) {
      toast({ title: "Error saving profile", description: result.error, variant: "destructive" });
    }
  };

  const handleEditClick = () => setIsEditOpen(true);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image too large", description: "Please choose an image under 5 MB.", variant: "destructive" });
      return;
    }
    setUploadingPhoto(true);
    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const filePath = `${user.id}/avatar.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("profile-photos")
        .upload(filePath, file, { upsert: true, cacheControl: "3600" });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("profile-photos").getPublicUrl(filePath);
      const photoUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      const result = await updateProfile({ profilePhoto: photoUrl });
      if (result?.error) throw new Error(result.error);
      toast({ title: "Profile photo updated" });
    } catch (err) {
      toast({ title: "Upload failed", description: err instanceof Error ? err.message : "Try again.", variant: "destructive" });
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const isProfileEmpty = !loading && !profile.name && !profile.occupation;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-primary-foreground">Loading...</p>
    </div>
  );

  return (
    <motion.div initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="min-h-screen flex flex-col bg-background" onTouchStart={(e) => handleSwipe(e, "start")} onTouchEnd={(e) => handleSwipe(e, "end")}>
      <HeaderMinimal onEditClick={handleEditClick} showEdit={true} />
      
      <main className="flex-1 flex flex-col pt-20 sm:pt-24 pb-20">
        <div className="w-full max-w-md mx-auto">
          <ShareBanner />
          <ReferralCard />
        </div>
        <div className="flex-1 flex flex-col items-center w-full">
        {isProfileEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <p className="text-xl text-primary-foreground mb-4">Your profile is empty</p>
            <p className="text-muted-foreground mb-6">Tap the edit icon to add your information</p>
            <button
              onClick={handleEditClick}
              className="px-6 py-3 bg-accent text-accent-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Set Up Profile
            </button>
          </div>
        ) : (
          <div className="mt-6 text-center px-4 w-full max-w-md mx-auto">
            <div className="flex justify-center mb-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                aria-label="Change profile photo"
                className="relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Avatar className="w-32 h-32 sm:w-44 sm:h-44 ring-4 ring-primary-foreground/30 shadow-[0_0_30px_rgba(255,255,255,0.25)]">
                  <AvatarImage src={profile.profilePhoto} alt={profile.name || "Profile"} className="object-cover" />
                  <AvatarFallback className="text-3xl sm:text-5xl font-bold">
                    {profile.name ? profile.name.split(" ").map(n => n[0]).join("") : "+"}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-1 right-1 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-accent text-accent-foreground shadow-md border-2 border-background">
                  {uploadingPhoto ? <Loader2 size={16} className="animate-spin" /> : <Camera size={18} />}
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <h2 className="text-2xl font-bold text-primary-foreground">{profile.name}</h2>
            <p className="text-primary-foreground mt-2">{profile.occupation}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-accent/20 px-3 py-1 rounded-full">
              <Coins size={16} className="text-accent" />
              <span className="text-accent font-semibold">{profile.skoinBalance} Skoin</span>
            </div>
            {profile.currentAirport && (
              <p className="text-primary-foreground mt-1 flex items-center justify-center gap-1 text-sm">
                <MapPin size={14} /> From: {profile.currentAirport}
              </p>
            )}
            {profile.destinationAirport && (
              <p className="text-primary-foreground mt-1 flex items-center justify-center gap-1 text-sm">
                <MapPin size={14} /> To: {profile.destinationAirport}
              </p>
            )}
            
            <div className="mt-4">
              <p className="text-primary-foreground font-semibold">Hobbies</p>
              {(profile.hobbies?.length ?? 0) > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {profile.hobbies?.map((hobby, i) => (
                    <span key={i} className="text-primary-foreground text-sm">{hobby}</span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-3">
              <p className="text-primary-foreground font-semibold">Interested In</p>
              {(profile.interestedIn?.length ?? 0) > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {profile.interestedIn?.map((interest, i) => (
                    <span key={i} className="text-primary-foreground text-sm">{interest}</span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-3">
              <p className="text-primary-foreground font-semibold">Favorite Food</p>
              {(profile.favoriteFood?.length ?? 0) > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {profile.favoriteFood?.map((food, i) => (
                    <span key={i} className="text-primary-foreground text-sm">{food}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </main>
      
      <BottomNav activePage="profile" />
      
      <EditProfileModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        profileData={profile}
        onSave={handleSaveProfile}
      />
    </motion.div>
  );
};

export default Dashboard;
