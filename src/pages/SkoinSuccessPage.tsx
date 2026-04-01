import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { Coins, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SkoinSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [coins, setCoins] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setErrorMsg("No payment session found.");
      return;
    }

    const verify = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-skoin-payment", {
          body: { session_id: sessionId },
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        setCoins(data.coins);
        setStatus("success");
      } catch (err: any) {
        setStatus("error");
        setErrorMsg(err.message || "Payment verification failed.");
      }
    };

    verify();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />

      <main className="flex-1 flex flex-col items-center justify-center pt-20 sm:pt-24 pb-20 px-4 text-center">
        {status === "verifying" && (
          <>
            <Loader2 size={64} className="text-primary animate-spin mb-4" />
            <h1 className="text-3xl font-bold text-primary-foreground mb-2">Verifying Payment…</h1>
            <p className="text-muted-foreground">Please wait while we confirm your purchase.</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle size={64} className="text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-primary-foreground mb-2">Thank You!</h1>
            <p className="text-lg text-muted-foreground mb-2">Payment Successful</p>
            <div className="flex items-center gap-2 mt-4 mb-8">
              <Coins size={32} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
              <span className="text-xl font-bold text-primary-foreground">
                {coins} Gold Coin{coins > 1 ? "s" : ""} added to your balance
              </span>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <AlertCircle size={64} className="text-destructive mb-4" />
            <h1 className="text-3xl font-bold text-primary-foreground mb-2">Verification Failed</h1>
            <p className="text-muted-foreground mb-8">{errorMsg}</p>
          </>
        )}

        <button
          onClick={() => navigate("/skoin")}
          className="px-8 py-3 bg-accent text-accent-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Back to Skoin
        </button>
      </main>

      <BottomNav activePage="profile" />
    </div>
  );
};

export default SkoinSuccessPage;
