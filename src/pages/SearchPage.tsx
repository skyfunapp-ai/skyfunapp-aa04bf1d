import { useState } from "react";
import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { Search, Plane, ChevronDown, MapPin } from "lucide-react";
import { flights, airports, appUsers } from "@/data/flights";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchPage = () => {
  const [selectedAirport, setSelectedAirport] = useState("All Airports");

  const filteredFlights =
    selectedAirport === "All Airports"
      ? flights
      : flights.filter(
          (f) =>
            f.from.includes(selectedAirport.split(" - ")[1] || "") ||
            f.to.includes(selectedAirport.split(" - ")[1] || "") ||
            f.fromCode === selectedAirport.split(" - ")[0] ||
            f.toCode === selectedAirport.split(" - ")[0]
        );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />

      <main className="flex-1 flex flex-col pt-24 pb-20 px-4">
        {/* Flight Search Dropdown - upper right */}
        <div className="flex justify-end mb-4">
          <div className="w-64">
            <Select value={selectedAirport} onValueChange={setSelectedAirport}>
              <SelectTrigger className="bg-card text-card-foreground border-border">
                <div className="flex items-center gap-2">
                  <Plane size={16} />
                  <SelectValue placeholder="Select Airport" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-card text-card-foreground border-border z-50 max-h-60">
                <ScrollArea className="h-60">
                  {airports.map((airport) => (
                    <SelectItem key={airport} value={airport}>
                      {airport}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Flights List */}
        {filteredFlights.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-primary-foreground mb-3 flex items-center gap-2">
              <Plane size={20} /> Airline Flights
            </h2>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {filteredFlights.map((flight) => (
                  <div
                    key={flight.id}
                    className="flex items-center justify-between bg-card/80 backdrop-blur rounded-xl px-4 py-3 border border-border/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-accent">
                          {flight.airline}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {flight.flightNumber}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-card-foreground mt-1">
                        {flight.fromCode} → {flight.toCode}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {flight.departure} – {flight.arrival}
                      </div>
                    </div>
                    <span className="text-sm font-bold text-primary-foreground">
                      {flight.price}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* App Users */}
        <div>
          <h2 className="text-lg font-bold text-primary-foreground mb-3 flex items-center gap-2">
            <Search size={20} /> People Using SkyFunApp
          </h2>
          <ScrollArea className="h-[calc(100vh-480px)]">
            <div className="space-y-2">
              {appUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 bg-card/80 backdrop-blur rounded-xl px-4 py-3 border border-border/50"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-sm font-bold shrink-0">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-card-foreground truncate">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin size={12} />
                      {user.location}
                    </div>
                  </div>
                  {/* Status dot */}
                  <div
                    className={`w-3 h-3 rounded-full shrink-0 ${
                      user.status === "online"
                        ? "bg-green-500"
                        : user.status === "away"
                        ? "bg-yellow-500"
                        : "bg-muted-foreground/40"
                    }`}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </main>

      <BottomNav activePage="search" />
    </div>
  );
};

export default SearchPage;
