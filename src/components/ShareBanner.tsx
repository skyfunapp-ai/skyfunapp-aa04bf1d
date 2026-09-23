import { useState, useEffect } from "react";
import { X, Share2, Copy, Check, Mail, MessageSquare } from "lucide-react";
import {
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaLinkedin,
  FaTelegram,
  FaFacebookMessenger,
  FaReddit,
  FaPinterest,
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const STORAGE_KEY = "skyfun_share_banner_dismissed_at";
const REAPPEAR_DAYS = 7;

interface ShareBannerProps {
  shareUrl?: string;
  message?: string;
}

const ShareBanner = ({
  shareUrl = "https://skyfunapp.lovable.app/create-account",
  message = "Meet fellow travelers at the airport with SkyFunApp! ✈️ Sign up here:",
}: ShareBannerProps) => {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dismissedAt = localStorage.getItem(STORAGE_KEY);
    if (!dismissedAt) {
      setVisible(true);
      return;
    }
    const days = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
    if (days >= REAPPEAR_DAYS) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
  };

  const fullText = `${message} ${shareUrl}`;
  const encoded = encodeURIComponent(fullText);
  const encodedUrl = encodeURIComponent(shareUrl);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({ title: "Link copied!" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Couldn't copy link", variant: "destructive" });
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "SkyFunApp", text: message, url: shareUrl });
      } catch {
        /* user cancelled */
      }
    } else {
      copyLink();
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mx-4 mt-4 mb-2 rounded-2xl bg-accent/15 border border-accent/30 backdrop-blur-sm p-4 relative shadow-lg"
        >
          <button
            onClick={dismiss}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-accent/20 transition-colors"
            aria-label="Dismiss"
          >
            <X size={16} className="text-primary-foreground" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Share2 size={18} className="text-accent" />
            <p className="text-primary-foreground font-semibold text-base">Share SkyFunApp</p>
          </div>
          <p className="text-primary-foreground text-sm mb-3">
            Help friends find travel companions — share the app!
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={nativeShare}
              className="flex items-center gap-1.5 px-3 py-2 bg-accent text-accent-foreground rounded-full text-sm font-semibold hover:opacity-90"
            >
              <Share2 size={14} /> Share
            </button>
            {[
              { label: "Share to WhatsApp", href: `https://wa.me/?text=${encoded}`, icon: <FaWhatsapp size={18} />, color: "text-green-600" },
              { label: "Share to X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodedUrl}`, icon: <FaXTwitter size={17} />, color: "text-foreground" },
              { label: "Share to Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: <FaFacebook size={18} />, color: "text-blue-600" },
              { label: "Share to Messenger", href: `https://www.facebook.com/dialog/send?link=${encodedUrl}&redirect_uri=${encodedUrl}&app_id=0`, icon: <FaFacebookMessenger size={18} />, color: "text-blue-500" },
              { label: "Share to LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, icon: <FaLinkedin size={18} />, color: "text-sky-700" },
              { label: "Share to Telegram", href: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(message)}`, icon: <FaTelegram size={18} />, color: "text-sky-500" },
              { label: "Share to Reddit", href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent("SkyFunApp – meet travelers at the airport")}`, icon: <FaReddit size={18} />, color: "text-orange-600" },
              { label: "Share to Pinterest", href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodeURIComponent(message)}`, icon: <FaPinterest size={18} />, color: "text-red-600" },
              { label: "Share by text message", href: `sms:?&body=${encoded}`, icon: <MessageSquare size={17} />, color: "text-foreground" },
              { label: "Share by email", href: `mailto:?subject=${encodeURIComponent("Join me on SkyFunApp")}&body=${encoded}`, icon: <Mail size={17} />, color: "text-foreground" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center w-9 h-9 rounded-full bg-white hover:scale-105 transition-transform ${item.color}`}
                aria-label={item.label}
              >
                {item.icon}
              </a>
            ))}
            <a
              href="https://www.instagram.com/skyfunapp"
              target="_blank"
              rel="noopener noreferrer"
              onClick={copyLink}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-pink-500 hover:scale-105 transition-transform"
              aria-label="Open SkyFunApp on Instagram"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="https://www.tiktok.com/@skyfunapp"
              target="_blank"
              rel="noopener noreferrer"
              onClick={copyLink}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-foreground hover:scale-105 transition-transform"
              aria-label="Open SkyFunApp on TikTok"
            >
              <FaTiktok size={16} />
            </a>
            <button
              onClick={copyLink}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-foreground hover:scale-105 transition-transform"
              aria-label="Copy link"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareBanner;
