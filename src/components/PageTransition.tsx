import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  direction?: "left" | "right" | "none";
}

const PageTransition = ({ children, direction = "none" }: PageTransitionProps) => {
  const variants = {
    initial: {
      opacity: 0,
      x: direction === "left" ? -40 : direction === "right" ? 40 : 0,
    },
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex-1 flex flex-col min-h-screen"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
