import { PlaneTakeoff, Pencil, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderMinimalProps {
  onEditClick?: () => void;
  showEdit?: boolean;
}

const HeaderMinimal = ({ onEditClick, showEdit = false }: HeaderMinimalProps) => {
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("currentUser");

  const menuItems = isLoggedIn
    ? [
        { label: "About", path: "/about" },
        { label: "Profile", path: "/dashboard" },
        { label: "Search", path: "/search" },
        { label: "Messages", path: "/messages" },
        { label: "Skoin", path: "/skoin" },
        { label: "Safety", path: "/safety" },
        { label: "Help", path: "/help" },
        { label: "Privacy & Policy", path: "/privacy" },
        { label: "Log Out", path: "/" },
      ]
    : [
        { label: "About", path: "/about" },
        { label: "Skoin", path: "/skoin" },
        { label: "Safety", path: "/safety" },
        { label: "Help", path: "/help" },
        { label: "Privacy & Policy", path: "/privacy" },
      ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="w-full px-4 h-16 sm:h-24 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <PlaneTakeoff className="text-primary-foreground -rotate-12 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] w-7 h-7 sm:w-12 sm:h-12" />
          <span className="text-xl sm:text-3xl font-bold italic text-primary-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">SkyFunApp</span>
        </div>
        <div className="flex items-center gap-2">
          {showEdit && onEditClick && (
            <button
              onClick={onEditClick}
              className="p-2 hover:bg-accent rounded-md transition-colors"
            >
              <Pencil size={20} className="text-primary-foreground" />
            </button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-accent rounded-md transition-colors">
                <Menu size={28} className="text-primary-foreground" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-border">
              <SheetHeader>
                <SheetTitle className="text-primary-foreground text-xl">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="w-full text-left px-4 py-3 rounded-lg text-lg font-medium text-primary-foreground hover:bg-accent/20 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default HeaderMinimal;
