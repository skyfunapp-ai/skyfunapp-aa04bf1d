import HeaderMinimal from "@/components/HeaderMinimal";
import ziplineImage from "@/assets/zipline.jpeg";
import bikingImage from "@/assets/biking.jpeg";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />
      
      <main className="flex-1 flex flex-col items-center px-4 pt-24">
        <div className="flex mt-12 justify-center items-stretch">
          <img 
            src={ziplineImage} 
            alt="Zipline adventure" 
            className="w-[144px] h-[288px] object-cover"
          />
          <img 
            src={bikingImage} 
            alt="Beach biking" 
            className="w-[144px] h-[288px] object-cover"
          />
        </div>
        
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold text-foreground">Cynthia-Marie Smith</h2>
          <p className="text-foreground mt-2">Business Owner</p>
          <p className="text-foreground mt-2">Hobbies</p>
          <p className="text-foreground mt-2">Interested In</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
