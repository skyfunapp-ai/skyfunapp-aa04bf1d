import HeaderMinimal from "@/components/HeaderMinimal";
import ziplineImage from "@/assets/zipline.jpeg";
import bikingImage from "@/assets/biking.jpeg";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />
      
      <main className="flex-1 flex flex-col px-4 pt-24">
        <div className="flex gap-4 mt-12 justify-center">
          <img 
            src={ziplineImage} 
            alt="Zipline adventure" 
            className="w-1/2 max-w-md h-64 object-cover rounded-lg"
          />
          <img 
            src={bikingImage} 
            alt="Beach biking" 
            className="w-1/2 max-w-md h-64 object-cover rounded-lg"
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
