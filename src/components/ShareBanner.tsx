import { useState, useEffect } from "react";
import { X, Share2, Copy, Check } from "lucide-react";
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const STORAGE_KEY = "skyfun_share_banner_dismissed_at";
const REAPPEAR_DAYS = 7;

interface ShareBannerProps {
  shareUrl?: string;
  message?: string;
}

const ShareBanner = ({
  shareUrl = "https://skyfunapp.lovable.app",
  message = "Meet fellow travelers at the airport with SkyFunApp! ✈️",
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
            <X size={16} className="text-primary-foreground/70" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Share2 size={18} className="text-accent" />
            <p className="text-primary-foreground font-semibold text-base">Share SkyFunApp</p>
          </div>
          <p className="text-primary-foreground/80 text-sm mb-3">
            Help friends find travel companions — share the app!
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={nativeShare}
              className="flex items-center gap-1.5 px-3 py-2 bg-accent text-accent-foreground rounded-full text-sm font-semibold hover:opacity-90"
            >
              <Share2 size={14} /> Share
            </button>
            <a
              href={`https://wa.me/?text=${encoded}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-green-600 hover:scale-105 transition-transform"
              aria-label="Share to WhatsApp"
            >
              <FaWhatsapp size={18} />
            </a>
            <a
              href="https://www.instagram.com/skyfunapp"
              target="_blank"
              rel="noopener noreferrer"
              onClick={copyLink}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-pink-500 hover:scale-105 transition-transform"
              aria-label="Open Instagram"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-blue-600 hover:scale-105 transition-transform"
              aria-label="Share to Facebook"
            >
              <FaFacebook size={18} />
            </a>
            <a
              href="https://www.tiktok.com/@skyfunapp"
              target="_blank"
              rel="noopener noreferrer"
              onClick={copyLink}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-foreground hover:scale-105 transition-transform"
              aria-label="Open TikTok"
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
