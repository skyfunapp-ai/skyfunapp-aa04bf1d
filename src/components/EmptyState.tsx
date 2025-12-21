import { motion } from "framer-motion";
import { Heart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onRefresh: () => void;
}

const EmptyState = ({ onRefresh }: EmptyStateProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center px-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Heart size={40} className="text-primary" />
      </motion.div>
      
      <h2 className="text-2xl font-bold text-foreground mb-2">
        No More Profiles
      </h2>
      
      <p className="text-muted-foreground mb-8 max-w-xs">
        You've seen everyone nearby! Check back later or expand your search preferences.
      </p>
      
      <Button
        variant="gradient"
        size="xl"
        onClick={onRefresh}
        className="gap-2"
      >
        <RefreshCw size={20} />
        Refresh Profiles
      </Button>
    </motion.div>
  );
};

export default EmptyState;
