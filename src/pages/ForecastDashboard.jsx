import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogIn, OctagonAlert, UserPlus2Icon } from "lucide-react";

// Import components
import ForecastHariIni from "../components/dashboard/ForecastHariIni";
import RekomendasiAI from "../components/dashboard/RekomendasiAI";
import ForecastKedepan from "../components/dashboard/ForecastKedepan";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Modal, LoginForm, RegisterForm } from "../components/auth/ModalAuth";
import HargaKomoditas from "../components/dashboard/HargaKomoditas";
import DashboardData from "../components/dashboard/DashboardData";
import WaspadaCuaca from "../components/dashboard/WaspadaCuaca";

// Import hooks and utils
import getLocation from "../utils/getLocationAccess";
import {
  getDataForecast,
  getNowForecast,
} from "../hooks/forecast/getDataForecast";
import { getHargaKomoditas } from "../hooks/forum/getHargaKomoditas";
import useCurrentTimestamp from "../utils/getCurrentTimestamp";
import { loginAuth, registerAuth } from "../hooks/auth/Authentication";
import { getForecastMingguan } from "../hooks/forecast/getForecastMingguan";
import { useUser } from "../utils/userContext";

const ForecastDashboard = () => {
  const { day, date, month, year, time } = useCurrentTimestamp();
  const timestamp = { day, date, month, year, time };

  // State untuk data dan UI
  const [viewState, setViewState] = useState("loading");
  const [location, setLocation] = useState(null);
  const [data, setData] = useState(null);
  const [nowData, setNowData] = useState(null);
  const [hargaKomoditas, setHargaKomoditas] = useState(null);
  const [dataMingguan, setDataMingguan] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // State untuk Auth
  const { isAuthenticated } = useUser();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAuthError, setIsAuthError] = useState(false);

  useEffect(() => {
    const fetchAllData = async (coords) => {
      // Step 1: Try to get location details (reverse geocode)
      let locationDetails = null;
      try {
        locationDetails = await getLocation(
          coords.latitude,
          coords.longitude
        );
        locationDetails.latitude = coords.latitude;
        locationDetails.longitude = coords.longitude;
        setLocation(locationDetails);
      } catch (error) {
        console.warn("Reverse geocode failed, using coordinates only:", error);
        // Fallback: use coordinates without city/province info
        locationDetails = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          road: "Tidak diketahui",
          city: "Tidak diketahui",
          province: "Indonesia",
        };
        setLocation(locationDetails);
      }

      // Step 2: Fetch all data independently — don't let one failure block others
      const results = await Promise.allSettled([
        getDataForecast({ location: locationDetails }),
        getNowForecast({ location: locationDetails }),
        getHargaKomoditas({ location: locationDetails }),
        getForecastMingguan({ location: locationDetails }),
      ]);

      if (results[0].status === "fulfilled" && results[0].value?.weatherData) {
        setData(results[0].value);
      }
      if (results[1].status === "fulfilled" && results[1].value?.dataCuaca) {
        setNowData(results[1].value);
      }
      if (results[2].status === "fulfilled" && results[2].value) {
        setHargaKomoditas(results[2].value);
      }
      if (results[3].status === "fulfilled" && results[3].value) {
        setDataMingguan(results[3].value);
      }

      // Always show the full UI
      setViewState("loaded");
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
        // Default to Jakarta if no location available
        const defaultLoc = {
          latitude: -6.2088,
          longitude: 106.8456,
        };
        fetchAllData(defaultLoc);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      });
    } else {
      const defaultLoc = {
        latitude: -6.2088,
        longitude: 106.8456,
      };
      fetchAllData(defaultLoc);
    }
  }, []);

  const toggleLoginModal = useCallback(() => {
    setIsAuthError(false);
    setIsLoginOpen((prev) => !prev);
  }, []);

  const toggleRegisterModal = useCallback(() => {
    setIsAuthError(false);
    setIsRegisterOpen((prev) => !prev);
  }, []);

  const handleLogin = useCallback(async (formData) => {
    try {
      if (!formData.email || !formData.password) {
        setIsAuthError(true);
        setErrorMessage("Email dan password harus diisi");
        return;
      }

      const res = await loginAuth(formData);
      if (res.status === 200) {
        setIsLoginOpen(false);
        setIsAuthError(false);
      } else {
        setIsAuthError(true);
        setErrorMessage(res.message || "Terjadi kesalahan, silahkan coba lagi");
      }
    } catch (error) {
      setIsAuthError(true);
      setErrorMessage("Terjadi kesalahan, silahkan coba lagi");
    }
  }, []);

  const handleRegister = useCallback(async (formData) => {
    try {
      if (!formData.email || !formData.password) {
        setIsAuthError(true);
        setErrorMessage("Email dan password harus diisi");
        return;
      }

      const res = await registerAuth(formData);
      if (res.status === 200) {
        setIsRegisterOpen(false);
        setIsAuthError(false);
      } else {
        setIsAuthError(true);
        setErrorMessage(res.message || "Terjadi kesalahan, silahkan coba lagi");
      }
    } catch (error) {
      setIsAuthError(true);
      setErrorMessage("Terjadi kesalahan, silahkan coba lagi");
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
            Mengambil lokasi...
          </p>
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gradient-to-r from-[#6C7D41] to-[#4A5D23]"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-4 border-[#f8f8f8]"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto min-h-screen bg-white p-6"
      >
        {!isAuthenticated && (
          <div className="md:flex justify-between md:space-x-4">
            <div
              className="flex justify-between bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded relative mb-4 w-full"
              role="alert"
            >
              <span className="block sm:inline">
                <strong className="font-bold">Peringatan!</strong> Akses data
                terbatas, silahkan masuk untuk mendapatkan akses penuh.
              </span>
              <OctagonAlert className="w-6 h-6 text-red-500 hidden sm:block" />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={toggleLoginModal}
                className="flex px-8 py-2 mb-4 text-md font-semibold items-center justify-center text-[#6C7D41] bg-transparent border border-[#6C7D41] rounded-lg hover:bg-[#6C7D41] hover:text-white transition-all duration-300 w-full md:w-auto"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Masuk
              </button>
              <button
                onClick={toggleRegisterModal}
                className="flex px-8 py-2 mb-4 text-md font-semibold items-center justify-center text-[#6C7D41] bg-transparent border border-[#6C7D41] rounded-lg hover:bg-[#6C7D41] hover:text-white transition-all duration-300 w-full md:w-auto"
              >
                <UserPlus2Icon className="w-5 h-5 mr-2" />
                Daftar
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-6 mx-auto">
          <div className="w-full lg:w-3/5 space-y-6">
            {data && nowData ? (
              <ForecastHariIni
                timestamp={timestamp}
                location={location}
                data={data}
                nowData={nowData}
                dataMingguan={dataMingguan}
              />
            ) : (
              <div className="rounded-xl border border-gray-200 shadow-sm">
                <div className="border-b border-gray-100 p-4 bg-[#F4F7F4] rounded-t-xl">
                  <h2 className="text-lg font-medium text-[#6C7D41]">Cuaca Hari Ini</h2>
                </div>
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <OctagonAlert className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="text-gray-500 text-sm">Data cuaca saat ini tidak tersedia. Periksa koneksi Anda.</p>
                  <button onClick={() => window.location.reload()} className="mt-3 px-4 py-1.5 bg-[#6C7D41] text-white rounded-lg hover:bg-[#5b6a37] transition-colors text-sm font-medium">Coba Lagi</button>
                </div>
              </div>
            )}
            <DashboardData />
            <HargaKomoditas dataHargaKomoditas={hargaKomoditas} />
          </div>
          <div className="w-full lg:w-2/5 space-y-6">
            <WaspadaCuaca />
            {location ? (
              <RekomendasiAI location={location} />
            ) : (
              <div className="rounded-xl border border-gray-200 shadow-sm">
                <div className="flex border-b border-gray-100 p-4 bg-[#F4F7F4] rounded-t-xl">
                  <h2 className="text-lg font-medium text-[#6C7D41]">Rekomendasi AI</h2>
                </div>
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <p className="text-gray-500 text-sm">Data rekomendasi tidak tersedia.</p>
                </div>
              </div>
            )}
            {location ? (
              <ForecastKedepan location={location} />
            ) : (
              <div className="hidden md:block rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6">
                  <h3 className="font-medium text-gray-700">Perkiraan Mingguan</h3>
                  <p className="text-gray-500 text-sm mt-2">Data tidak tersedia.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      <Footer
        modalLogin={toggleLoginModal}
        modalRegister={toggleRegisterModal}
      />

      {/* --- Modals --- */}
      <Modal
        isOpen={isLoginOpen}
        onClose={toggleLoginModal}
        isError={isAuthError}
        errorMessage={errorMessage}
        title="Selamat Datang"
        description="Silahkan masuk untuk mengakses fitur dan data yang lebih lengkap"
      >
        <LoginForm onSubmit={handleLogin} />
      </Modal>
      <Modal
        isOpen={isRegisterOpen}
        onClose={toggleRegisterModal}
        isError={isAuthError}
        errorMessage={errorMessage}
        title="Buat Akun"
        description="Silahkan buat akun untuk mendapatkan fitur dan data yang lebih lengkap"
      >
        <RegisterForm onSubmit={handleRegister} />
      </Modal>
    </>
  );
};

export default ForecastDashboard;
