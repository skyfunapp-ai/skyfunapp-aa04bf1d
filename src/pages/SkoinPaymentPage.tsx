import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Coins, CreditCard, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FaApple, FaPaypal, FaGoogle } from "react-icons/fa";
import { useProfile } from "@/hooks/useProfile";

type PaymentMethod = "card" | "paypal" | "applepay" | "googlepay";

const SkoinPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, updateProfile } = useProfile();

  const coins = searchParams.get("coins") || "1";
  const price = searchParams.get("price") || ".99";

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newBalance = profile.skoinBalance + Number(coins);
    await updateProfile({ skoinBalance: newBalance });
    toast({
      title: "Thank You! Payment Successful!",
      description: `${coins} Gold Coin${Number(coins) > 1 ? "s" : ""} added to your balance.`,
    });
    navigate("/skoin");
  };

  const methodButtons: { key: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { key: "card", label: "Credit/Debit", icon: <CreditCard size={16} /> },
    { key: "paypal", label: "PayPal", icon: <FaPaypal size={16} /> },
    { key: "applepay", label: "Apple Pay", icon: <FaApple size={16} /> },
    { key: "googlepay", label: "Google Pay", icon: <FaGoogle size={16} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />

      <main className="flex-1 flex flex-col items-center pt-20 sm:pt-24 pb-20 px-4">
        <button
          onClick={() => navigate("/skoin")}
          className="self-start flex items-center gap-1 text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to Skoin</span>
        </button>

        <div className="flex items-center gap-3 mb-8">
          <Coins size={40} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground">
              {coins} Gold Coin{Number(coins) > 1 ? "s" : ""}
            </h1>
            <p className="text-primary-foreground/70 text-lg">${price}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
          <div className="grid grid-cols-2 gap-2">
            {methodButtons.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setPaymentMethod(m.key)}
                className={`py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors ${
                  paymentMethod === m.key
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-card/80 text-card-foreground border-border/50 hover:bg-card/95"
                }`}
              >
                {m.icon}
                {m.label}
              </button>
            ))}
          </div>

          {paymentMethod === "card" && (
            <>
              <div>
                <Label className="text-primary-foreground">Name on Card</Label>
                <Input value={nameOnCard} onChange={(e) => setNameOnCard(e.target.value)} placeholder="John Doe" required className="mt-1 bg-background/50 border-border text-primary-foreground" />
              </div>
              <div>
                <Label className="text-primary-foreground">Card Number</Label>
                <Input value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))} placeholder="1234 5678 9012 3456" required className="mt-1 bg-background/50 border-border text-primary-foreground" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label className="text-primary-foreground">Expiry</Label>
                  <Input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" required className="mt-1 bg-background/50 border-border text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <Label className="text-primary-foreground">CVV</Label>
                  <Input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123" required type="password" className="mt-1 bg-background/50 border-border text-primary-foreground" />
                </div>
              </div>
            </>
          )}

          {paymentMethod === "applepay" && (
            <div className="text-center py-6">
              <FaApple size={48} className="mx-auto text-primary-foreground mb-3" />
              <p className="text-primary-foreground/70 text-sm">Click below to complete payment with Apple Pay</p>
            </div>
          )}

          {paymentMethod === "googlepay" && (
            <div className="text-center py-6">
              <FaGoogle size={48} className="mx-auto text-primary-foreground mb-3" />
              <p className="text-primary-foreground/70 text-sm">Click below to complete payment with Google Pay</p>
            </div>
          )}

          {paymentMethod === "paypal" && (
            <div className="space-y-4">
              <div className="text-center">
                <FaPaypal size={48} className="mx-auto text-blue-500 mb-3" />
              </div>
              <div>
                <Label className="text-primary-foreground">PayPal Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" required className="mt-1 bg-background/50 border-border text-primary-foreground" />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full py-6 text-lg font-bold mt-4">
            {paymentMethod === "applepay" ? `Pay with Apple Pay — $${price}` : paymentMethod === "googlepay" ? `Pay with Google Pay — $${price}` : paymentMethod === "paypal" ? `Pay with PayPal — $${price}` : `Pay $${price}`}
          </Button>
        </form>
      </main>

      <BottomNav activePage="profile" />
    </div>
  );
};

export default SkoinPaymentPage;
