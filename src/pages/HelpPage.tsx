import Seo from "@/components/Seo";
import HeaderMinimal from "@/components/HeaderMinimal";

import BottomNav from "@/components/BottomNav";
import { HelpCircle } from "lucide-react";

const HelpPage = () => {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I message someone?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Visit a user's profile and tap 'Send Message', or go to the Messages page to start a conversation.",
        },
      },
      {
        "@type": "Question",
        name: "What are Skoins?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Skoins are virtual gold coins you can purchase to unlock premium features in SkyFunApp.",
        },
      },
      {
        "@type": "Question",
        name: "Need more help?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Contact us at support@skyfunapp.com for additional assistance.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo
        title="Help Center – SkyFunApp FAQ & Support"
        description="Answers to common SkyFunApp questions about messaging, Skoins, and getting support from our team."
        path="/help"
        jsonLd={faqJsonLd}
      />

      <HeaderMinimal />
      <main className="flex-1 flex flex-col items-center pt-20 sm:pt-24 pb-20 px-4">
        <h1 className="text-3xl font-bold text-primary-foreground mb-6 flex items-center gap-2">
          <HelpCircle size={28} /> Help Center
        </h1>
        <div className="max-w-md space-y-4 w-full">
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">How do I message someone?</h3>
            <p className="text-muted-foreground text-sm">Visit a user's profile and tap "Send Message", or go to the Messages page to start a conversation.</p>
          </div>
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">What are Skoins?</h3>
            <p className="text-muted-foreground text-sm">Skoins are virtual gold coins you can purchase to unlock premium features in SkyFunApp.</p>
          </div>
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-card-foreground mb-2">Need more help?</h3>
            <p className="text-muted-foreground text-sm">Contact us at support@skyfunapp.com for additional assistance.</p>
          </div>
        </div>
      </main>
      <BottomNav activePage="profile" />
    </div>
  );
};

export default HelpPage;
