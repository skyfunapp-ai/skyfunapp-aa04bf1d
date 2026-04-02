import { MapPin, Plane, Loader2 } from "lucide-react";

interface OutsideAirportMessageProps {
  loading: boolean;
  error: string | null;
  nearestAirport: string | null;
  distanceMiles: number | null;
}

const OutsideAirportMessage = ({ loading, error, nearestAirport, distanceMiles }: OutsideAirportMessageProps) => {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Checking your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center space-y-5 max-w-sm">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <MapPin className="w-10 h-10 text-destructive" />
        </div>
        <h2 className="text-xl font-bold text-card-foreground">Outside Airport Area</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {error
            ? error
            : (
              <>
                You are currently outside of an airport area and are unable to connect with travelers.
                Please visit an airport to use SkyFunApp.
              </>
            )}
        </p>
        {nearestAirport && (
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border/50 space-y-1">
            <div className="flex items-center justify-center gap-2 text-sm text-card-foreground font-medium">
              <Plane size={14} className="text-primary" />
              Nearest Airport
            </div>
            <p className="text-sm font-semibold text-card-foreground">{nearestAirport}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutsideAirportMessage;
