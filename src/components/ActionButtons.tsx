import { motion } from "framer-motion";
import { X, Heart, Star, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onNope: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

const ActionButtons = ({ onNope, onLike, onSuperLike, onUndo, canUndo }: ActionButtonsProps) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="action"
          size="icon-lg"
          onClick={onUndo}
          disabled={!canUndo}
          className="disabled:opacity-30"
        >
          <RotateCcw size={22} className="text-muted-foreground" />
        </Button>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="nope"
          size="icon-xl"
          onClick={onNope}
        >
          <X size={28} strokeWidth={3} />
        </Button>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="superlike"
          size="icon-lg"
          onClick={onSuperLike}
        >
          <Star size={22} fill="currentColor" />
        </Button>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="like"
          size="icon-xl"
          onClick={onLike}
        >
          <Heart size={28} fill="currentColor" />
        </Button>
      </motion.div>
    </div>
  );
};

export default ActionButtons;
