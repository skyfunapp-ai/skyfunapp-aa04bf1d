import { useState, useEffect } from "react";
import { airportCoordinates } from "@/data/airportCoordinates";

interface ProximityState {
  isNearAirport: boolean;
  loading: boolean;
  error: string | null;
  nearestAirport: string | null;
  distanceMiles: number | null;
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const RADIUS_MILES = 2;

export function useAirportProximity(): ProximityState {
  const [state, setState] = useState<ProximityState>({
    isNearAirport: false,
    loading: true,
    error: null,
    nearestAirport: null,
    distanceMiles: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        isNearAirport: false,
        loading: false,
        error: "Geolocation is not supported by your browser.",
        nearestAirport: null,
        distanceMiles: null,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        let minDist = Infinity;
        let closest = "";

        for (const airport of airportCoordinates) {
          const dist = haversineDistance(latitude, longitude, airport.lat, airport.lng);
          if (dist < minDist) {
            minDist = dist;
            closest = `${airport.code} - ${airport.name}`;
          }
        }

        setState({
          isNearAirport: minDist <= RADIUS_MILES,
          loading: false,
          error: null,
          nearestAirport: closest,
          distanceMiles: Math.round(minDist * 10) / 10,
        });
      },
      (err) => {
        setState({
          isNearAirport: false,
          loading: false,
          error:
            err.code === 1
              ? "Location access denied. Please enable location services to use this app."
              : "Unable to determine your location. Please try again.",
          nearestAirport: null,
          distanceMiles: null,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return state;
}
