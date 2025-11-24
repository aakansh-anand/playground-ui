"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Locate, MapPin } from "lucide-react";
import { motion } from "motion/react";

// Dynamically import the MapComponent with no SSR
const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-neutral-900/50 animate-pulse flex items-center justify-center text-neutral-500">
      Loading Map...
    </div>
  ),
});

interface LocationMapProps {
  latitude?: number;
  longitude?: number;
  onLocationFound: (lat: number, lng: number) => void;
}

export default function LocationMap({
  latitude,
  longitude,
  onLocationFound,
}: LocationMapProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If coordinates are provided, we consider permission "granted" (or at least location known)
  const showMap = permissionGranted || (!!latitude && !!longitude);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        onLocationFound(lat, lng);
        setPermissionGranted(true);
        setIsLocating(false);
      },
      (err) => {
        console.error("Error getting location:", err);
        setError("Unable to retrieve your location. Please check permissions.");
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };
  
  const defaultLat = 28.6139;
  const defaultLng = 77.209;

  const displayLat = latitude || defaultLat;
  const displayLng = longitude || defaultLng;

  return (
    <div className="relative w-full h-[300px] rounded-2xl overflow-hidden border-2 border-neutral-800 bg-neutral-900/50 shadow-lg group">
      {/* Map Container */}
      <div
        className={`w-full h-full transition-all duration-500 ${
          !showMap ? "blur-xs scale-105" : ""
        }`}
      >
        <MapComponent lat={displayLat} lng={displayLng} />
      </div>

      {/* Overlay for "Use Current Location" */}
      {!showMap && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#adfa1d31] backdrop-blur-[2px]">
          <motion.button
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-[#ADFA1D] text-black font-bold rounded-xl shadow-[0_0_20px_rgba(173,250,29,0.3)] hover:bg-[#9DE018] hover:shadow-[0_0_30px_rgba(173,250,29,0.5)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLocating ? (
              <>
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Locating...</span>
              </>
            ) : (
              <>
                <Locate size={15} />
                <span>Use My Current Location</span>
              </>
            )}
          </motion.button>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-red-400 text-sm font-medium bg-black/50 px-3 py-1 rounded-lg"
            >
              {error}
            </motion.p>
          )}
        </div>
      )}

      {/* Location Indicator (when granted) */}
      {showMap && (
        <div className="absolute bottom-4 right-4 bg-neutral-900/90 backdrop-blur-md border border-neutral-700 px-3 py-1.5 rounded-lg text-xs text-neutral-300 flex items-center gap-2 shadow-lg">
          <MapPin size={12} className="text-[#ADFA1D]" />
          {displayLat.toFixed(4)}, {displayLng.toFixed(4)}
        </div>
      )}
    </div>
  );
}
