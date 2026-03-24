import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username.trim() || !password) {
      toast({ title: "Missing credentials", description: "Please enter your username and password.", variant: "destructive" });
      return;
    }

    const accounts = JSON.parse(localStorage.getItem("userAccounts") || "[]");
    const account = accounts.find(
      (a: { username: string; password: string }) =>
        a.username.toLowerCase() === username.trim().toLowerCase() && a.password === password
    );

    if (!account) {
      toast({ title: "Login failed", description: "Invalid username or password.", variant: "destructive" });
      return;
    }

    localStorage.setItem("currentUser", account.username);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
                { label: "About", path: "/about" },
                { label: "Skoin", path: "/skoin" },
                { label: "Safety", path: "/safety" },
                { label: "Help", path: "/help" },
                { label: "Privacy & Policy", path: "/privacy" },
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
            <button onClick={() => navigate("/create-account")} className="text-lg sm:text-3xl opacity-80 hover:underline">Purchase Flight (Create Account)</button>
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-10 sm:h-12 text-base sm:text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-primary-foreground text-base sm:text-lg">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 sm:h-12 text-base sm:text-lg"
            />
          </div>
        </div>

        <button onClick={() => navigate("/forgot-password")} className="mt-2 text-sm text-primary-foreground/60 hover:underline">
          Forgot Password?
        </button>

        {/* Social Links */}
        <div className="mt-8 sm:mt-12 flex flex-col items-center space-y-3 sm:space-y-4">
          <p className="text-base sm:text-xl text-muted-foreground">Follow us</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" size="lg" className="px-6 py-4 h-auto bg-white" asChild>
              <a href="https://www.instagram.com/skyfunapp" target="_blank" rel="noopener noreferrer">
                <FcGoogle size={32} />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="px-6 py-4 h-auto bg-white" asChild>
              <a href="https://www.instagram.com/skyfunapp" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={32} className="text-pink-500" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="px-6 py-4 h-auto bg-white" asChild>
              <a href="https://www.facebook.com/profile.php?id=61578508537600" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={32} className="text-blue-600" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="px-6 py-4 h-auto bg-white" asChild>
              <a href="https://www.tiktok.com/@skyfunapp?lang=en" target="_blank" rel="noopener noreferrer">
                <FaTiktok size={32} />
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
