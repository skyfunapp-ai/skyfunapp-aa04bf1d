import { useParams, useNavigate } from "react-router-dom";
import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { appUsers } from "@/data/flights";
import { MapPin, ArrowLeft, MessageCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = appUsers.find((u) => u.id === userId);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <HeaderMinimal />
        <main className="flex-1 flex items-center justify-center pt-24 pb-20">
          <p className="text-primary-foreground">User not found</p>
        </main>
        <BottomNav activePage="search" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />

      <main className="flex-1 flex flex-col items-center pt-24 pb-20 px-4">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </button>

          <div className="flex flex-col items-center">
            <Avatar className="w-28 h-28 mb-4">
              <AvatarImage src={user.photo} alt={user.name} />
              <AvatarFallback className="text-2xl font-bold">{user.avatar}</AvatarFallback>
            </Avatar>

            <h1 className="text-2xl font-bold text-primary-foreground">{user.name}</h1>

            <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
              <MapPin size={14} />
              <span className="text-sm">{user.location}</span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  user.status === "online"
                    ? "bg-green-500"
                    : user.status === "away"
                    ? "bg-yellow-500"
                    : "bg-muted-foreground/40"
                }`}
              />
              <span className="text-sm text-muted-foreground capitalize">{user.status}</span>
            </div>

            <p className="text-primary-foreground/80 mt-4 text-center">{user.bio}</p>

            <button
              onClick={() => navigate(`/messages/${user.id}`)}
              className="mt-6 flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              <MessageCircle size={18} />
              Send Message
            </button>
          </div>
        </div>
      </main>

      <BottomNav activePage="search" />
    </div>
  );
};

export default UserProfilePage;
