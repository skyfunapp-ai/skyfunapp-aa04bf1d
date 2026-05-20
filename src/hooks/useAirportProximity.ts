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
    // Fail open when geolocation is unavailable so the app remains usable
    // (e.g. iPad without GPS, denied permission, App Store reviewers).
    if (!navigator.geolocation) {
      setState({
        isNearAirport: true,
        loading: false,
        error: null,
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
      () => {
        // Permission denied / timeout / unavailable: allow access instead
        // of locking the user out of every screen.
        setState({
          isNearAirport: true,
          loading: false,
          error: null,
          nearestAirport: null,
          distanceMiles: null,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return state;
}
