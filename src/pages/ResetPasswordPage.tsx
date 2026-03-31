import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });
  }, []);

  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      toast({ title: "Password too short", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure your passwords match.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Password Reset!", description: "Your password has been updated. You can now log in." });
    navigate("/");
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 sm:pt-36">
          <p className="text-primary-foreground">Invalid or expired reset link.</p>
          <button onClick={() => navigate("/")} className="mt-4 text-primary-foreground/70 hover:underline">
            Back to Log In
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 sm:pt-36">
        <h1 className="text-2xl sm:text-4xl font-bold text-primary-foreground mb-6">Reset Password</h1>
        <div className="w-full max-w-sm space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-pw" className="text-primary-foreground text-base sm:text-lg">New Password (8+ characters)</Label>
            <Input id="new-pw" type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="h-10 sm:h-12 text-base sm:text-lg" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-pw" className="text-primary-foreground text-base sm:text-lg">Confirm New Password</Label>
            <Input id="confirm-pw" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-10 sm:h-12 text-base sm:text-lg" />
          </div>
          <Button onClick={handleResetPassword} className="w-full h-12 text-lg" variant="gradient" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
          <button onClick={() => navigate("/")} className="w-full text-center text-primary-foreground/70 hover:underline mt-2">
            Back to Log In
          </button>
        </div>
      </main>
    </div>
  );
};

export default ResetPasswordPage;
