import { useState } from "react";
import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import EditProfileModal from "@/components/EditProfileModal";
import ziplineImage from "@/assets/zipline.jpeg";
import bikingImage from "@/assets/biking.jpeg";

interface ProfileData {
  name: string;
  occupation: string;
  hobbies: string[];
  interestedIn: string[];
  favoriteFood: string[];
}

const Dashboard = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Cynthia-Marie Smith",
    occupation: "Business Owner",
    hobbies: [],
    interestedIn: [],
    favoriteFood: [],
  });

  const handleEditClick = () => {
    setIsEditOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal onEditClick={handleEditClick} />
      
      <main className="flex-1 flex flex-col items-center pt-24 pb-20">
        <div className="flex w-full justify-center items-stretch">
          <img 
            src={ziplineImage} 
            alt="Zipline adventure" 
            className="w-1/2 h-[288px] object-cover"
          />
          <img 
            src={bikingImage} 
            alt="Beach biking" 
            className="w-1/2 h-[288px] object-cover"
          />
        </div>
        
        <div className="mt-6 text-center px-4">
          <h2 className="text-2xl font-bold text-primary-foreground">{profileData.name}</h2>
          <p className="text-primary-foreground mt-2">{profileData.occupation}</p>
          
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
