import HeaderMinimal from "@/components/HeaderMinimal";
import backgroundImage from "@/assets/background.png";

const Dashboard = () => {
  return (
    <div 
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <HeaderMinimal />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-32">
        <h1 className="text-4xl font-bold text-primary-foreground drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
          Welcome to Dashboard
        </h1>
      </main>
    </div>
  );
};

export default Dashboard;
