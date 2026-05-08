import { useEffect, useState, useCallback } from "react";
import { Capacitor } from "@capacitor/core";
import { useAuth } from "@/contexts/AuthContext";

// RevenueCat public SDK keys (safe to ship in client). Configure in your RevenueCat dashboard.
const REVENUECAT_IOS_KEY = import.meta.env.VITE_REVENUECAT_IOS_KEY as string | undefined;
const REVENUECAT_ANDROID_KEY = import.meta.env.VITE_REVENUECAT_ANDROID_KEY as string | undefined;

export const isNativePlatform = () => Capacitor.isNativePlatform();

export interface IAPPackage {
  identifier: string;
  priceString: string;
  product: {
    identifier: string;
    title: string;
    description: string;
    priceString: string;
  };
  rcPackage: any; // Raw RevenueCat package, passed back to purchasePackage
}

export const useIAP = () => {
  const { user } = useAuth();
  const [ready, setReady] = useState(false);
  const [packages, setPackages] = useState<IAPPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize RevenueCat with the Supabase user id so all purchases are tied to the account
  useEffect(() => {
    if (!isNativePlatform() || !user) return;

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const { Purchases, LOG_LEVEL } = await import("@revenuecat/purchases-capacitor");
        const platform = Capacitor.getPlatform();
        const apiKey = platform === "ios" ? REVENUECAT_IOS_KEY : REVENUECAT_ANDROID_KEY;
        if (!apiKey) {
          throw new Error("RevenueCat API key not configured for this platform");
        }
        await Purchases.setLogLevel({ level: LOG_LEVEL.WARN });
        await Purchases.configure({ apiKey, appUserID: user.id });

        const offerings = await Purchases.getOfferings();
        const current = offerings.current;
        const pkgs: IAPPackage[] =
          current?.availablePackages?.map((p: any) => ({
            identifier: p.identifier,
            priceString: p.product?.priceString ?? "",
            product: {
              identifier: p.product?.identifier ?? "",
              title: p.product?.title ?? "",
              description: p.product?.description ?? "",
              priceString: p.product?.priceString ?? "",
            },
            rcPackage: p,
          })) ?? [];

        if (!cancelled) {
          setPackages(pkgs);
          setReady(true);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to initialize in-app purchases");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const purchase = useCallback(async (pkg: IAPPackage) => {
    if (!isNativePlatform()) throw new Error("In-app purchases only available on native apps");
    const { Purchases } = await import("@revenuecat/purchases-capacitor");
    const result = await Purchases.purchasePackage({ aPackage: pkg.rcPackage });
    return result;
  }, []);

  const restore = useCallback(async () => {
    if (!isNativePlatform()) throw new Error("Restore only available on native apps");
    const { Purchases } = await import("@revenuecat/purchases-capacitor");
    return Purchases.restorePurchases();
  }, []);

  return { ready, packages, loading, error, purchase, restore, isNative: isNativePlatform() };
};
