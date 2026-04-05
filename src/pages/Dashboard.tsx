import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Coins, Plane } from "lucide-react";
import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import EditProfileModal from "@/components/EditProfileModal";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useProfile, type ProfileData } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { profile, loading, updateProfile } = useProfile();
  const navigate = useNavigate();
  const touchStartX = useRef(0);

  const handleSwipe = (e: React.TouchEvent, type: "start" | "end") => {
    if (type === "start") { touchStartX.current = e.touches[0].clientX; return; }
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff < -60) navigate("/search");
  };

  const handleSaveProfile = async (data: ProfileData) => {
    const result = await updateProfile(data);
    if (result?.error) {
      toast({ title: "Error saving profile", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Profile saved successfully" });
    }
  };

  const handleEditClick = () => setIsEditOpen(true);

  const isProfileEmpty = !loading && !profile.name && !profile.occupation;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-primary-foreground">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background" onTouchStart={(e) => handleSwipe(e, "start")} onTouchEnd={(e) => handleSwipe(e, "end")}>
      <HeaderMinimal onEditClick={handleEditClick} showEdit={true} />
      
      <main className="flex-1 flex flex-col items-center pt-20 sm:pt-24 pb-20">
        {isProfileEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <p className="text-xl text-primary-foreground/70 mb-4">Your profile is empty</p>
            <p className="text-muted-foreground mb-6">Tap the edit icon to add your information</p>
            <button
              onClick={handleEditClick}
              className="px-6 py-3 bg-accent text-accent-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Set Up Profile
            </button>
          </div>
        ) : (
          <div className="mt-6 text-center px-4">
            {profile.profilePhoto && (
              <div className="flex justify-center mb-4">
                <Avatar className="w-28 h-28">
                  <AvatarImage src={profile.profilePhoto} alt={profile.name} />
                  <AvatarFallback className="text-2xl font-bold">
                    {profile.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            <h2 className="text-2xl font-bold text-primary-foreground">{profile.name}</h2>
            <p className="text-primary-foreground mt-2">{profile.occupation}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-accent/20 px-3 py-1 rounded-full">
              <Coins size={16} className="text-accent" />
              <span className="text-accent font-semibold">{profile.skoinBalance} Skoin</span>
            </div>
            {profile.currentAirport && (
              <p className="text-primary-foreground/70 mt-1 flex items-center justify-center gap-1 text-sm">
                <MapPin size={14} /> From: {profile.currentAirport}
              </p>
            )}
            {profile.destinationAirport && (
              <p className="text-primary-foreground/70 mt-1 flex items-center justify-center gap-1 text-sm">
                <MapPin size={14} /> To: {profile.destinationAirport}
              </p>
            )}
            
            <div className="mt-4">
              <p className="text-primary-foreground font-semibold">Hobbies</p>
              {profile.hobbies.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {profile.hobbies.map((hobby, i) => (
                    <span key={i} className="text-primary-foreground/80 text-sm">{hobby}</span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-3">
              <p className="text-primary-foreground font-semibold">Interested In</p>
              {profile.interestedIn.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {profile.interestedIn.map((interest, i) => (
                    <span key={i} className="text-primary-foreground/80 text-sm">{interest}</span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-3">
              <p className="text-primary-foreground font-semibold">Favorite Food</p>
              {profile.favoriteFood.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {profile.favoriteFood.map((food, i) => (
                    <span key={i} className="text-primary-foreground/80 text-sm">{food}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      <BottomNav activePage="profile" />
      
      <EditProfileModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        profileData={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default Dashboard;
