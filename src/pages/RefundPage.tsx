import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { Receipt } from "lucide-react";

const RefundPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />
      <main className="flex-1 flex flex-col items-center pt-20 sm:pt-24 pb-20 px-4">
        <h1 className="text-3xl font-bold text-primary-foreground mb-6 flex items-center gap-2">
          <Receipt size={28} /> Refund Policy
        </h1>
        <div className="max-w-md space-y-4 w-full">
          <p className="text-muted-foreground text-sm">
            Last updated: April 28, 2026. This Refund Policy explains the terms under which purchases made on SkyFunApp may or may not be refunded.
          </p>

          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">1. Skoin Purchases</h3>
            <p className="text-muted-foreground text-sm">Skoins are a virtual currency used within SkyFunApp. All Skoin purchases are final and non-refundable once the Skoins have been credited to your account.</p>
          </div>

          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">2. No Monetary Value</h3>
            <p className="text-muted-foreground text-sm">Skoins hold no monetary value outside of SkyFunApp and cannot be exchanged for cash, transferred to another account, or redeemed for any other form of compensation.</p>
          </div>

          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">3. Unauthorized Transactions</h3>
            <p className="text-muted-foreground text-sm">If you believe a charge was made without your authorization, please contact us at support@skyfunapp.com within 14 days of the transaction. We will investigate and, if confirmed, issue a full refund to your original payment method.</p>
          </div>

          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">4. Technical Issues</h3>
            <p className="text-muted-foreground text-sm">If a technical error on our side prevents your Skoins from being delivered after a successful payment, we will either credit the Skoins to your account or issue a refund. Contact support@skyfunapp.com with your transaction details.</p>
          </div>

          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">5. Account Termination</h3>
            <p className="text-muted-foreground text-sm">If your account is suspended or terminated for violating our Terms of Service, you forfeit any unused Skoins and are not entitled to a refund.</p>
          </div>

          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">6. Chargebacks</h3>
            <p className="text-muted-foreground text-sm">Initiating a chargeback without first contacting support may result in immediate suspension of your account. Please reach out to us first so we can resolve the issue directly.</p>
          </div>

          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">7. Contact</h3>
            <p className="text-muted-foreground text-sm">For refund requests or questions, contact us at support@skyfunapp.com.</p>
          </div>
        </div>
      </main>
      <BottomNav activePage="profile" />
    </div>
  );
};

export default RefundPage;
