import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { Search, MapPin, ShieldOff, Plane, Navigation } from "lucide-react";
import { airports } from "@/data/flights";
import { appUsers } from "@/data/flights";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AirportCombobox from "@/components/AirportCombobox";
import { useConnections, useBlockedUsers } from "@/hooks/useProfile";

const SearchPage = () => {
  const [fromAirport, setFromAirport] = useState("All Airports");
  const [toAirport, setToAirport] = useState("All Airports");
  const navigate = useNavigate();

  const fromCode = fromAirport !== "All Airports" ? fromAirport.split(" - ")[0] : null;
  const toCode = toAirport !== "All Airports" ? toAirport.split(" - ")[0] : null;

  const { isConnected } = useConnections();
  const { blockedUserIds, unblockUser, isBlocked } = useBlockedUsers();

  const filteredUsers = appUsers.filter((user) => {
    const matchesFrom = !fromCode || user.airportCode === fromCode;
    const matchesTo = !toCode || user.destinationCode === toCode;
    return matchesFrom && matchesTo;
  });

  const handleUnblock = async (e: React.MouseEvent, userId: string, userName: string) => {
    e.stopPropagation();
    await unblockUser(userId);
    toast({ title: `${userName} unblocked` });
  };

  const handleUserClick = (userId: string) => {
    if (isBlocked(userId)) return;
    if (isConnected(userId)) {
      navigate(`/messages/${userId}`);
    } else {
      navigate(`/user/${userId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />

      <main className="flex-1 flex flex-col pt-20 sm:pt-24 pb-20 px-4">
        <div className="space-y-3 mb-6">
          <div>
            <label className="text-sm font-medium text-primary-foreground flex items-center gap-2 mb-1">
              <Plane size={14} className="rotate-45" /> From
            </label>
            <AirportCombobox value={fromAirport} onChange={setFromAirport} placeholder="Search departure airport..." />
          </div>
          <div>
            <label className="text-sm font-medium text-primary-foreground flex items-center gap-2 mb-1">
              <Plane size={14} className="-rotate-45" /> To
            </label>
            <AirportCombobox value={toAirport} onChange={setToAirport} placeholder="Search destination airport..." />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-primary-foreground mb-3 flex items-center gap-2">
            <Search size={20} /> 
            {fromCode || toCode 
              ? `People ${fromCode ? `from ${fromCode}` : ""}${fromCode && toCode ? " → " : ""}${toCode ? `to ${toCode}` : ""}`
              : "People Using SkyFunApp"
            }
          </h2>
          {filteredUsers.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-380px)]">
              <div className="space-y-2">
                {filteredUsers.map((user) => {
                  const userBlocked = isBlocked(user.id);
                  return (
                    <div
                      key={user.id}
                      onClick={() => handleUserClick(user.id)}
                      className={`flex items-center gap-3 bg-card/80 backdrop-blur rounded-xl px-4 py-3 border border-border/50 transition-colors ${userBlocked ? "opacity-50" : "cursor-pointer hover:bg-card/95"}`}
                    >
                      <Avatar className="w-10 h-10 shrink-0">
                        <AvatarImage src={user.photo} alt={user.name} />
                        <AvatarFallback className="text-sm font-bold">{user.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-card-foreground truncate">
                          {user.name}
                          {userBlocked && <span className="text-xs text-destructive ml-1">(Blocked)</span>}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin size={12} />
                          {airports.find(a => a.startsWith(user.airportCode))?.split(" - ")[1] || user.location}
                        </div>
                        {user.destinationCode && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Navigation size={12} />
                            {airports.find(a => a.startsWith(user.destinationCode!))?.split(" - ")[1] || user.destinationCode}
                          </div>
                        )}
                      </div>
                      {userBlocked ? (
                        <button
                          onClick={(e) => handleUnblock(e, user.id, user.name)}
                          className="flex items-center gap-1 text-xs text-accent bg-accent/10 px-2 py-1 rounded-full hover:bg-accent/20 transition-colors shrink-0"
                        >
                          <ShieldOff size={12} />
                          Unblock
                        </button>
                      ) : (
                        <div
                          className={`w-3 h-3 rounded-full shrink-0 ${
                            user.status === "online"
                              ? "bg-green-500"
                              : user.status === "away"
                              ? "bg-yellow-500"
                              : "bg-muted-foreground/40"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users found matching your search</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav activePage="search" />
    </div>
  );
};

export default SearchPage;
