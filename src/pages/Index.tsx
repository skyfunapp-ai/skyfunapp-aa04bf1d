import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import ProfileCard from "@/components/ProfileCard";
import ActionButtons from "@/components/ActionButtons";
import MatchModal from "@/components/MatchModal";
import EmptyState from "@/components/EmptyState";
import { profiles as initialProfiles } from "@/data/profiles";
import { Profile } from "@/types/profile";
import { toast } from "sonner";
import { Globe } from "lucide-react";

const Index = () => {
  const [profiles, setProfiles] = useState<Profile[]>([...initialProfiles]);
  const [swipedProfiles, setSwipedProfiles] = useState<Profile[]>([]);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  const currentProfile = profiles[profiles.length - 1];

  const handleSwipe = useCallback((direction: "left" | "right" | "up") => {
    if (!currentProfile) return;

    const swipedProfile = currentProfile;
    setSwipedProfiles((prev) => [...prev, swipedProfile]);
    setProfiles((prev) => prev.slice(0, -1));

    if (direction === "right") {
      // Simulate 30% match chance
      if (Math.random() < 0.3) {
        setMatchedProfile(swipedProfile);
        setIsMatchModalOpen(true);
      } else {
        toast.success(`You liked ${swipedProfile.name}!`, {
          icon: "❤️",
        });
      }
    } else if (direction === "up") {
      toast.success(`Super liked ${swipedProfile.name}!`, {
        icon: "⭐",
      });
      // Super likes always match
      setMatchedProfile(swipedProfile);
      setIsMatchModalOpen(true);
    } else {
      toast(`Passed on ${swipedProfile.name}`, {
        icon: "👋",
      });
    }
  }, [currentProfile]);

  const handleNope = useCallback(() => handleSwipe("left"), [handleSwipe]);
  const handleLike = useCallback(() => handleSwipe("right"), [handleSwipe]);
  const handleSuperLike = useCallback(() => handleSwipe("up"), [handleSwipe]);

  const handleUndo = useCallback(() => {
    if (swipedProfiles.length === 0) return;
    
    const lastSwiped = swipedProfiles[swipedProfiles.length - 1];
    setSwipedProfiles((prev) => prev.slice(0, -1));
    setProfiles((prev) => [...prev, lastSwiped]);
    
    toast("Profile restored!", { icon: "↩️" });
  }, [swipedProfiles]);

  const handleRefresh = useCallback(() => {
    setProfiles([...initialProfiles]);
    setSwipedProfiles([]);
    toast.success("Profiles refreshed!");
  }, []);

  const handleCloseMatchModal = useCallback(() => {
    setIsMatchModalOpen(false);
    setMatchedProfile(null);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-lg mx-auto px-4 pt-20 pb-8 h-screen flex flex-col">
        {/* Globe Icon & Auth Links */}
        <div className="flex flex-col items-center py-4 space-y-3">
          <div className="animate-spin-slow">
            <Globe size={80} className="text-emerald-400" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col items-center space-y-1 text-primary-foreground">
            <button className="text-lg font-medium hover:underline">Check In (Log In)</button>
            <button className="text-sm opacity-80 hover:underline">Purchase Flight (Create Account)</button>
          </div>
        </div>
        
        {/* Card Stack */}
        <div className="relative flex-1 min-h-0 mb-6">
          {profiles.length === 0 ? (
            <EmptyState onRefresh={handleRefresh} />
          ) : (
            <div className="relative w-full h-full">
              <AnimatePresence>
                {profiles.map((profile, index) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    onSwipe={handleSwipe}
                    isTop={index === profiles.length - 1}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {profiles.length > 0 && (
          <div className="pb-4">
            <ActionButtons
              onNope={handleNope}
              onLike={handleLike}
              onSuperLike={handleSuperLike}
              onUndo={handleUndo}
              canUndo={swipedProfiles.length > 0}
            />
          </div>
        )}
      </main>

      {/* Match Modal */}
      <MatchModal
        isOpen={isMatchModalOpen}
        onClose={handleCloseMatchModal}
        matchedProfile={matchedProfile}
      />
    </div>
  );
};

export default Index;
