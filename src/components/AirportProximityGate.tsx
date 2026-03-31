import { ReactNode } from "react";
import { useAirportProximity } from "@/hooks/useAirportProximity";
import OutsideAirportMessage from "@/components/OutsideAirportMessage";
import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";

interface AirportProximityGateProps {
  children: ReactNode;
}

const AirportProximityGate = ({ children }: AirportProximityGateProps) => {
  const { isNearAirport, loading, error, nearestAirport, distanceMiles } = useAirportProximity();

  if (loading || !isNearAirport) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <HeaderMinimal />
        <OutsideAirportMessage
          loading={loading}
          error={error}
          nearestAirport={nearestAirport}
          distanceMiles={distanceMiles}
        />
        <BottomNav activePage="home" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AirportProximityGate;
