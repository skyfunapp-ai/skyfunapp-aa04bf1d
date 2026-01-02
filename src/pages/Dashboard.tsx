import HeaderMinimal from "@/components/HeaderMinimal";
import ziplineImage from "@/assets/zipline.jpeg";
import bikingImage from "@/assets/biking.jpeg";
import { User, Search, MessageCircle } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />
      
      <main className="flex-1 flex flex-col items-center pt-24 pb-20">
        <div className="flex w-full justify-center items-stretch">
          <img 
            src={ziplineImage} 
            alt="Zipline adventure" 
            className="w-1/2 h-[288px] object-cover"
          />
          <img 
            src={bikingImage} 
            alt="Beach biking" 
            className="w-1/2 h-[288px] object-cover"
          />
        </div>
        
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold text-primary-foreground">Cynthia-Marie Smith</h2>
          <p className="text-primary-foreground mt-2">Business Owner</p>
          <p className="text-primary-foreground mt-2">Hobbies</p>
          <p className="text-primary-foreground mt-2">Interested In</p>
        </div>
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border py-4">
        <div className="flex justify-around items-center">
          <User size={28} className="text-primary-foreground" />
          <Search size={28} className="text-primary-foreground" />
          <MessageCircle size={28} className="text-primary-foreground" />
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
