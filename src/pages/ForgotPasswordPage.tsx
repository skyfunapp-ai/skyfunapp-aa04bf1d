import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"find" | "reset">("find");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleFindAccount = () => {
    if (!username.trim()) {
      toast({ title: "Username required", description: "Please enter your username.", variant: "destructive" });
      return;
    }

    const accounts = JSON.parse(localStorage.getItem("userAccounts") || "[]");
    const account = accounts.find(
      (a: { username: string }) => a.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!account) {
      toast({ title: "Account not found", description: "No account exists with that username.", variant: "destructive" });
      return;
    }

    setStep("reset");
  };

  const handleResetPassword = () => {
    if (newPassword.length < 8) {
      toast({ title: "Password too short", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure your passwords match.", variant: "destructive" });
      return;
    }

    const accounts = JSON.parse(localStorage.getItem("userAccounts") || "[]");
    const idx = accounts.findIndex(
      (a: { username: string }) => a.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (idx === -1) return;

    accounts[idx].password = newPassword;
    localStorage.setItem("userAccounts", JSON.stringify(accounts));

    toast({ title: "Password Reset!", description: "Your password has been updated. You can now log in." });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 sm:pt-36">
        <h1 className="text-2xl sm:text-4xl font-bold text-primary-foreground mb-6">
          {step === "find" ? "Find Your Account" : "Reset Password"}
        </h1>

        <div className="w-full max-w-sm space-y-4">
          {step === "find" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="reset-username" className="text-primary-foreground text-base sm:text-lg">Username</Label>
                <Input
                  id="reset-username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-10 sm:h-12 text-base sm:text-lg"
                />
              </div>
              <Button onClick={handleFindAccount} className="w-full h-12 text-lg" variant="gradient">
                Find Account
              </Button>
            </>
          ) : (
            <>
              <p className="text-primary-foreground/70 text-center">
                Resetting password for <span className="font-semibold text-primary-foreground">{username}</span>
              </p>
              <div className="space-y-2">
                <Label htmlFor="new-pw" className="text-primary-foreground text-base sm:text-lg">New Password (8+ characters)</Label>
                <Input
                  id="new-pw"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-10 sm:h-12 text-base sm:text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-pw" className="text-primary-foreground text-base sm:text-lg">Confirm New Password</Label>
                <Input
                  id="confirm-new-pw"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-10 sm:h-12 text-base sm:text-lg"
                />
              </div>
              <Button onClick={handleResetPassword} className="w-full h-12 text-lg" variant="gradient">
                Reset Password
              </Button>
            </>
          )}

          <button onClick={() => navigate("/")} className="w-full text-center text-primary-foreground/70 hover:underline mt-2">
            Back to Log In
          </button>
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
