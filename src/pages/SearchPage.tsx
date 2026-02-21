import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { Search, Plane, MapPin } from "lucide-react";
import { flights, airports, appUsers } from "@/data/flights";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchPage = () => {
  const [selectedAirport, setSelectedAirport] = useState("All Airports");
  const navigate = useNavigate();

  const selectedCode = selectedAirport !== "All Airports" ? selectedAirport.split(" - ")[0] : null;

  const filteredFlights = selectedCode
    ? flights.filter((f) => f.fromCode === selectedCode || f.toCode === selectedCode)
    : flights;

  const filteredUsers = selectedCode
    ? appUsers.filter((u) => u.airportCode === selectedCode)
    : appUsers;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />

      <main className="flex-1 flex flex-col pt-20 sm:pt-24 pb-20 px-4">
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

        {filteredFlights.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-primary-foreground mb-3 flex items-center gap-2">
              <Plane size={20} /> Airline Flights {selectedCode && `at ${selectedCode}`}
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

        {filteredFlights.length === 0 && selectedCode && (
          <div className="mb-6 text-center py-8">
            <p className="text-muted-foreground">No flights found at {selectedCode}</p>
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold text-primary-foreground mb-3 flex items-center gap-2">
            <Search size={20} /> People {selectedCode ? `at ${selectedCode}` : "Using SkyFunApp"}
          </h2>
          {filteredUsers.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-480px)]">
              <div className="space-y-2">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => navigate(`/user/${user.id}`)}
                    className="flex items-center gap-3 bg-card/80 backdrop-blur rounded-xl px-4 py-3 border border-border/50 cursor-pointer hover:bg-card/95 transition-colors"
                  >
                    <Avatar className="w-10 h-10 shrink-0">
                      <AvatarImage src={user.photo} alt={user.name} />
                      <AvatarFallback className="text-sm font-bold">{user.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-card-foreground truncate">
                        {user.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin size={12} />
                        {user.location}
                      </div>
                    </div>
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
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users found at {selectedCode}</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav activePage="search" />
    </div>
  );
};

export default SearchPage;
