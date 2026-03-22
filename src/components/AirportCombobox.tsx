import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin } from "lucide-react";
import { airports } from "@/data/flights";

interface AirportComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const AirportCombobox = ({ value, onChange, placeholder = "Search airport..." }: AirportComboboxProps) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredAirports = airports.filter((a) =>
    a.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayValue = value && value !== "All Airports" ? value : "";

  return (
    <div ref={containerRef} className="relative">
      <Input
        value={isOpen ? search : displayValue}
        onChange={(e) => {
          setSearch(e.target.value);
          if (!isOpen) setIsOpen(true);
        }}
        onFocus={() => {
          setIsOpen(true);
          setSearch("");
        }}
        placeholder={placeholder}
        className="bg-card text-card-foreground border-border"
        inputMode="search"
        autoComplete="off"
      />
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg">
          <ScrollArea className="h-48">
            <div className="p-1">
              {filteredAirports.map((airport) => (
                <button
                  key={airport}
                  onClick={() => {
                    onChange(airport);
                    setSearch("");
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2 transition-colors
                    ${value === airport ? "bg-accent/20 text-accent" : "text-card-foreground hover:bg-muted"}`}
                >
                  <MapPin size={12} className="shrink-0 text-muted-foreground" />
                  {airport}
                </button>
              ))}
              {filteredAirports.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No airports found</p>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default AirportCombobox;
