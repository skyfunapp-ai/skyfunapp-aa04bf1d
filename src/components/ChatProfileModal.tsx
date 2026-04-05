import { useEffect, useState } from "react";
import { X, MapPin, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  name: string;
  occupation: string;
  profilePhoto?: string;
  hobbies: string[];
  interestedIn: string[];
  favoriteFood: string[];
  currentAirport?: string;
  destinationAirport?: string;
}

interface ChatProfileModalProps {
  userId: string;
  onClose: () => void;
}

const ChatProfileModal = ({ userId, onClose }: ChatProfileModalProps) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("name, occupation, profile_photo, hobbies, interested_in, favorite_food, current_airport, destination_airport")
        .eq("id", userId)
        .single();
      if (data) {
        setProfile({
          name: data.name || "",
          occupation: data.occupation || "",
          profilePhoto: data.profile_photo || undefined,
          hobbies: data.hobbies || [],
          interestedIn: data.interested_in || [],
          favoriteFood: data.favorite_food || [],
          currentAirport: data.current_airport || undefined,
          destinationAirport: data.destination_airport || undefined,
        });
      }
      setLoading(false);
    };
    fetch();
  }, [userId]);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-2xl w-[90%] max-w-sm max-h-[80vh] overflow-y-auto p-6 relative border border-border/50" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors">
          <X size={18} className="text-muted-foreground" />
        </button>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-muted-foreground" size={24} />
          </div>
        ) : profile ? (
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-3">
              <AvatarImage src={profile.profilePhoto} alt={profile.name} />
              <AvatarFallback className="text-2xl font-bold">{getInitials(profile.name)}</AvatarFallback>
            </Avatar>

            <h2 className="text-xl font-bold text-card-foreground">{profile.name}</h2>

            {profile.occupation && (
              <p className="text-muted-foreground text-sm mt-1">{profile.occupation}</p>
            )}

            {profile.currentAirport && (
              <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
                <MapPin size={13} />
                <span className="text-xs">From: {profile.currentAirport}</span>
              </div>
            )}

            {profile.destinationAirport && (
              <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
                <MapPin size={13} />
                <span className="text-xs">To: {profile.destinationAirport}</span>
              </div>
            )}

            {profile.hobbies.length > 0 && (
              <div className="mt-4 text-center">
                <p className="text-card-foreground font-semibold text-xs uppercase tracking-wide">Hobbies</p>
                <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                  {profile.hobbies.map((h, i) => (
                    <span key={i} className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{h}</span>
                  ))}
                </div>
              </div>
            )}

            {profile.interestedIn.length > 0 && (
              <div className="mt-3 text-center">
                <p className="text-card-foreground font-semibold text-xs uppercase tracking-wide">Interested In</p>
                <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                  {profile.interestedIn.map((item, i) => (
                    <span key={i} className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{item}</span>
                  ))}
                </div>
              </div>
            )}

            {profile.favoriteFood.length > 0 && (
              <div className="mt-3 text-center">
                <p className="text-card-foreground font-semibold text-xs uppercase tracking-wide">Favorite Food</p>
                <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                  {profile.favoriteFood.map((f, i) => (
                    <span key={i} className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{f}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">Profile not found</p>
        )}
      </div>
    </div>
  );
};

export default ChatProfileModal;
