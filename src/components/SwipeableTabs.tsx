import { useState, useRef, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface SwipeableTabsProps {
  pages: { path: string; content: ReactNode }[];
  activeIndex: number;
}

const SwipeableTabs = ({ pages, activeIndex }: SwipeableTabsProps) => {
  const navigate = useNavigate();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [swiping, setSwiping] = useState(false);
  const [deltaX, setDeltaX] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
    setSwiping(true);
    setDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swiping) return;
    touchEndX.current = e.touches[0].clientX;
    const diff = touchEndX.current - touchStartX.current;
    // Limit swipe visual to avoid over-scroll
    const maxDelta = 80;
    setDeltaX(Math.max(-maxDelta, Math.min(maxDelta, diff)));
  };

  const handleTouchEnd = () => {
    setSwiping(false);
    const diff = touchEndX.current - touchStartX.current;
    const threshold = 60;

    if (diff > threshold && activeIndex > 0) {
      navigate(pages[activeIndex - 1].path);
    } else if (diff < -threshold && activeIndex < pages.length - 1) {
      navigate(pages[activeIndex + 1].path);
    }
    setDeltaX(0);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="flex-1 flex flex-col"
      style={{
        transform: swiping ? `translateX(${deltaX}px)` : undefined,
        transition: swiping ? "none" : "transform 0.2s ease-out",
      }}
    >
      {pages[activeIndex]?.content}
    </div>
  );
};

export default SwipeableTabs;
