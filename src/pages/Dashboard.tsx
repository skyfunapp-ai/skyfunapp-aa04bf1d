import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import EditProfileModal from "@/components/EditProfileModal";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfileData {
  name: string;
  occupation: string;
  hobbies: string[];
  interestedIn: string[];
  favoriteFood: string[];
  profilePhoto?: string;
  currentAirport?: string;
  destinationAirport?: string;
}

const Dashboard = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    occupation: "",
    hobbies: [],
    interestedIn: [],
    favoriteFood: [],
  });

  // Initialize 3 free Skoin for new users
  useEffect(() => {
    if (localStorage.getItem("skoinBalance") === null) {
      localStorage.setItem("skoinBalance", "5");
    }
  }, []);

  const handleEditClick = () => {
    setIsEditOpen(true);
  };

  const isProfileEmpty = !profileData.name && !profileData.occupation;

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
            {profileData.profilePhoto && (
              <div className="flex justify-center mb-4">
                <Avatar className="w-28 h-28">
                  <AvatarImage src={profileData.profilePhoto} alt={profileData.name} />
                  <AvatarFallback className="text-2xl font-bold">
                    {profileData.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            <h2 className="text-2xl font-bold text-primary-foreground">{profileData.name}</h2>
            <p className="text-primary-foreground mt-2">{profileData.occupation}</p>
            {profileData.currentAirport && (
              <p className="text-primary-foreground/70 mt-1 flex items-center justify-center gap-1 text-sm">
                <MapPin size={14} /> From: {profileData.currentAirport}
              </p>
            )}
            {profileData.destinationAirport && (
              <p className="text-primary-foreground/70 mt-1 flex items-center justify-center gap-1 text-sm">
                <MapPin size={14} /> To: {profileData.destinationAirport}
              </p>
            )}
            
            <div className="mt-4">
              <p className="text-primary-foreground font-semibold">Hobbies</p>
              {profileData.hobbies.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {profileData.hobbies.map((hobby, i) => (
                    <span key={i} className="text-primary-foreground/80 text-sm">{hobby}</span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-3">
              <p className="text-primary-foreground font-semibold">Interested In</p>
              {profileData.interestedIn.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {profileData.interestedIn.map((interest, i) => (
                    <span key={i} className="text-primary-foreground/80 text-sm">{interest}</span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-3">
              <p className="text-primary-foreground font-semibold">Favorite Food</p>
              {profileData.favoriteFood.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {profileData.favoriteFood.map((food, i) => (
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
        profileData={profileData}
        onSave={setProfileData}
      />
    </div>
  );
};

export default Dashboard;
