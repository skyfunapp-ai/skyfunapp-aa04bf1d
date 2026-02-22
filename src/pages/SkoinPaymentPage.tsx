import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Coins, CreditCard, ArrowLeft, Smartphone, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FaApple, FaPaypal } from "react-icons/fa";

type PaymentMethod = "credit" | "debit" | "applepay" | "paypal";

const SkoinPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const coins = searchParams.get("coins") || "1";
  const price = searchParams.get("price") || ".99";

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add purchased Skoin to balance
    const current = Number(localStorage.getItem("skoinBalance") ?? "0");
    localStorage.setItem("skoinBalance", String(current + Number(coins)));
    toast({
      title: "Payment Successful!",
      description: `${coins} Gold Coin${Number(coins) > 1 ? "s" : ""} added to your balance.`,
    });
    navigate("/skoin");
  };

  const isCardPayment = paymentMethod === "credit" || paymentMethod === "debit";

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
          {/* Payment Method Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("credit")}
              className={`py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors ${
                paymentMethod === "credit"
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card/80 text-card-foreground border-border/50 hover:bg-card/95"
              }`}
            >
              <CreditCard size={16} />
              Credit
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("debit")}
              className={`py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors ${
                paymentMethod === "debit"
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card/80 text-card-foreground border-border/50 hover:bg-card/95"
              }`}
            >
              <CreditCard size={16} />
              Debit
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("applepay")}
              className={`py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors ${
                paymentMethod === "applepay"
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card/80 text-card-foreground border-border/50 hover:bg-card/95"
              }`}
            >
              <FaApple size={16} />
              Apple Pay
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("paypal")}
              className={`py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors ${
                paymentMethod === "paypal"
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card/80 text-card-foreground border-border/50 hover:bg-card/95"
              }`}
            >
              <FaPaypal size={16} />
              PayPal
            </button>
          </div>

          {/* Card fields */}
          {isCardPayment && (
            <>
              <div>
                <Label className="text-primary-foreground">Name on Card</Label>
                <Input
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="mt-1 bg-background/50 border-border text-primary-foreground"
                />
              </div>
              <div>
                <Label className="text-primary-foreground">Card Number</Label>
                <Input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                  placeholder="1234 5678 9012 3456"
                  required
                  className="mt-1 bg-background/50 border-border text-primary-foreground"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label className="text-primary-foreground">Expiry</Label>
                  <Input
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    required
                    className="mt-1 bg-background/50 border-border text-primary-foreground"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-primary-foreground">CVV</Label>
                  <Input
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="123"
                    required
                    type="password"
                    className="mt-1 bg-background/50 border-border text-primary-foreground"
                  />
                </div>
              </div>
            </>
          )}

          {/* Apple Pay */}
          {paymentMethod === "applepay" && (
            <div className="text-center py-6">
              <FaApple size={48} className="mx-auto text-primary-foreground mb-3" />
              <p className="text-primary-foreground/70 text-sm">
                Click below to complete payment with Apple Pay
              </p>
            </div>
          )}

          {/* PayPal */}
          {paymentMethod === "paypal" && (
            <div className="space-y-4">
              <div className="text-center">
                <FaPaypal size={48} className="mx-auto text-blue-500 mb-3" />
              </div>
              <div>
                <Label className="text-primary-foreground">PayPal Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  required
                  className="mt-1 bg-background/50 border-border text-primary-foreground"
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full py-6 text-lg font-bold mt-4">
            {paymentMethod === "applepay"
              ? `Pay with Apple Pay — $${price}`
              : paymentMethod === "paypal"
              ? `Pay with PayPal — $${price}`
              : `Pay $${price}`}
          </Button>
        </form>
      </main>

      <BottomNav activePage="profile" />
    </div>
  );
};

export default SkoinPaymentPage;
