import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import backgroundImage from "@/assets/background.png";

const Index = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Header />
      {/* Hamburger menu */}
      <div className="fixed top-6 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2 hover:bg-accent rounded-md transition-colors">
              <Menu size={32} className="text-primary-foreground" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background border-border">
            <SheetHeader>
              <SheetTitle className="text-primary-foreground text-xl">Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 space-y-2">
              {[
                { label: "Profile", path: "/dashboard" },
                { label: "Search", path: "/search" },
                { label: "Messages", path: "/messages" },
                { label: "Skoin", path: "/skoin" },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="w-full text-left px-4 py-3 rounded-lg text-lg font-medium text-primary-foreground hover:bg-accent/20 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 sm:pt-36">
        {/* Auth Links */}
        <div className="flex flex-col items-center space-y-4 sm:space-y-6">
          <div className="flex flex-col items-center space-y-2 sm:space-y-4 text-primary-foreground">
            <button onClick={handleLogin} className="text-2xl sm:text-5xl font-medium hover:underline">Check In (Log In)</button>
            <button className="text-lg sm:text-3xl opacity-80 hover:underline">Purchase Flight (Create Account)</button>
          </div>
        </div>

        {/* Username & Password Fields */}
        <div className="mt-6 sm:mt-8 w-full max-w-sm space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-primary-foreground text-base sm:text-lg">Username</Label>
            <Input 
              id="username" 
              type="text" 
              placeholder="Enter your username" 
              className="h-10 sm:h-12 text-base sm:text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-primary-foreground text-base sm:text-lg">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Enter your password" 
              className="h-10 sm:h-12 text-base sm:text-lg"
            />
          </div>
        </div>

        {/* Social Login Options */}
        <div className="mt-8 sm:mt-12 flex flex-col items-center space-y-3 sm:space-y-4">
          <p className="text-base sm:text-xl text-muted-foreground">Continue with</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" size="lg" className="px-6 py-4 h-auto bg-white">
              <FcGoogle size={32} />
            </Button>
            <Button variant="outline" size="lg" className="px-6 py-4 h-auto bg-white">
              <FaInstagram size={32} className="text-pink-500" />
            </Button>
            <Button variant="outline" size="lg" className="px-6 py-4 h-auto bg-white">
              <FaFacebook size={32} className="text-blue-600" />
            </Button>
            <Button variant="outline" size="lg" className="px-6 py-4 h-auto bg-white">
              <FaTiktok size={32} />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
