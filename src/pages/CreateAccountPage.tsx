import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const REF_PENDING_KEY = "skyfun_pending_ref_code";

const CreateAccountPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-fill referral code from ?ref= URL param
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) setReferralCode(ref.toUpperCase());
  }, [searchParams]);

  const handleCreateAccount = async () => {
    if (!email.trim()) {
      toast({ title: "Email required", description: "Please enter your email.", variant: "destructive" });
      return;
    }

    if (!ageConfirmed) {
      toast({ title: "Age requirement", description: "You must confirm you are at least 18 years old.", variant: "destructive" });
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


    setLoading(true);
    const { error } = await signUp(email.trim(), password);
    setLoading(false);

    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      return;
    }

    // Save referral code so it can be redeemed after first login
    if (referralCode.trim()) {
      localStorage.setItem(REF_PENDING_KEY, referralCode.trim().toUpperCase());
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
          <div className="flex items-start space-x-2">
            <Checkbox
              id="age"
              checked={ageConfirmed}
              onCheckedChange={(checked) => setAgeConfirmed(checked === true)}
              className="mt-1"
            />
<label htmlFor="age" className="text-sm text-primary-foreground/80 leading-snug cursor-pointer">
              I confirm that I am at least 18 years old or older
            </label>
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

          <div className="space-y-2">
            <Label htmlFor="ref-code" className="text-primary-foreground text-base sm:text-lg">
              Referral Code <span className="text-primary-foreground/50 text-sm">(optional — earn 5 Skoins)</span>
            </Label>
            <Input
              id="ref-code"
              type="text"
              placeholder="Enter friend's code"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              className="h-10 sm:h-12 text-base sm:text-lg uppercase tracking-widest"
              maxLength={12}
            />
          </div>

          <Button onClick={handleCreateAccount} className="w-full h-12 text-lg" variant="gradient" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </Button>

          <button onClick={() => navigate("/")} className="w-full text-center text-primary-foreground/70 hover:underline mt-2">
            Already have an account? Log In
          </button>

          <p className="text-xs text-primary-foreground/60 text-center mt-2">
            By creating an account, you agree to our{" "}
            <span onClick={() => navigate("/terms")} className="underline text-accent hover:text-accent/80 cursor-pointer">Terms of Service</span>,{" "}
            <span onClick={() => navigate("/refund")} className="underline text-accent hover:text-accent/80 cursor-pointer">Refund Policy</span>{" "}and{" "}
            <span onClick={() => navigate("/privacy")} className="underline text-accent hover:text-accent/80 cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </main>
    </div>
  );
};

export default CreateAccountPage;
