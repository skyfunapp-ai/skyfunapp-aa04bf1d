import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types/profile";

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedProfile: Profile | null;
}

const MatchModal = ({ isOpen, onClose, matchedProfile }: MatchModalProps) => {
  if (!matchedProfile) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal Content */}
          <motion.div
            className="relative z-10 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Gradient Background */}
            <div className="gradient-primary p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
              >
                <Heart 
                  size={60} 
                  className="mx-auto text-primary-foreground mb-4 animate-heart-pulse" 
                  fill="currentColor" 
                />
              </motion.div>
              
              <motion.h2
                className="text-4xl font-bold text-primary-foreground mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                It's a Match!
              </motion.h2>
              
              <motion.p
                className="text-primary-foreground/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                You and {matchedProfile.name} liked each other
              </motion.p>
            </div>
            
            {/* Profile Preview */}
            <div className="bg-card p-6">
              <motion.div
                className="flex items-center gap-4 mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <img
                  src={matchedProfile.image}
                  alt={matchedProfile.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-primary"
                />
                <div>
                  <h3 className="font-semibold text-lg text-card-foreground">
                    {matchedProfile.name}, {matchedProfile.age}
                  </h3>
                  <p className="text-sm text-muted-foreground">{matchedProfile.location}</p>
                </div>
              </motion.div>
              
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  Keep Swiping
                </Button>
                <Button
                  variant="gradient"
                  className="flex-1 gap-2"
                >
                  <MessageCircle size={18} />
                  Send Message
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MatchModal;
