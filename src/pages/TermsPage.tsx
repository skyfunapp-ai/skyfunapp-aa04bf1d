import Seo from "@/components/Seo";
import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { Scale } from "lucide-react";

const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo
        title="Terms of Service – SkyFunApp"
        description="The terms and conditions that govern your use of SkyFunApp, including account eligibility, conduct rules, and account termination."
        path="/terms"
      />

      <HeaderMinimal />
      <main className="flex-1 flex flex-col items-center pt-20 sm:pt-24 pb-20 px-4">
        <h1 className="text-3xl font-bold text-primary-foreground mb-6 flex items-center gap-2">
          <Scale size={28} /> Terms of Service
        </h1>
        <div className="max-w-md space-y-4 w-full">
          <p className="text-muted-foreground text-sm">
            Last updated: April 8, 2026. By creating an account or using SkyFunApp, you agree to the following terms.
          </p>

          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">1. Eligibility</h3>
            <p className="text-muted-foreground text-sm">You must be at least 18 years old to use SkyFunApp. By creating an account, you confirm that you meet this age requirement and that all information you provide is accurate and truthful.</p>
          </div>

          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">2. Account Responsibilities</h3>
            <p className="text-muted-foreground text-sm">You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account. You agree to notify us immediately of any unauthorized use. SkyFunApp is not liable for losses arising from unauthorized access to your account.</p>
          </div>

          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">3. Acceptable Use</h3>
            <p className="text-muted-foreground text-sm">You agree not to use SkyFunApp to harass, threaten, or harm other users; post false, misleading, or offensive content; impersonate any person or entity; engage in any illegal activity; or attempt to access another user's account without permission.</p>
            <p className="text-muted-foreground text-sm mt-2">By using this app, you agree not to harass others; reported incidents will be investigated. Harassment of any sort is prohibited. Reported violations may lead to suspension or permanently deleting your account.</p>
          </div>

          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">4. User Content</h3>
            <p className="text-muted-foreground text-sm">You retain ownership of content you post (photos, messages, profile information). By posting content, you grant SkyFunApp a non-exclusive, royalty-free license to display it within the app for the purpose of providing the service. You are solely responsible for the content you share.</p>
          </div>

          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">5. Skoin & Payments</h3>
            <p className="text-muted-foreground text-sm">Skoins are a virtual currency used within SkyFunApp. Purchased Skoins are non-refundable and hold no monetary value outside the app. SkyFunApp reserves the right to modify Skoin pricing and functionality at any time with reasonable notice.</p>
          </div>

          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">6. Privacy</h3>
            <p className="text-muted-foreground text-sm">Your use of SkyFunApp is also governed by our Privacy Policy. By using the app, you consent to the collection and use of your information as described therein. Please review our Privacy Policy for full details.</p>
          </div>

          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">7. Termination</h3>
            <p className="text-muted-foreground text-sm">SkyFunApp reserves the right to suspend or terminate your account at any time, with or without notice, for conduct that violates these Terms of Service or is harmful to other users, the app, or third parties. You may delete your account at any time through your profile settings.</p>
          </div>

          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">8. Disclaimers</h3>
            <p className="text-muted-foreground text-sm">SkyFunApp is provided "as is" without warranties of any kind. We do not guarantee the accuracy of user profiles or the behavior of other users. SkyFunApp is not responsible for any interactions, meetings, or outcomes that result from using the app. Always exercise caution when meeting people.</p>
          </div>

          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">9. Limitation of Liability</h3>
            <p className="text-muted-foreground text-sm">To the maximum extent permitted by law, SkyFunApp and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the app, including but not limited to loss of data, personal injury, or property damage.</p>
          </div>

          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">10. Changes to Terms</h3>
            <p className="text-muted-foreground text-sm">SkyFunApp reserves the right to modify these Terms of Service at any time. Continued use of the app after changes constitutes acceptance of the updated terms. We will notify users of significant changes through the app.</p>
          </div>

          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">11. Contact</h3>
            <p className="text-muted-foreground text-sm">For questions about these Terms of Service, contact us at support@skyfunapp.com.</p>
          </div>
        </div>
      </main>
      <BottomNav activePage="profile" />
    </div>
  );
};

export default TermsPage;
