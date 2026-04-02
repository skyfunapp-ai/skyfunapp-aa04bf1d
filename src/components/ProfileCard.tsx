import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { MapPin, Heart, X, Star } from "lucide-react";
import { Profile } from "@/types/profile";

interface ProfileCardProps {
  profile: Profile;
  onSwipe: (direction: "left" | "right" | "up") => void;
  isTop: boolean;
}

const ProfileCard = ({ profile, onSwipe, isTop }: ProfileCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);
  const superlikeOpacity = useTransform(y, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const swipeThreshold = 100;
    
    if (info.offset.x > swipeThreshold) {
      onSwipe("right");
    } else if (info.offset.x < -swipeThreshold) {
      onSwipe("left");
    } else if (info.offset.y < -swipeThreshold) {
      onSwipe("up");
    }
  };

  return (
    <motion.div
      className="absolute w-full h-full"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.3 }
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-card bg-card">
        {/* Profile Image */}
        <img
          src={profile.image}
          alt={profile.name}
          className="w-full h-full object-cover"
          draggable={false}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent" />
        
        {/* Like Indicator */}
        <motion.div
          className="absolute top-8 right-8 px-6 py-3 rounded-xl border-4 border-like rotate-12"
          style={{ opacity: likeOpacity }}
        >
          <span className="text-like font-bold text-2xl tracking-wider">LIKE</span>
        </motion.div>
        
        {/* Nope Indicator */}
        <motion.div
          className="absolute top-8 left-8 px-6 py-3 rounded-xl border-4 border-nope -rotate-12"
          style={{ opacity: nopeOpacity }}
        >
          <span className="text-nope font-bold text-2xl tracking-wider">NOPE</span>
        </motion.div>
        
        {/* Super Like Indicator */}
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl border-4 border-superlike"
          style={{ opacity: superlikeOpacity }}
        >
          <span className="text-superlike font-bold text-2xl tracking-wider">SUPER LIKE</span>
        </motion.div>
        
        {/* Profile Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
          <div className="flex items-end justify-between mb-3">
            <div>
              <h2 className="text-3xl font-bold">
                {profile.name}, <span className="font-normal">{profile.age}</span>
              </h2>
              <div className="flex items-center gap-1.5 mt-1 opacity-90">
                <MapPin size={16} />
                <span className="text-sm">{profile.location}</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm opacity-90 mb-4 line-clamp-2">{profile.bio}</p>
          
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 text-xs font-medium rounded-full bg-primary-foreground/20 backdrop-blur-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
