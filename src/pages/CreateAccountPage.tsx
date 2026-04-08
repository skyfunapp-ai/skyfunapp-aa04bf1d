import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const CreateAccountPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    if (!email.trim()) {
      toast({ title: "Email required", description: "Please enter your email.", variant: "destructive" });
      return;
    }

    if (!dateOfBirth) {
      toast({ title: "Date of birth required", description: "Please enter your date of birth.", variant: "destructive" });
      return;
    }

    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    if (age < 18) {
      toast({ title: "Age requirement", description: "You must be at least 18 years old to create an account.", variant: "destructive" });
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

    if (!agreedToTerms) {
      toast({ title: "Terms required", description: "You must agree to the Terms of Service and Privacy Policy.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await signUp(email.trim(), password);
    setLoading(false);

    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Account Created!", description: "Please check your email to verify your account, then log in." });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 sm:pt-36">
        <h1 className="text-2xl sm:text-4xl font-bold text-primary-foreground mb-6">Purchase Flight (Create Account)</h1>

        <div className="w-full max-w-sm space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-email" className="text-primary-foreground text-base sm:text-lg">Email</Label>
            <Input
              id="new-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 sm:h-12 text-base sm:text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob" className="text-primary-foreground text-base sm:text-lg">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="h-10 sm:h-12 text-base sm:text-lg"
              max={new Date().toISOString().split("T")[0]}
            />
            <p className="text-xs text-muted-foreground">You must be at least 18 years old</p>
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

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-primary-foreground/80 leading-snug cursor-pointer">
              I agree to the{" "}
              <span onClick={(e) => { e.preventDefault(); navigate("/terms"); }} className="underline text-accent hover:text-accent/80">
                Terms of Service
              </span>{" "}and{" "}
              <span onClick={(e) => { e.preventDefault(); navigate("/privacy"); }} className="underline text-accent hover:text-accent/80">
                Privacy Policy
              </span>
            </label>
          </div>

          <Button onClick={handleCreateAccount} className="w-full h-12 text-lg" variant="gradient" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
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
