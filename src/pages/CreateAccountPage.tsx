import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const CreateAccountPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleCreateAccount = () => {
    if (!username.trim()) {
      toast({ title: "Username required", description: "Please enter a username.", variant: "destructive" });
      return;
    }

    if (password.length < 8) {
      toast({ title: "Password too short", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure your passwords match.", variant: "destructive" });
      return;
    }

    // Check if username already exists
    const existingAccounts = JSON.parse(localStorage.getItem("userAccounts") || "[]");
    if (existingAccounts.find((a: { username: string }) => a.username.toLowerCase() === username.trim().toLowerCase())) {
      toast({ title: "Username taken", description: "This username is already in use.", variant: "destructive" });
      return;
    }

    // Save account
    existingAccounts.push({ username: username.trim(), password });
    localStorage.setItem("userAccounts", JSON.stringify(existingAccounts));

    // Set as logged in user
    localStorage.setItem("currentUser", username.trim());

    // Give 5 free Skoin
    localStorage.setItem("skoinBalance", "5");

    // Clear any existing profile so user starts fresh
    localStorage.removeItem("userProfile");

    toast({ title: "Account Created!", description: "Welcome to SkyFunApp! Set up your profile." });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 sm:pt-36">
        <h1 className="text-2xl sm:text-4xl font-bold text-primary-foreground mb-6">Purchase Flight (Create Account)</h1>

        <div className="w-full max-w-sm space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-username" className="text-primary-foreground text-base sm:text-lg">Username</Label>
            <Input
              id="new-username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-10 sm:h-12 text-base sm:text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-primary-foreground text-base sm:text-lg">Password (8+ characters)</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 sm:h-12 text-base sm:text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-primary-foreground text-base sm:text-lg">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-10 sm:h-12 text-base sm:text-lg"
            />
          </div>

          <Button onClick={handleCreateAccount} className="w-full h-12 text-lg" variant="gradient">
            Create Account
          </Button>

          <button onClick={() => navigate("/")} className="w-full text-center text-primary-foreground/70 hover:underline mt-2">
            Already have an account? Log In
          </button>
        </div>
      </main>
    </div>
  );
};

export default CreateAccountPage;
