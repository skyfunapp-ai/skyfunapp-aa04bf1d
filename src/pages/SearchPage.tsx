import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { Search, MapPin, ShieldOff, Plane, Navigation, Loader2 } from "lucide-react";
import { airports } from "@/data/flights";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AirportCombobox from "@/components/AirportCombobox";
import { useConnections, useBlockedUsers } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useConversations } from "@/hooks/useMessages";


interface SearchUser {
  id: string;
  name: string;
  profilePhoto?: string;
  currentAirport?: string;
  destinationAirport?: string;
}

const SearchPage = () => {
  const [fromAirport, setFromAirport] = useState("All Airports");
  const [toAirport, setToAirport] = useState("All Airports");
  const [dbUsers, setDbUsers] = useState<SearchUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const touchStartX = useRef(0);

  const handleSwipe = (e: React.TouchEvent, type: "start" | "end") => {
    if (type === "start") { touchStartX.current = e.touches[0].clientX; return; }
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 60) navigate("/dashboard");
    else if (diff < -60) navigate("/messages");
  };

  const fromCode = fromAirport !== "All Airports" ? fromAirport.split(" - ")[0] : null;
  const toCode = toAirport !== "All Airports" ? toAirport.split(" - ")[0] : null;

  const { isConnected } = useConnections();
  const { blockedUserIds, unblockUser, isBlocked } = useBlockedUsers();
  const { conversations } = useConversations();

  // Fetch real profiles from database
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      const { data } = await supabase
        .from("profiles")
        .select("id, name, profile_photo, current_airport, destination_airport")
        .not("name", "is", null)
        .neq("name", "");

      if (data) {
        setDbUsers(
          data.map((p) => ({
            id: p.id,
            name: p.name || "",
            profilePhoto: p.profile_photo || undefined,
            currentAirport: p.current_airport || undefined,
            destinationAirport: p.destination_airport || undefined,
          }))
        );
      }
      setLoadingUsers(false);
    };
    fetchUsers();
  }, []);

  // Extract airport code from stored value like "ATL - Atlanta"
  const getCode = (airport?: string) => airport?.split(" - ")[0] || null;
  const getCity = (airport?: string) => airport?.split(" - ")[1] || airport || "";

  const filteredUsers = dbUsers.filter((u) => {
    // Don't show current user in search
    if (u.id === user?.id) return false;
    const userFromCode = getCode(u.currentAirport);
    const userToCode = getCode(u.destinationAirport);
    const matchesFrom = !fromCode || userFromCode === fromCode;
    const matchesTo = !toCode || userToCode === toCode;
    return matchesFrom && matchesTo;
  });

  const handleUnblock = async (e: React.MouseEvent, userId: string, userName: string) => {
    e.stopPropagation();
    await unblockUser(userId);
    toast({ title: `${userName} unblocked` });
  };

  const handleUserClick = (clickedUserId: string) => {
    if (isBlocked(clickedUserId)) return;
    // If a conversation exists in the DB, go directly to chat
    const hasConversation = conversations.some((c) => c.userId === clickedUserId);
    if (hasConversation) {
      navigate(`/messages/${clickedUserId}`);
    } else {
      navigate(`/user/${clickedUserId}`);
    }
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

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
          {loadingUsers ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-muted-foreground" size={24} />
            </div>
          ) : filteredUsers.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-380px)]">
              <div className="space-y-2">
                {filteredUsers.map((u) => {
                  const userBlocked = isBlocked(u.id);
                  return (
                    <div
                      key={u.id}
                      onClick={() => handleUserClick(u.id)}
                      className={`flex items-center gap-3 bg-card/80 backdrop-blur rounded-xl px-4 py-3 border border-border/50 transition-colors ${userBlocked ? "opacity-50" : "cursor-pointer hover:bg-card/95"}`}
                    >
                      <Avatar className="w-10 h-10 shrink-0">
                        <AvatarImage src={u.profilePhoto} alt={u.name} />
                        <AvatarFallback className="text-sm font-bold">{getInitials(u.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-card-foreground truncate">
                          {u.name}
                          {userBlocked && <span className="text-xs text-destructive ml-1">(Blocked)</span>}
                        </p>
                        {u.currentAirport && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin size={12} />
                            {getCity(u.currentAirport)}
                          </div>
                        )}
                        {u.destinationAirport && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Navigation size={12} />
                            {getCity(u.destinationAirport)}
                          </div>
                        )}
                      </div>
                      {userBlocked ? (
                        <button
                          onClick={(e) => handleUnblock(e, u.id, u.name)}
                          className="flex items-center gap-1 text-xs text-accent bg-accent/10 px-2 py-1 rounded-full hover:bg-accent/20 transition-colors shrink-0"
                        >
                          <ShieldOff size={12} />
                          Unblock
                        </button>
                      ) : (
                        <div className="w-3 h-3 rounded-full shrink-0 bg-green-500" />
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
