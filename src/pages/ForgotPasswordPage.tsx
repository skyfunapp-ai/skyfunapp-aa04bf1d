import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      toast({ title: "Email required", description: "Please enter your email.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email.trim());
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setSent(true);
    toast({ title: "Check your email", description: "We've sent you a password reset link." });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 sm:pt-36">
        <h1 className="text-2xl sm:text-4xl font-bold text-primary-foreground mb-6">
          {sent ? "Check Your Email" : "Find Your Account"}
        </h1>

        <div className="w-full max-w-sm space-y-4">
          {sent ? (
            <p className="text-primary-foreground/70 text-center">
              We've sent a password reset link to <span className="font-semibold text-primary-foreground">{email}</span>. Check your inbox and follow the link to reset your password.
            </p>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-primary-foreground text-base sm:text-lg">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 sm:h-12 text-base sm:text-lg"
                />
              </div>
              <Button onClick={handleResetPassword} className="w-full h-12 text-lg" variant="gradient" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
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
