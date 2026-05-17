import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { OctagonAlert } from "lucide-react";

import Canvas from "../components/peta/Canvas";
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

  // --- OPTIMIZATION: Fetch data in parallel ---
  useEffect(() => {
    const fetchAllData = async (coords) => {
      try {
        const locationDetails = await getLocation(
          coords.latitude,
          coords.longitude
        );
        locationDetails.latitude = coords.latitude;
        locationDetails.longitude = coords.longitude;

        if (
          !locationDetails.province
            .toLowerCase()
            .includes("daerah istimewa yogyakarta")
        ) {
          setViewState("restricted");
          return;
        }

        const nowRes = await getNowForecast({ location: locationDetails });

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
        setErrorMessage(
          "Gagal mendapatkan lokasi. Aktifkan izin lokasi di browser Anda."
        );
        setViewState("error");
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    } else {
      setErrorMessage("Geolocation tidak didukung oleh browser ini.");
      setViewState("error");
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
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg text-center p-4">{errorMessage}</p>
      </div>
    );
  }

  if (viewState === "restricted") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="grid grid-cols-1 gap-4 text-center">
          <OctagonAlert className="w-16 h-16 text-red-500 animate-pulse flex items-center justify-center mx-auto" />
          <p className="text-gray-500 text-lg">
            Maaf, layanan ini hanya tersedia untuk wilayah Daerah Istimewa
            Yogyakarta
          </p>
          <span className="text-[#6C7D41] text-lg font-medium">
            Butuh bantuan? Hubungi kami di{" "}
            <a
              href="https://wa.me/081234567890"
              target="_blank"
              rel="noreferrer"
              className="text-[#6C7D41] underline"
            >
              081234567890
            </a>
          </span>
        </div>
      </div>
    );
  }

  // viewState === 'loaded'
  return <Canvas location={location} timestamp={timestamp} nowData={nowData} />;
};

export default Peta;
