import { Link } from "react-router-dom";
import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { FileText, Bell, ChevronRight } from "lucide-react";
import DeleteAccountButton from "@/components/DeleteAccountButton";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />
      <main className="flex-1 flex flex-col items-center pt-20 sm:pt-24 pb-20 px-4">
        <h1 className="text-3xl font-bold text-primary-foreground mb-6 flex items-center gap-2">
          <FileText size={28} /> Privacy & Policy
        </h1>
        <div className="max-w-md space-y-4 w-full">
          <Link
            to="/notifications"
            className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50 flex items-center justify-between hover:bg-card transition-colors"
          >
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-primary-foreground" />
              <div>
                <h3 className="font-semibold text-card-foreground">Notification Preferences</h3>
                <p className="text-muted-foreground text-sm">Manage push & email notifications</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </Link>
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">Data Collection</h3>
            <p className="text-muted-foreground text-sm">SkyFunApp collects only the information you provide, including your profile details, current location, and destination. We do not collect data without your knowledge or consent.</p>
          </div>
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">How We Use Your Information</h3>
            <p className="text-muted-foreground text-sm">Your information is used to connect you with other travelers at the same location or destination. We do not sell or share your personal data with third parties for marketing purposes.</p>
          </div>
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">Messages & Communication</h3>
            <p className="text-muted-foreground text-sm">Messages sent through SkyFunApp are private between you and the recipient. We do not read, monitor, or share your conversations.</p>
          </div>
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">Account Security</h3>
            <p className="text-muted-foreground text-sm">You are responsible for maintaining the security of your account credentials. SkyFunApp will never ask for your password via email or messages.</p>
          </div>
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">Your Rights</h3>
            <p className="text-muted-foreground text-sm">You may update, modify, or delete your account and personal information at any time through your profile settings. Contact support@skyfunapp.com for any privacy-related inquiries.</p>
          </div>
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">Policy Updates</h3>
            <p className="text-muted-foreground text-sm">SkyFunApp reserves the right to update this privacy policy at any time. Users will be notified of significant changes through the app.</p>
          </div>
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-destructive/40 mt-2">
            <h3 className="font-semibold text-destructive mb-2">Delete Your Account</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Permanently remove your account and all associated data. This action cannot be undone.
            </p>
            <DeleteAccountButton />
          </div>
        </div>
      </main>
      <BottomNav activePage="profile" />
    </div>
  );
};

export default PrivacyPage;
