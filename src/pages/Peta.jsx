import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { OctagonAlert } from "lucide-react";

import Canvas from "../components/peta/Canvas";
import Header from "../components/Header";
import getLocation from "../utils/getLocationAccess";
import { getNowForecast } from "../hooks/forecast/getDataForecast";
import useCurrentTimestamp from "../utils/getCurrentTimestamp";

const Peta = () => {
  const { day, date, month, year, time } = useCurrentTimestamp();
  const timestamp = { day, date, month, year, time };

  // State untuk data dan UI
  const [viewState, setViewState] = useState("loading");
  const [location, setLocation] = useState(null);
  const [nowData, setNowData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAllData = async (coords) => {
      try {
        let locationDetails;
        try {
          locationDetails = await getLocation(
            coords.latitude,
            coords.longitude
          );
        } catch {
          locationDetails = {
            road: "Tidak diketahui",
            city: "Tidak diketahui",
            province: "Indonesia",
          };
        }
        locationDetails.latitude = coords.latitude;
        locationDetails.longitude = coords.longitude;

        let nowRes = null;
        try {
          nowRes = await getNowForecast({ location: locationDetails });
        } catch (e) {
          console.warn("Now forecast failed:", e);
        }

        setLocation(locationDetails);
        setNowData(nowRes);

        setViewState("loaded");
      } catch (error) {
        console.error("Error fetching map data:", error);
        setErrorMessage("Gagal memuat data peta. Periksa koneksi Anda.");
        setViewState("error");
      }
    };

    const handleSuccess = (position) => {
      const currentLoc = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      localStorage.setItem("lastKnownLocation", JSON.stringify(currentLoc));
      fetchAllData(currentLoc);
    };

    const handleError = () => {
      const savedLocString = localStorage.getItem("lastKnownLocation");
      if (savedLocString) {
        const savedLoc = JSON.parse(savedLocString);
        fetchAllData(savedLoc);
      } else {
        // Default to Jakarta
        fetchAllData({ latitude: -6.2088, longitude: 106.8456 });
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    } else {
      fetchAllData({ latitude: -6.2088, longitude: 106.8456 });
    }
  }, []);

  // --- Render Logic berdasarkan viewState ---
  if (viewState === "loading") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center h-screen"
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-gray-600 text-xl font-semibold animate-pulse">
            Mengambil lokasi peta...
          </p>
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gradient-to-r from-[#6C7D41] to-[#4A5D23]"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-4 border-[#f8f8f8]"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (viewState === "error") {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <OctagonAlert className="w-16 h-16 text-red-500 mb-4" />
          <p className="text-gray-500 text-lg text-center p-4">{errorMessage}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-[#6C7D41] text-white rounded-lg hover:bg-[#5b6a37] transition-colors font-semibold">Coba Lagi</button>
        </div>
      </>
    );
  }

  // viewState === 'loaded'
  return <Canvas location={location} timestamp={timestamp} nowData={nowData} />;
};

export default Peta;
