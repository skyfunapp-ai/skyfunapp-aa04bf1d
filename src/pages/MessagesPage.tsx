import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { MessageCircle } from "lucide-react";

const MessagesPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />
      
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-20 px-4">
        <MessageCircle size={64} className="text-primary-foreground/50 mb-4" />
        <h1 className="text-2xl font-bold text-primary-foreground">Messages</h1>
        <p className="text-primary-foreground/70 mt-2">Your conversations</p>
      </main>
      
      <BottomNav activePage="messages" />
    </div>
  );
};

export default MessagesPage;
