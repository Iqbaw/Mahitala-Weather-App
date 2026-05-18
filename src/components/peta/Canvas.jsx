import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Header from "./Header";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Polygon,
  Tooltip,
  WMSTileLayer,
  LayersControl,
  GeoJSON,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import Webcam from "react-webcam";
import axios from "axios";

import { motion as m } from "framer-motion";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import {
  calculateArea,
  capitalizeFirstLetter,
  calculateCentroid,
  API_URL_CLF,
  API_URL,
} from "../../utils/Constants";

import {
  getDataFieldByUserID,
  createDataField,
  deleteDataField,
  updateDataField,
} from "../../hooks/field_user/dataField";

import { getCropData } from "../../hooks/crop/getCropData";

import Swal from "sweetalert2";

import { useUser } from "../../utils/userContext";
import {
  ArrowLeft,
  ArrowRight,
  BarChart2,
  Cloud,
  Droplet,
  HelpCircle,
  Home,
  Info,
  Leaf,
  Lightbulb,
  MapPin,
  Menu,
  Sparkles,
  Sprout,
  Trash,
  TrashIcon,
  Users2,
  X,
  XIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { getRekomendasiAI } from "../../hooks/forecast/getRekomendasiAI";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const videoConstraints = {
  width: 500,
  height: 320,
  facingMode: "environment",
};

const NdiviTutorialModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999999] p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xs sm:max-w-md p-4 sm:p-6 text-center animate-fade-in-up">
        <Lightbulb className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 mx-auto mb-3 sm:mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Memantau Kesehatan Tanaman (NDVI)
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-5">
          Fitur ini menggunakan data satelit untuk membuat "peta kesehatan"
          lahan Anda. Gunakan ini untuk menemukan masalah lebih dini.
        </p>

        <div className="space-y-3 text-left mb-5">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex-shrink-0"></div>
            <div>
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">
                Hijau Terang
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Pertanda sangat baik. Tanaman Anda lebat, subur, dan sehat.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-400 flex-shrink-0"></div>
            <div>
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">
                Kuning
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Peringatan. Tanaman mungkin stres karena kurang air atau
                nutrisi.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-500 flex-shrink-0"></div>
            <div>
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">
                Merah / Coklat
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Tanda bahaya. Area ini kemungkinan besar memiliki masalah serius
                seperti hama atau penyakit.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-[#6C7D41] to-[#8BA350] text-white font-bold py-2 sm:py-3 rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base"
        >
          Saya Mengerti
        </button>
      </div>
    </div>
  );
};

const Canvas = ({ location, nowData }) => {
  const mapRef = useRef(null);
  const webcamRef = useRef(null);
  const dateNow = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [cropData, setCropData] = useState([]);
  const [initialWeatherLoaded, setInitialWeatherLoaded] = useState(false);

  // data user
  const [weatherCache, setWeatherCache] = useState({});

  // UI state
  const [panelState, setPanelState] = useState("collapsed");
  const [activeSection, setActiveSection] = useState("weather");

  const [panelDesktop, setPanelDesktop] = useState("expanded");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [information, setInformation] = useState(true);

  // field data
  const [polygons, setPolygons] = useState([]);
  const [fieldName, setFieldName] = useState("");
  const [soilType, setSoilType] = useState("");
  const [cropId, setCropId] = useState("");
  const [cropDate, setCropDate] = useState("");
  const [estimated_time, setEstimatedTime] = useState("");

  const [confirm, setConfirm] = useState(false);

  const [type, setType] = useState("add");

  // handle crop prediction data
  const [predictionData, setPredictionData] = useState([]);

  // For responsive design
  const [isMobile, setIsMobile] = useState(false);

  // set initial data
  const yogyakartaPosition = [-7.797068, 110.370529];
  const nd = nowData.dataCuaca.weatherData;

  // camera
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);

  // auth
  const { isAuthenticated, setIsAuthenticated } = useUser();

  // Handle Soil Data
  const [resultData, setResultData] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [unifiedRecommendation, setUnifiedRecommendation] = useState([]);

  // context menu
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    polygonIndex: null,
  });

  /***
   * =====================================================
   * Initial Map and Location
   * =====================================================
   */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (location && mapRef.current) {
      mapRef.current.setView([location.latitude, location.longitude], 18);
    }
  }, [mounted, location]);

  const [showNdiviTutorial, setShowNdiviTutorial] = useState(false);

  useEffect(() => {
    setShowNdiviTutorial(!localStorage.getItem("ndiviTutorialShown"));
  }, []);

  const closeTutorial = () => {
    setShowNdiviTutorial(false);
    localStorage.setItem("ndiviTutorialShown", "true");
  };
  /* ==================================================== */

  /***
   * =====================================================
   * Authentication and Responsive Design
   * =====================================================
   */
  // Auth state is now managed by Firebase onAuthStateChanged in userContext

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, [panelState]);

  const getParameterColor = (type, value) => {
    const colors = {
      ph: value >= 6.5 && value <= 7.5 ? "text-green-600" : "text-amber-600",
      carbon: value >= 2 ? "text-green-600" : "text-amber-600",
      nitrogen: value >= 0.1 ? "text-green-600" : "text-amber-600",
      cec: value >= 15 ? "text-green-600" : "text-amber-600",
    };
    return colors[type] || "text-gray-600 bg-gray-50";
  };

  const getParameterStatus = (type, value) => {
    const status = {
      ph:
        value >= 6.5 && value <= 7.5
          ? "Optimal"
          : value < 6.5
            ? "Asam"
            : "Basa",
      carbon: value >= 2 ? "Baik" : "Rendah",
      nitrogen: value >= 0.1 ? "Cukup" : "Kurang",
      cec: value >= 15 ? "Tinggi" : "Sedang",
    };
    return status[type] || "Normal";
  };
  /* ==================================================== */

  /***
   * =====================================================
   * Crop Data Fetching
   * =====================================================
   */
  useEffect(() => {
    getCropData().then((res) => {
      if (res) {
        const crops = res.map((crop) => ({
          id: crop.id,
          label: crop.label,
          estimated_time: crop.estimated_time,
        }));
        setCropData(crops);
      }
    });
  }, []);
  /* ==================================================== */

  /***
   * =====================================================
   * Field Data Fetching & Deletion
   * =====================================================
   */
  useEffect(() => {
    if (!isAuthenticated) return;
    getDataFieldByUserID().then((res) => {
      if (res) {
        const fieldData = res.map((field) => ({
          id: field.id_field,
          fieldName: field.nama_lahan,
          soilType: field.jenis_tanah,
          coords: JSON.parse(field.coords),
          cropId: field.id_tanaman,
          cropDate: field.tanggal_tanam,
          estimated_time: field.estimasi_panen,
        }));
        setPolygons(fieldData);
      }
    });
  }, [isAuthenticated]);

  const recommendationData = async (lat, lng) => {
    await getRekomendasiAI({
      location: {
        latitude: lat,
        longitude: lng,
      },
    }).then((res) => {
      res[0].rekomendasi_final_json = JSON.parse(res[0].rekomendasi_final_json);
      setPredictionData(res[0]);
    });
  };

  const handleDeleteLahan = (id) => {
    Swal.fire({
      title: "Konfirmasi Hapus",
      showCancelButton: true,
      text: "Apakah Anda yakin ingin menghapus lahan ini?",
      icon: "warning",
      confirmButtonText: "Ya, hapus!",
      confirmButtonColor: "#ef4444",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDataField(id).then((res) => {
          if (res) {
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              text: "Lahan berhasil dihapus.",
              showConfirmButton: false,
              timer: 1500,
            });
            setPolygons((prev) => prev.filter((poly) => poly.id !== id));
            setContextMenu({ visible: false, x: 0, y: 0, polygonIndex: null });
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal",
              text: "Terjadi kesalahan saat menghapus lahan.",
            });
          }
        });
      }
    });
  };

  const EditLahan = (index) => {
    setConfirm(true);
    const selectedPolygon = polygons[index];
    setFieldName(selectedPolygon.fieldName);
    setSoilType(selectedPolygon.soilType);
    setCropId(selectedPolygon.cropId.toString());
    setCropDate(selectedPolygon.cropDate.split("T")[0]);
    setEstimatedTime(selectedPolygon.estimated_time.split("T")[0]);
    setPolygonPoints(selectedPolygon.coords);
    setType("edit");
    setPanelState("popup");
    setActiveSection("field");
    setPanelDesktop("expanded");
    if (isMobile && panelState !== "expanded") {
      setPanelState("popup");
      setActiveSection("field");
    }
  };

  const handleEditLahan = (index) => {
    const selectedPolygon = polygons[index];
    const id = selectedPolygon.id;
    Swal.fire({
      title: "Konfirmasi Edit",
      showCancelButton: true,
      text: "Apakah Anda yakin ingin mengedit lahan ini?",
      icon: "warning",
      confirmButtonText: "Ya, edit!",
      confirmButtonColor: "#6C7D41",
    }).then((result) => {
      if (result.isConfirmed) {
        let data = {
          id_field: id,
          nama_lahan: fieldName,
          jenis_tanah: soilType,
          id_tanaman: cropId,
          coords: JSON.stringify(polygonPoints),
          luas_lahan: JSON.stringify(calculateArea(polygonPoints)),
          tanggal_tanam: cropDate,
          estimasi_panen: estimated_time,
        };
        updateDataField(data).then((res) => {
          if (res) {
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              text: "Lahan berhasil diedit.",
              showConfirmButton: false,
              timer: 1500,
            });
            setPolygons((prev) =>
              prev.map((poly) =>
                poly.id === id
                  ? {
                      ...poly,
                      ...{
                        id: id,
                        fieldName: fieldName,
                        soilType: soilType,
                        coords: polygonPoints,
                        cropId: cropId,
                        cropDate: cropDate,
                        estimated_time: estimated_time,
                      },
                    }
                  : poly
              )
            );
            setPolygonPoints([]);
            setFieldName("");
            setSoilType("");
            setCropId("");
            setCropDate("");
            setEstimatedTime("");

            setType("add");
            setActiveSection("weather");
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal",
              text: "Terjadi kesalahan saat mengedit lahan.",
            });
          }
        });
      }
    });
  };
  /* ==================================================== */

  /***
   * =====================================================
   * Map Click Handler
   * =====================================================
   */
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPolygonPoints((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
        setPanelDesktop("expanded");
        setActiveSection("field");
        if (isMobile && panelState !== "popup") {
          setActiveSection("field");
        }
      },
    });
    return null;
  };

  useEffect(() => {
    const fetchSoilDataOnPolygonChange = async () => {
      if (polygonPoints.length > 2) {
        const centroid = calculateCentroid(polygonPoints);
        await fetchSoilData(centroid[0], centroid[1]);
      }
    };

    fetchSoilDataOnPolygonChange();
  }, [confirm]);

  const fetchWithTimeout = (url, timeout = 10000) => {
    return Promise.race([
      fetch(url).then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout exceeded")), timeout)
      ),
    ]);
  };

  const fetchSoilData = async (lat, lng) => {
    setLoading(true);

    const propertyBaseUrl =
      "https://rest.isric.org/soilgrids/v2.0/properties/query";
    const classificationUrl = `https://rest.isric.org/soilgrids/v2.0/classification/query?lon=${lng}&lat=${lat}&number_classes=1`;

    const fetchProperty = async (property) => {
      const url = `${propertyBaseUrl}?lon=${lng}&lat=${lat}&property=${property}&depth=0-5cm`;
      try {
        const data = await fetchWithTimeout(url);
        return data?.properties?.layers?.[0]?.depths?.[0]?.values?.mean ?? 0;
      } catch (e) {
        console.warn(`Fetch for ${property} failed or timed out:`, e.message);
        return 0;
      }
    };

    let soilName = "Unknown";

    try {
      const wrbData = await fetchWithTimeout(classificationUrl);
      soilName = wrbData?.wrb_class_name ?? "Unknown";
    } catch (e) {
      console.warn("Classification fetch failed or timed out:", e.message);
    }

    const phMean = await fetchProperty("phh2o");
    const socMean = await fetchProperty("soc");
    const nitrogenMean = await fetchProperty("nitrogen");
    const cecMean = await fetchProperty("cec");

    let data = {
      ph: phMean / 10,
      soil: soilName,
      carbon: socMean / 100,
      nitrogen: nitrogenMean / 100,
      cec: cecMean / 10,
    };

    try {
      await getRekomendasiAI({
        location: {
          latitude: lat,
          longitude: lng,
        },
      }).then((res) => {
        res[0].rekomendasi_final_json = JSON.parse(
          res[0].rekomendasi_final_json
        );
        data = {
          ...data,
          data: res[0],
        };
      });
      await handleAnalyze(JSON.stringify(data));
    } catch (err) {
      console.error("Error in handleAnalyze:", err);
    }

    setTempData(data);
    setLoading(false);
    return data;
  };

  const handleAddPolygon = () => {
    if (
      polygonPoints.length > 2 &&
      fieldName.trim() &&
      soilType.trim() &&
      cropId.trim() &&
      cropDate
    ) {
      let data = {
        nama_lahan: fieldName,
        jenis_tanah: soilType,
        id_tanaman: cropId,
        coords: JSON.stringify(polygonPoints),
        luas_lahan: JSON.stringify(calculateArea(polygonPoints)),
        tanggal_tanam: cropDate,
        estimasi_panen: estimated_time,
      };
      let id = null;
      createDataField(data).then((res) => {
        if (res) {
          setPolygons([
            ...polygons,
            {
              id: res.c_id,
              fieldName: fieldName,
              soilType: soilType,
              coords: polygonPoints,
              cropId: cropId,
              cropDate: cropDate,
              estimated_time: estimated_time,
            },
          ]);
        }
      });
      setPolygonPoints([]);
      setFieldName("");
      setSoilType("");
      setCropId("");
      setCropDate("");
      setEstimatedTime("");
      setResult(null);

      setActiveSection("weather");

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Lahan berhasil ditambahkan! Silakan tunggu beberapa saat untuk memuat data cuaca",
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => {
        if (isMobile) {
          setPanelState("collapsed");
        }
      }, 1500);
    } else {
      Swal.fire({
        icon: "error",
        title: "Ada Masalah",
        text: "Silakan isi semua data lahan dan pastikan titik cukup untuk membentuk poligon",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  /* ==================================================== */

  /***
   * =====================================================
   * Weather Data Fetching & Processing
   * =====================================================
   */
  const processWeatherData = (rawData) => {
    if (
      !rawData.data ||
      !rawData.data[0] ||
      !rawData.data[0].cuaca ||
      rawData.data[0].cuaca.length === 0
    ) {
      return null;
    }

    const hourlyForecasts = rawData.data[0].cuaca[0];

    if (!hourlyForecasts || hourlyForecasts.length === 0) {
      return null;
    }

    let totalTemp = 0;
    let totalHumidity = 0;
    let totalWindSpeed = 0;
    let totalWeatherCode = 0;
    let count = 0;

    const windDirections = {};
    let currentForecast = null;

    const now = new Date();
    let closestTimeDiff = Infinity;

    hourlyForecasts.forEach((forecast) => {
      totalTemp += forecast.t;
      totalHumidity += forecast.hu;
      totalWindSpeed += forecast.ws;
      totalWeatherCode += forecast.weather;
      count++;

      const windDirection = forecast.wd;
      windDirections[windDirection] = (windDirections[windDirection] || 0) + 1;

      if (forecast.local_datetime) {
        const forecastDate = new Date(forecast.local_datetime);
        const timeDiff = Math.abs(forecastDate - now);
        if (timeDiff < closestTimeDiff) {
          closestTimeDiff = timeDiff;
          currentForecast = forecast;
        }
      }
    });

    let mostCommonDirection = "";
    let maxCount = 0;
    Object.entries(windDirections).forEach(([direction, dirCount]) => {
      if (dirCount > maxCount) {
        maxCount = dirCount;
        mostCommonDirection = direction;
      }
    });

    return {
      lokasi: rawData.lokasi,
      params: {
        t: {
          value: [{ value: Math.round(totalTemp / count) }],
        },
        hu: {
          value: [{ value: Math.round(totalHumidity / count) }],
        },
        ws: {
          value: [{ value: (totalWindSpeed / count).toFixed(1) }],
        },
        wr: {
          value: [{ text: mostCommonDirection }],
        },
        weather: {
          value: [
            {
              value: Math.round(totalWeatherCode / count),
              text: currentForecast
                ? currentForecast.weather_desc
                : "Tidak tersedia",
            },
          ],
        },
        datetime: {
          value: [
            {
              text: currentForecast
                ? new Date(currentForecast.local_datetime).toLocaleDateString(
                    "id-ID",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : "hari ini",
            },
          ],
        },
      },
    };
  };

  const fetchWeatherData = async (centroidPosition, cacheKey) => {
    if (
      weatherCache[cacheKey] &&
      (weatherCache[cacheKey].data || weatherCache[cacheKey].isLoading)
    ) {
      return;
    }

    setWeatherCache((prev) => ({
      ...prev,
      [cacheKey]: { isLoading: true },
    }));

    try {
      const lat = centroidPosition[0];
      const lon = centroidPosition[1];
      const response = await fetch(
        `https://cuaca.bmkg.go.id/api/df/v1/forecast/coord?lon=${lon}&lat=${lat}`
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data cuaca");
      }

      const rawData = await response.json();

      const processedData = processWeatherData(rawData);

      setWeatherCache((prev) => ({
        ...prev,
        [cacheKey]: {
          isLoading: false,
          data: processedData,
          error: null,
        },
      }));
    } catch (err) {
      console.error("Error fetching weather data:", err);

      setWeatherCache((prev) => ({
        ...prev,
        [cacheKey]: {
          isLoading: false,
          data: null,
          error: err.message,
        },
      }));
    }
  };

  const formatArea = (area) => {
    if (!area) return "Menghitung...";
    return <>{area.hectares.toFixed(4)} hektar</>;
  };

  useEffect(() => {
    if (!initialWeatherLoaded && polygons.length > 0) {
      polygons.forEach((poly) => {
        const centroidPosition = calculateCentroid(poly.coords);
        const cacheKey = `${centroidPosition[0].toFixed(6)}_${centroidPosition[1].toFixed(6)}`;

        if (!weatherCache[cacheKey]) {
          fetchWeatherData(centroidPosition, cacheKey);
        }
      });
      setInitialWeatherLoaded(true);
    }
  }, [initialWeatherLoaded, polygons]);
  /* ==================================================== */

  /***
   * =====================================================
   * Camera and File Upload Handler
   * =====================================================
   */
  const handlePredict = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(API_URL_CLF + "/api/soil/predict", formData);

      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyze = async (data) => {
    if (data) {
      const jsonData = JSON.parse(data);

      try {
        const res = await axios.post(API_URL_CLF + "/api/soil/analyze", {
          ph: jsonData.ph,
          soil: jsonData.soil,
          carbon: jsonData.carbon,
          nitrogen: jsonData.nitrogen,
          cec: jsonData.cec,
        });

        setResultData(res.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const mergeRecommendations = (imageData, nutrientData, weatherData) => {
    const scores = {};

    const listFromImage = imageData?.recommendation?.suitable_crops || [];
    const listFromNutrients = nutrientData?.plants_by_condition || [];
    const listFromWeather =
      weatherData?.rekomendasi_final_json?.map((item) => item.nama) || [];

    const processList = (list, source) => {
      list.forEach((plant) => {
        const plantName = capitalizeFirstLetter(plant);
        if (!scores[plantName]) {
          scores[plantName] = { score: 0, sources: [] };
        }
        scores[plantName].score++;
        if (!scores[plantName].sources.includes(source)) {
          scores[plantName].sources.push(source);
        }
      });
    };

    processList(listFromImage, "Visual Tanah");
    processList(listFromNutrients, "Nutrisi Tanah");
    processList(listFromWeather, "Prediksi Cuaca");

    const sortedRecs = Object.entries(scores)
      .map(([plant, data]) => ({
        plant,
        score: data.score,
        reasons: data.sources.join(", "),
      }))
      .sort((a, b) => b.score - a.score);

    return sortedRecs;
  };

  useEffect(() => {
    if (result && resultData && predictionData) {
      const finalRecommendation = mergeRecommendations(
        result,
        resultData,
        predictionData
      );
      setUnifiedRecommendation(finalRecommendation);
    }
  }, [result, resultData, predictionData]);

  const captureFromCamera = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then((res) => res.blob());
    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
    setPreview(imageSrc);
    handlePredict(file);
  }, [webcamRef]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);
    handlePredict(file);
  };
  /* ==================================================== */

  /***
   * =====================================================
   * Render Sections (Weather, Field, Summary)
   * =====================================================
   */
  const renderWeatherSection = () => (
    <div className="md:pt-2">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#6C7D41]">Cuaca Saat Ini</h2>
          <div className="text-3xl">
            <img src={nd?.image} alt="Weather Icon" height={50} width={50} />
          </div>
        </div>

        <p className="text-base font-medium text-gray-700 mt-2">
          {nd?.weather_desc || "Memuat..."}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow-sm">
            <div className="flex items-center">
              <span className="text-blue-400 mr-2">🌡️</span>
              <div>
                <p className="text-xs text-gray-500">Suhu</p>
                <p className="font-bold text-lg">{nd?.t || "-"}°C</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow-sm">
            <div className="flex items-center">
              <span className="text-blue-400 mr-2">💧</span>
              <div>
                <p className="text-xs text-gray-500">Kelembaban</p>
                <p className="font-bold text-lg">{nd?.hu || "-"}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow-sm">
            <div className="flex items-center">
              <span className="text-blue-400 mr-2">💨</span>
              <div>
                <p className="text-xs text-gray-500">
                  Angin <sub>km/j</sub>
                </p>
                <p className="font-bold text-lg">{nd?.ws || "-"}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow-sm">
            <div className="flex items-center">
              <span className="text-blue-400 mr-2">🧭</span>
              <div>
                <p className="text-xs text-gray-500">Arah</p>
                <p className="font-bold text-lg">{nd?.wd || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          Diperbarui: {dateNow}
        </div>
      </div>
    </div>
  );

  const renderFieldSection = () => (
    <div className="md:p-2">
      {polygonPoints.length > 0 && (
        <div className="bg-[#6C7D4110] backdrop-blur-sm rounded-lg p-3 shadow-sm mb-2">
          <div className="flex justify-between gap-2">
            <p className="text-sm font-medium text-green-800">
              Titik: {polygonPoints.length}
            </p>
            {calculateArea(polygonPoints) && (
              <p className="text-xs text-green-700">
                {formatArea(calculateArea(polygonPoints))}
              </p>
            )}
          </div>
          <div className="flex mt-4">
            <button
              onClick={() => {
                setPolygonPoints([]);
                setConfirm(false);
                setLoading(false);
                setResultData(null);
                setResult(null);
                setSoilType("");
                setPreview(null);
                setPanelState("collapsed");
              }}
              className="text-xs bg-red-100 text-red-600 py-1 px-3 rounded-full"
            >
              Batal dan Hapus
            </button>
            {!confirm && (
              <button
                onClick={async () => {
                  if (polygonPoints.length > 2) {
                    setConfirm(true);
                  } else {
                    Swal.fire({
                      icon: "error",
                      title: "Ada Masalah",
                      text: "Silakan buat poligon dengan minimal 3 titik.",
                      showConfirmButton: false,
                      timer: 1500,
                    });
                  }
                }}
                className="text-xs bg-[#6C7D41] text-white py-1 px-3 rounded-full ml-2"
              >
                Kunci Lahan
              </button>
            )}
          </div>
        </div>
      )}
      <div className="rounded-xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lahan
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#6C7D41] focus:ring-1 focus:ring-[#6C7D41] focus:outline-none"
              placeholder="Contoh: Lahan Jagung"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Tanah
            </label>
            <input
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#6C7D41] focus:ring-1 focus:ring-[#6C7D41] focus:outline-none mb-2"
              readOnly={true}
              placeholder="Silahkan Foto Tanah"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
            />
            <button
              onClick={() => {
                if (confirm) {
                  setOpen(true);
                } else {
                  Swal.fire({
                    icon: "warning",
                    title: "Perhatian",
                    text: "Silakan kunci lahan terlebih dahulu sebelum mengambil gambar.",
                    showConfirmButton: false,
                    timer: 1500,
                  });
                }
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm shadow-md w-full"
            >
              Ambil Gambar
            </button>
          </div>
          {resultData && result && !loading && soilType && (
            <div className="max-w-[500px] mx-auto">
              <div className="space-y-4">
                {resultData.soil_parameters && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-base font-semibold text-gray-900">
                        Klasifikasi Tanah
                      </h3>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Jenis Tanah</p>
                      <p className="text-lg font-medium text-gray-900">
                        {resultData.soil_parameters.soil}
                      </p>
                      {predictionData?.jenis_lahan && (
                        <>
                          <p className="text-sm text-gray-600 mt-1 mb-1">
                            Tipe Lahan:
                          </p>
                          <span className="text-sm font-medium text-gray-900">
                            {predictionData.jenis_lahan}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Soil Parameters Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div
                        className={`p-3 rounded-lg border-2 border-dashed ${getParameterColor("ph", resultData.soil_parameters.ph).includes("green") ? "border-green-200" : "border-amber-200"}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                              pH
                            </span>
                          </div>
                        </div>
                        <p className="text-xl font-bold text-gray-900">
                          {resultData.soil_parameters.ph}
                          <small
                            className={`text-xs ${getParameterColor("ph", resultData.soil_parameters.ph)}`}
                          >
                            {" "}
                            {getParameterStatus(
                              "ph",
                              resultData.soil_parameters.ph
                            )}
                          </small>
                        </p>
                      </div>

                      <div
                        className={`p-3 rounded-lg border-2 border-dashed ${getParameterColor("carbon", resultData.soil_parameters.carbon).includes("green") ? "border-green-200" : "border-amber-200"}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Leaf className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                              Karbon
                            </span>
                          </div>
                        </div>
                        <p className="text-xl font-bold text-gray-900">
                          {resultData.soil_parameters.carbon}%
                          <small
                            className={`text-xs ${getParameterColor("carbon", resultData.soil_parameters.carbon)}`}
                          >
                            {" "}
                            {getParameterStatus(
                              "carbon",
                              resultData.soil_parameters.carbon
                            )}
                          </small>
                        </p>
                      </div>

                      <div
                        className={`p-3 rounded-lg border-2 border-dashed ${getParameterColor("nitrogen", resultData.soil_parameters.nitrogen).includes("green") ? "border-green-200" : "border-amber-200"}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Droplet className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                              Nitrogen
                            </span>
                          </div>
                        </div>
                        <p className="text-xl font-bold text-gray-900">
                          {resultData.soil_parameters.nitrogen}%
                          <small
                            className={`text-xs ${getParameterColor("nitrogen", resultData.soil_parameters.nitrogen)}`}
                          >
                            {" "}
                            {getParameterStatus(
                              "nitrogen",
                              resultData.soil_parameters.nitrogen
                            )}
                          </small>
                        </p>
                      </div>

                      <div
                        className={`p-3 rounded-lg border-2 border-dashed ${getParameterColor("cec", resultData.soil_parameters.cec).includes("green") ? "border-green-200" : "border-amber-200"}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <BarChart2 className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                              CEC
                            </span>
                          </div>
                        </div>
                        <p className="text-xl font-bold text-gray-900">
                          {resultData.soil_parameters.cec}
                          <small
                            className={`text-xs ${getParameterColor("cec", resultData.soil_parameters.cec)}`}
                          >
                            {" "}
                            {getParameterStatus(
                              "cec",
                              resultData.soil_parameters.cec
                            )}
                          </small>
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 flex items-start gap-2">
                        <span>
                          Jika nilai parameter menunjukkan 0, data mungkin tidak
                          tersedia untuk area tersebut atau lahan sudah beralih
                          fungsi menjadi pemukiman.
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sprout className="w-4 h-4 text-gray-700" />
                    <h3 className="text-sm font-semibold text-gray-900">
                      Rekomendasi Tanaman
                    </h3>
                  </div>

                  {(() => {
                    const nonProduktifKeywords = [
                      "Kampung",
                      "Permukiman",
                      "Industri",
                      "Lapangan",
                      "Perkantoran",
                      "Perumahan",
                      "Sekolah",
                      "Pabrik",
                      "Jasa",
                      "Perdagangan",
                      "Pertokoan",
                      "Kuburan",
                    ];

                    const jenisLahan =
                      predictionData?.jenis_lahan?.toLowerCase() || "";

                    const isNonProduktif = nonProduktifKeywords.some(
                      (keyword) => jenisLahan.includes(keyword.toLowerCase())
                    );

                    return !isNonProduktif ? (
                      <div>
                        {unifiedRecommendation.length > 0 && (
                          <div>
                            <div className="space-y-2 mb-4">
                              {unifiedRecommendation
                                .slice(0, 3)
                                .map((rec, index) => (
                                  <div
                                    key={index}
                                    className="relative bg-[#6d7e4114] rounded-lg p-5 transition-colors duration-200"
                                  >
                                    <div className="flex gap-4">
                                      <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-[#6d7e4114] rounded-full flex items-center justify-center">
                                          <span className="text-sm font-medium text-green-900">
                                            {index + 1}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="font-semibold text-green-900 mb-2">
                                          {rec.plant}
                                        </h4>
                                        <p className="text-green-800 text-sm leading-relaxed">
                                          {rec.reasons}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="absolute left-0 top-4 bottom-4 w-1 bg-green-600 rounded-full"></div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        <details className="bg-white p-3 rounded-lg border">
                          <summary className="font-medium text-sm cursor-pointer">
                            Lihat Rincian Analisis Sistem
                          </summary>
                          <div className="mt-4 space-y-4 pt-4 border-t">
                            {resultData?.plants_by_condition?.length > 0 && (
                              <div className="border-l-4 border-purple-400 pl-2">
                                <div className="flex items-center gap-1 mb-1">
                                  <Leaf className="w-3 h-3 text-purple-600" />
                                  <span className="text-xs font-medium text-purple-700">
                                    Klasifikasi Ilmiah
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {resultData.plants_by_condition.map(
                                    (crop, index) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                                      >
                                        {capitalizeFirstLetter(crop)}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {predictionData?.rekomendasi_final_json && (
                              <div className="border-l-4 border-blue-400 pl-2">
                                <div className="flex items-center gap-1 mb-1">
                                  <Cloud className="w-3 h-3 text-blue-600" />
                                  <span className="text-xs font-medium text-blue-700">
                                    Prediksi Cuaca
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {predictionData.rekomendasi_final_json.map(
                                    (crop, index) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                                      >
                                        {capitalizeFirstLetter(crop.nama)}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {result?.recommendation &&
                              result.recommendation.suitable_crops.length >
                                0 && (
                                <div className="border-l-4 border-green-400 pl-2">
                                  <div className="flex items-center gap-1 mb-1">
                                    <BarChart2 className="w-3 h-3 text-green-600" />
                                    <span className="text-xs font-medium text-green-700">
                                      Parameter Tanah
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {result.recommendation.suitable_crops.map(
                                      (crop, index) => (
                                        <span
                                          key={index}
                                          className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                                        >
                                          {capitalizeFirstLetter(crop)}
                                        </span>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        </details>
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                              <Sprout className="h-5 w-5 text-slate-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900 text-sm">
                                Rekomendasi Belum Tersedia
                              </h4>
                              <p className="text-xs text-slate-600 mt-1">
                                Lahan ini terdeteksi sebagai lahan
                                non-produktif. Silakan pilih lahan produktif
                                untuk mendapatkan rekomendasi tanaman.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Tanaman
            </label>

            <select
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#6C7D41] focus:ring-1 focus:ring-[#6C7D41] focus:outline-none"
              value={cropId}
              key="crop-select"
              onClick={(e) => {
                e.stopPropagation();
                if (!confirm) {
                  Swal.fire({
                    icon: "warning",
                    title: "Peringatan",
                    text: "Silakan kunci lahan terlebih dahulu sebelum memilih tanaman.",
                    showConfirmButton: false,
                    timer: 1500,
                  });
                }
              }}
              onChange={(e) => {
                const selectedValue = e.target.value;
                setCropId(selectedValue);
                const selectedCrop = cropData.find(
                  (crop) => crop.id === parseInt(selectedValue)
                );
                if (selectedCrop && cropDate) {
                  const estimatedDate = new Date(cropDate);
                  estimatedDate.setDate(
                    estimatedDate.getDate() +
                      parseInt(selectedCrop.estimated_time)
                  );
                  setEstimatedTime(estimatedDate.toISOString().split("T")[0]);
                } else {
                  setEstimatedTime("");
                }
              }}
            >
              <option value="" key="disable" disabled>
                Pilih Tanaman
              </option>
              {confirm &&
                soilType &&
                cropData.map((crop) => (
                  <option key={crop.id} value={crop.id}>
                    {capitalizeFirstLetter(crop.label)}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Tanam
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#6C7D41] focus:ring-1 focus:ring-[#6C7D41] focus:outline-none appearance-none"
              style={{
                WebkitAppearance: "none",
                MozAppearance: "none",
                appearance: "none",
              }}
              value={cropDate}
              onChange={(e) => {
                setCropDate(e.target.value);
                const selectedCrop = cropData.find(
                  (crop) => crop.id === parseInt(cropId)
                );
                if (selectedCrop) {
                  const estimatedDate = new Date(e.target.value);
                  estimatedDate.setDate(
                    estimatedDate.getDate() +
                      parseInt(selectedCrop.estimated_time)
                  );
                  setEstimatedTime(estimatedDate.toISOString().split("T")[0]);
                }
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimasi Panen
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#6C7D41] focus:ring-1 focus:ring-[#6C7D41] focus:outline-none appearance-none"
              style={{
                WebkitAppearance: "none",
                MozAppearance: "none",
                appearance: "none",
              }}
              value={estimated_time}
              onChange={(e) => setEstimatedTime(e.target.value)}
            />
          </div>

          {estimated_time && (
            <div className="text-xs text-gray-500">
              Estimasi Panen:{" "}
              {new Date(estimated_time).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "2-digit",
              })}
            </div>
          )}

          <button
            onClick={() => {
              if (type === "add") {
                setPanelState("collapsed");
                handleAddPolygon();
              } else if (type === "edit") {
                setPanelState("collapsed");
                handleEditLahan(contextMenu.polygonIndex);
              }
            }}
            disabled={
              polygonPoints.length < 3 ||
              !fieldName.trim() ||
              !cropId.trim() ||
              !cropDate
            }
            className={`w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center
            ${
              polygonPoints.length < 3 ||
              !fieldName.trim() ||
              !soilType.trim() ||
              !cropId.trim() ||
              !cropDate
                ? "bg-gray-300"
                : "bg-gradient-to-r from-[#6C7D41] to-[#8a9d52]"
            }`}
          >
            {type === "add" ? "Simpan Lahan" : "Perbarui Lahan"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderSummarySection = () => (
    <>
      <div className="md:rounded-xl md:shadow-sm">
        {!isMobile && (
          <h2 className="text-xl font-bold text-[#6C7D41] mb-3">Lahan Saya</h2>
        )}

        {polygons.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Anda belum memiliki lahan</p>
          </div>
        ) : (
          <div className="space-y-3">
            {polygons.map((poly, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm cursor-pointer"
                onClick={() => {
                  mapRef.current.setView(calculateCentroid(poly.coords), 18, {
                    animate: true,
                    duration: 0.5,
                  });
                  setPanelState("collapsed");
                }}
                onContextMenu={(e) => handleContextMenu(e, index)}
              >
                <div className="font-medium text-[#6C7D41]">
                  {poly.fieldName}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <div>
                    Tanaman:{" "}
                    {capitalizeFirstLetter(
                      cropData.find((crop) => poly.cropId == crop.id)?.label ||
                        "Tidak Diketahui"
                    )}
                  </div>
                  <div>Luas: {formatArea(calculateArea(poly.coords))}</div>
                </div>
                {isMobile && (
                  <div className="flex justify-end mt-2">
                    <button
                      className="text-xs bg-blue-100 text-blue-600 py-1 px-3 rounded-full mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        mapRef.current.setView(
                          calculateCentroid(poly.coords),
                          18,
                          { animate: true, duration: 0.5 }
                        );
                        setType("edit");
                        EditLahan(index);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs bg-red-100 text-red-600 py-1 px-3 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLahan(poly.id);
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  /* ==================================================== */

  /***
   * =====================================================
   * Context Menu
   * =====================================================
   */
  const handleContextMenu = (e, index) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      polygonIndex: index,
    });
  };

  const handleClickOutside = () => {
    setContextMenu({
      ...contextMenu,
      visible: false,
    });
  };
  /* ==================================================== */

  /***
   * =====================================================
   * Tile Layer Function BMKG
   * =====================================================
   */
  const [latestRadarLayer, setLatestRadarLayer] = useState("");
  const [error, setError] = useState(null);
  const [isNdiviOverlayActive, setIsNdiviOverlayActive] = useState(false);
  const wmsBaseUrl = "https://radar.bmkg.go.id/sidarmageoserver";

  useEffect(() => {
    axios
      .get(API_URL + "/api/radar-info")
      .then((response) => {
        const data = response.data;

        if (data && data.wmts && data.wmts.latest && data.wmts.latest.layer) {
          const layerName = data.wmts.latest.layer;
          setLatestRadarLayer(layerName);
        } else {
          throw new Error("Struktur data JSON dari API tidak sesuai.");
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil data layer radar:", err);
        if (err.response) {
          setError(
            `Gagal terhubung ke BMKG. Server merespons dengan status ${err.response.status}`
          );
        } else if (err.request) {
          setError(
            "Tidak ada respons dari server backend. Pastikan server.py sudah berjalan."
          );
        } else {
          setError(err.message);
        }
      });
    // ---------------------------------------------
  }, []);

  const wmsParams = useMemo(
    () => ({
      layers: latestRadarLayer,
      format: "image/png",
      transparent: true,
      styles: "CMAX_dBZ",
      version: "1.1.0",
    }),
    [latestRadarLayer]
  );

  const createMaskGeoJson = (lands) => {
    const worldPolygon = [
      [180, 90],
      [-180, 90],
      [-180, -90],
      [180, -90],
      [180, 90],
    ];

    const landHoles = lands.map((land) => {
      const closedBounds = [...land.coords, land.coords[0]];
      return closedBounds.map((coord) => [coord[1], coord[0]]);
    });

    return {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [worldPolygon, ...landHoles],
      },
    };
  };

  const maskGeoJson = useMemo(() => {
    if (polygons.length === 0) return null;
    return createMaskGeoJson(polygons);
  }, [polygons]);

  const MaskingHandler = ({ setNdiviActive }) => {
    useMapEvents({
      overlayadd(e) {
        if (e.name === "Kesehatan Lahan Saya (NDVI)") {
          setNdiviActive(true);
        }
      },
      overlayremove(e) {
        if (e.name === "Kesehatan Lahan Saya (NDVI)") {
          setNdiviActive(false);
        }
      },
    });
    return null;
  };
  /* ==================================================== */

  return (
    <>
      {/* Header on Mobile */}
      {isMobile && <Header />}

      <div className="h-screen relative flex" onClick={handleClickOutside}>
        {showNdiviTutorial && isAuthenticated && (
          <NdiviTutorialModal onClose={closeTutorial} />
        )}
        {/* Desktop sidebar */}
        {!isMobile && panelDesktop === "expanded" && (
          <m.div
            className="z-[999] bg-white p-5 rounded-xl shadow-md w-[500px] border border-gray-200 h-screen overflow-y-auto"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="flex mb-4 border-b border-gray-100">
              {isAuthenticated && (
                <>
                  <button
                    className={`flex-1 py-3 text-center text-sm font-medium relative overflow-hidden transition-all duration-300 ${
                      activeSection === "weather"
                        ? "text-[#6C7D41] scale-105"
                        : "text-gray-500 hover:text-[#6C7D41]"
                    }`}
                    onClick={() => setActiveSection("weather")}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {/* Weather icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16H5.5z" />
                      </svg>
                      Cuaca & Lahan
                    </span>
                    {activeSection === "weather" && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#6C7D41] rounded-t-lg transform transition-transform duration-300"></span>
                    )}
                  </button>

                  <button
                    className={`flex-1 py-3 text-center text-sm font-medium relative overflow-hidden transition-all duration-300 ${
                      activeSection === "field"
                        ? "text-[#6C7D41] scale-105"
                        : "text-gray-500 hover:text-[#6C7D41]"
                    }`}
                    onClick={() => setActiveSection("field")}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {/* Field/Plant icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z"
                          clipRule="evenodd"
                        />
                        <path d="M10 7a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1H8a1 1 0 110-2h1V8a1 1 0 011-1z" />
                      </svg>
                      {type === "add" ? "Tambah Lahan" : "Edit Lahan"}
                    </span>
                    {activeSection === "field" && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#6C7D41] rounded-t-lg transform transition-transform duration-300"></span>
                    )}
                  </button>
                </>
              )}
            </div>
            {activeSection === "weather" && renderWeatherSection()}
            {activeSection === "field" && (
              <div className="mb-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-bold text-[#6C7D41]">
                    {type === "add" ? "Tambah Lahan Baru" : "Edit Lahan"}
                  </h1>
                  {type === "edit" && (
                    <button
                      className="text-sm text-red-500 hover:text-red-700"
                      onClick={() => {
                        setType("add");
                        setFieldName("");
                        setSoilType("");
                        setCropId("");
                        setCropDate("");
                        setEstimatedTime("");
                        setResultData(null);
                        setResult(null);
                        setPreview(null);
                        setPolygonPoints([]);
                      }}
                    >
                      Batal
                    </button>
                  )}
                </div>
                {renderFieldSection()}
              </div>
            )}

            <span className="block h-8" />

            {!isMobile & isAuthenticated
              ? activeSection === "weather" && renderSummarySection()
              : null}
          </m.div>
        )}

        {/* context menu */}
        {!isMobile && contextMenu.visible && (
          <div
            className="z-[9999] fixed bg-white shadow-lg rounded-lg p-2 border border-gray-200"
            style={{
              top: `${contextMenu.y}px`,
              left: `${contextMenu.x}px`,
            }}
          >
            <div className="flex flex-col gap-1 min-w-[150px]">
              <button
                className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded-md w-full text-left transition-colors"
                onClick={() =>
                  handleDeleteLahan(polygons[contextMenu.polygonIndex].id)
                }
              >
                <Trash className="h-4 w-4" /> Hapus
              </button>
              <button
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md w-full text-left transition-colors"
                onClick={() =>
                  mapRef.current.setView(
                    calculateCentroid(
                      polygons[contextMenu.polygonIndex].coords
                    ),
                    18,
                    { animate: true, duration: 0.5 }
                  )
                }
              >
                <ArrowRight className="h-4 w-4" /> Pindah
              </button>
              <button
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md w-full text-left transition-colors"
                onClick={() => {
                  mapRef.current.setView(
                    calculateCentroid(
                      polygons[contextMenu.polygonIndex].coords
                    ),
                    18,
                    { animate: true, duration: 0.5 }
                  );
                  EditLahan(contextMenu.polygonIndex);
                }}
                onContextMenu={(e) => e.preventDefault()}
              >
                <ArrowLeft className="h-4 w-4" /> Edit
              </button>
              <hr className="my-1 border-gray-200" />
              <button
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md w-full text-left transition-colors"
                onClick={() =>
                  setContextMenu({ ...contextMenu, visible: false })
                }
              >
                <X className="h-4 w-4" /> Tutup
              </button>
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="relative w-full transition-all duration-300 ease-in-out">
          <MapContainer
            center={yogyakartaPosition}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
            zoomControl={false}
          >
            {isAuthenticated && (
              <MaskingHandler setNdiviActive={setIsNdiviOverlayActive} />
            )}

            <LayersControl position="topright">
              {/* --- BASE LAYERS --- */}
              <LayersControl.BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
              </LayersControl.BaseLayer>

              <LayersControl.BaseLayer name="Peta Satelit (Esri)">
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                  maxZoom={19}
                  minZoom={1}
                />
              </LayersControl.BaseLayer>

              {/* --- OVERLAYS (LAPISAN) --- */}
              {isAuthenticated && (
                <LayersControl.Overlay name="Lapisan Curah Hujan">
                  <TileLayer
                    url={`${API_URL}/api/proxy/weather-tile/precipitation_new/{z}/{x}/{y}.png`}
                    attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                    opacity={0.9}
                  />
                </LayersControl.Overlay>
              )}

              {isAuthenticated && (
                <LayersControl.Overlay name="Lapisan Suhu Udara">
                  <TileLayer
                    url={`${API_URL}/api/proxy/weather-tile/temp_new/{z}/{x}/{y}.png`}
                    attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                    opacity={0.9}
                  />
                </LayersControl.Overlay>
              )}

              {isAuthenticated && (
                <LayersControl.Overlay name="Lapisan Awan">
                  <TileLayer
                    url={`${API_URL}/api/proxy/weather-tile/clouds_new/{z}/{x}/{y}.png`}
                    attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                    opacity={1}
                  />
                </LayersControl.Overlay>
              )}

              {isAuthenticated && (
                <LayersControl.Overlay name="Kesehatan Lahan Saya (NDVI)">
                  <WMSTileLayer
                    url={`${API_URL}/api/proxy/sentinel-hub`}
                    layers="VEGETATION_INDEX"
                    format="image/png"
                    transparent={true}
                    attribution='&copy; <a href="https://www.sentinel-hub.com/">Sentinel Hub</a>'
                    opacity={0.9}
                  />
                </LayersControl.Overlay>
              )}

              {isNdiviOverlayActive && (
                <GeoJSON
                  key={JSON.stringify(maskGeoJson)}
                  data={maskGeoJson}
                  style={{
                    fillColor: "black",
                    fillOpacity: 0.8,
                    stroke: false,
                    interactive: false,
                  }}
                />
              )}

              {isAuthenticated && latestRadarLayer && (
                <LayersControl.Overlay name="Radar Cuaca BMKG (Terbaru)">
                  <WMSTileLayer
                    key={latestRadarLayer}
                    url={wmsBaseUrl}
                    params={wmsParams}
                    opacity={0.5}
                    attribution="BMKG"
                    className="scale-100"
                  />
                </LayersControl.Overlay>
              )}
            </LayersControl>

            {location && (
              <Marker
                position={[location.latitude, location.longitude]}
                icon={L.divIcon({
                  className: "user-location-marker",
                  html: `
                  <div class="relative">
                    <div class="absolute -top-1 -left-1 w-8 h-8 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
                    <div class="relative z-10 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                  </div>
                `,
                  iconSize: [30, 30],
                  iconAnchor: [15, 15],
                })}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                  <div className="text-center">
                    <div className="font-bold text-blue-800">Lokasi Anda</div>
                  </div>
                </Tooltip>
              </Marker>
            )}

            {isAuthenticated ? !confirm && <MapClickHandler /> : null}

            {polygonPoints.length > 0 && (
              <Polygon
                positions={polygonPoints}
                pathOptions={{
                  color: "#6C7D41",
                  fillOpacity: 0.2,
                  weight: 3,
                }}
              >
                <Marker
                  position={calculateCentroid(polygonPoints)}
                  icon={L.divIcon({
                    className: "marker-icon",
                    html: `
                      <div class="relative">
                        <div class="absolute -top-1 -left-1 w-8 h-8 bg-green-500 rounded-full opacity-30 animate-ping"></div>
                        <div class="relative z-10 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center border-2 border-white">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                        </div>
                      </div>
                    `,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15],
                  })}
                />
                <Popup className="text-center">
                  <div className="font-bold text-green-800">Lahan Baru</div>
                  <div className="text-sm">
                    Luas: {formatArea(calculateArea(polygonPoints))}
                  </div>
                </Popup>
              </Polygon>
            )}

            {/* Poligon yang sudah ada */}
            {polygons.map((poly, index) => {
              const centroidPosition = calculateCentroid(poly.coords);
              const cacheKey = `${centroidPosition[0].toFixed(
                6
              )}_${centroidPosition[1].toFixed(6)}`;
              const cachedData = weatherCache[cacheKey];

              const weatherData = cachedData?.data || null;
              const isLoading = cachedData?.isLoading || false;
              const error = cachedData?.error || null;
              return (
                <Polygon
                  key={index}
                  positions={poly.coords}
                  pathOptions={{
                    color: "#6C7D41",
                    fillOpacity: 0.1,
                    weight: 3,
                    opacity: 1,
                    fillPattern: {
                      patternShape: { shape: "diamond", width: 4, height: 4 },
                      patternFillColor: "#6C7D41",
                      patternStrokeColor: "#6C7D41",
                      patternStrokeWidth: 1,
                      patternSpacing: 6,
                    },
                  }}
                  eventHandlers={{
                    click: () => {
                      mapRef.current.setView(centroidPosition, 18, {
                        animate: true,
                        duration: 0.5,
                      });
                      fetchSoilData(centroidPosition[0], centroidPosition[1]);
                    },
                  }}
                >
                  <Popup
                    className="weather-soil-popup"
                    maxWidth="300"
                    closeButton
                    autoClose={false}
                    closeOnClick={false}
                    onClose={() => {
                      setWeatherCache((prev) => ({
                        ...prev,
                        [cacheKey]: { ...prev[cacheKey], isLoading: false },
                      }));
                    }}
                  >
                    <div className="text-sm w-[240px]">
                      {/* Header */}
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-blue-800">
                          {poly.fieldName}
                        </h3>
                      </div>

                      {/* Weather */}
                      <div className="mb-4 bg-white rounded-md border border-blue-100 shadow-sm">
                        <div className="bg-blue-50 px-2 py-1.5 border-b border-blue-100 flex items-center justify-between">
                          <div className="flex items-center text-xs font-medium text-blue-700">
                            <svg
                              className="w-3.5 h-3.5 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                              />
                            </svg>
                            Cuaca
                          </div>
                          <span className="text-xs text-blue-600">
                            {weatherData?.params?.weather?.value[0]?.text ||
                              "-"}
                          </span>
                        </div>

                        {isLoading ? (
                          <div className="flex justify-center items-center py-3 m-2">
                            <div className="animate-spin h-3 w-3 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
                            <span className="ml-2 text-gray-500 text-xs">
                              Memuat...
                            </span>
                          </div>
                        ) : error ? (
                          <div className="text-center text-red-500 py-2 text-xs m-2">
                            Gagal memuat data cuaca
                          </div>
                        ) : weatherData ? (
                          <>
                            <div className="grid grid-cols-2 gap-2 text-xs p-2">
                              <div className="text-center mb-1">
                                <div className="text-2xl font-bold text-blue-700">
                                  {weatherData?.params?.t?.value[0]?.value ||
                                    "-"}
                                  °
                                </div>
                                <div className="text-xs text-gray-600">
                                  Suhu dalam °C
                                </div>
                              </div>
                              <div className="text-center mb-1">
                                <div className="text-2xl font-bold text-blue-700">
                                  {weatherData?.params?.hu?.value[0]?.value ||
                                    "-"}
                                  %
                                </div>
                                <div className="text-xs text-gray-600">
                                  Kelembapan
                                </div>
                              </div>
                            </div>
                            <div className="text-center text-xs text-gray-400">
                              Diperbarui: {dateNow}
                            </div>
                            <div className="bg-blue-50 px-2 py-1 border-t border-blue-100 text-xs text-blue-700 mt-2">
                              Data cuaca merupakan data cuaca 1 minggu kedepan
                              dengan menggunakan rata-rata harian.
                            </div>
                          </>
                        ) : (
                          <button
                            onClick={() =>
                              fetchWeatherData(centroidPosition, cacheKey)
                            }
                            className="w-full py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-xs font-medium"
                          >
                            Muat Data
                          </button>
                        )}
                      </div>

                      {/* Soil Section */}
                      <div className="bg-white rounded-md border border-amber-100 shadow-sm">
                        <div className="bg-amber-50 px-2 py-1.5 border-b border-amber-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs font-medium text-amber-700">
                              <svg
                                className="w-3.5 h-3.5 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Tanah
                            </div>
                            {tempData?.data.jenis_lahan && (
                              <span className="text-xs text-amber-600">
                                {tempData.data.jenis_lahan}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-2 grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center space-x-2 rounded p-1.5">
                            <div className="bg-amber-100 p-1 rounded">
                              <svg
                                className="w-3.5 h-3.5 text-amber-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547"
                                />
                              </svg>
                            </div>
                            <div>
                              <div className="text-gray-500">pH Tanah</div>
                              <div className="font-semibold text-gray-700">
                                {tempData?.ph?.toFixed(1) || "-"}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 rounded p-1.5">
                            <div className="bg-amber-100 p-1 rounded">
                              <svg
                                className="w-3.5 h-3.5 text-amber-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                />
                              </svg>
                            </div>
                            <div>
                              <div className="text-gray-500">Organik</div>
                              <div className="font-semibold text-gray-700">
                                {tempData?.carbon?.toFixed(1) || "-"}%
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 rounded p-1.5">
                            <div className="bg-amber-100 p-1 rounded">
                              <svg
                                className="w-3.5 h-3.5 text-amber-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 10h18M3 14h18m-9 4h9m-9-4H3m0 0v4m0-4V6m0 8v4m0-4H3m18 0v4m0-4V6m0 8h-9"
                                />
                              </svg>
                            </div>
                            <div>
                              <div className="text-gray-500">Nitrogen</div>
                              <div className="font-semibold text-gray-700">
                                {tempData?.nitrogen?.toFixed(1) || "-"}%
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 rounded p-1.5">
                            <div className="bg-amber-100 p-1 rounded">
                              <svg
                                className="w-3.5 h-3.5 text-amber-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <div className="text-gray-500">CEC</div>
                              <div className="font-semibold text-gray-700">
                                {tempData?.cec?.toFixed(1) || "-"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-amber-50 px-2 py-1 border-t border-amber-100 text-xs text-amber-700">
                          Nilai 0 menunjukkan data tidak tersedia atau lahan
                          sudah beralih fungsi
                        </div>
                      </div>

                      {/* Field Details */}
                      <div className="bg-white rounded-md border border-green-100 shadow-sm mt-2">
                        <div className="bg-green-50 px-2 py-1.5 border-b border-green-100">
                          <div className="flex items-center text-xs font-medium text-green-700">
                            <svg
                              className="w-3.5 h-3.5 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            Detail Lahan
                            <span className="ml-auto text-xs">
                              {poly.cropId
                                ? capitalizeFirstLetter(
                                    cropData.find(
                                      (crop) => poly.cropId == crop.id
                                    )?.label || "Tidak Diketahui"
                                  )
                                : "Tidak Diketahui"}
                            </span>
                          </div>
                        </div>
                        <div className="p-2 text-xs">
                          <div className="flex items-center justify-between">
                            <div className="text-gray-500">Luas</div>
                            <div className="font-semibold text-gray-700">
                              {formatArea(calculateArea(poly.coords))}
                            </div>
                          </div>
                        </div>
                        <div className="p-2 text-xs">
                          <div className="flex items-center justify-between">
                            <div className="text-gray-500">Tanggal Tanam</div>
                            <div className="font-semibold text-gray-700">
                              {poly.cropDate || poly.tanggal_tanam
                                ? new Date(
                                    poly.cropDate || poly.tanggal_tanam
                                  ).toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "long",
                                    day: "2-digit",
                                  })
                                : "Tidak Diketahui"}
                            </div>
                          </div>
                        </div>
                        <div className="p-2 text-xs">
                          <div className="flex items-center justify-between">
                            <div className="text-gray-500">Estimasi Panen</div>
                            <div className="font-semibold text-gray-700">
                              {poly.estimated_time
                                ? new Date(
                                    poly.estimated_time
                                  ).toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "long",
                                    day: "2-digit",
                                  })
                                : "Tidak Diketahui"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              );
            })}
          </MapContainer>

          {!isMobile && (
            <div className="absolute bottom-6 md:right-2 space-y-2 z-[999]">
              {/* Navigation Header panel for Desktop */}
              <div className="leaflet-control rounded-xl shadow-xl overflow-hidden w-[320px]">
                <div
                  className="bg-gradient-to-r from-[#6C7D41] to-[#8BA350] text-white p-3 font-semibold text-sm flex justify-between items-center cursor-pointer"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <span className="flex items-center">
                    {isMenuOpen ? (
                      <X className="h-4 w-4 mr-2" />
                    ) : (
                      <Menu className="h-4 w-4 mr-2" />
                    )}
                    Menu Navigasi
                  </span>
                </div>
                {isMenuOpen && (
                  <div className="p-4 flex flex-col gap-3 bg-white">
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        `flex items-center gap-3 transition-colors duration-200 py-1 px-2 rounded-md hover:bg-gray-50 hover:text-[#6C7D41] ${
                          isActive
                            ? "bg-gray-50 text-[#6C7D41]"
                            : "text-gray-700"
                        }`
                      }
                    >
                      <Home className="h-5 w-5" />
                      <span className="font-medium">Halaman Utama</span>
                    </NavLink>
                    <NavLink
                      to="/peta"
                      className={({ isActive }) =>
                        `flex items-center gap-3 transition-colors duration-200 py-1 px-2 rounded-md hover:bg-gray-50 hover:text-[#6C7D41] ${
                          isActive
                            ? "bg-gray-50 text-[#6C7D41]"
                            : "text-gray-700"
                        }`
                      }
                    >
                      <MapPin className="h-5 w-5" />
                      <span className="font-medium">Peta Interaktif</span>
                    </NavLink>
                    <NavLink
                      to="/forum"
                      className={({ isActive }) =>
                        `flex items-center gap-3 transition-colors duration-200 py-1 px-2 rounded-md hover:bg-gray-50 hover:text-[#6C7D41] ${
                          isActive
                            ? "bg-gray-50 text-[#6C7D41]"
                            : "text-gray-700"
                        }`
                      }
                    >
                      <Users2 className="h-5 w-5" />
                      <span className="font-medium">Forum Diskusi</span>
                    </NavLink>
                    <NavLink
                      to="/tentang-kami"
                      className={({ isActive }) =>
                        `flex items-center gap-3 transition-colors duration-200 py-1 px-2 rounded-md hover:bg-gray-50 hover:text-[#6C7D41] ${
                          isActive
                            ? "bg-gray-50 text-[#6C7D41]"
                            : "text-gray-700"
                        }`
                      }
                    >
                      <Info className="h-5 w-5" />
                      <span className="font-medium">Tentang Kami</span>
                    </NavLink>
                  </div>
                )}
              </div>
              {isAuthenticated && (
                <div className="leaflet-control rounded-xl shadow-xl overflow-hidden w-[320px]">
                  <div
                    className="bg-gradient-to-r from-[#6C7D41] to-[#8BA350] text-white p-3 font-semibold text-sm flex justify-between items-center cursor-pointer"
                    onClick={() => setInformation(!information)}
                  >
                    <span className="flex items-center">
                      {information ? (
                        <X className="h-4 w-4 mr-2" />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      Informasi Peta
                    </span>
                  </div>
                  {information && (
                    <div className="p-4 bg-white">
                      {isAuthenticated && (
                        <div className="border-b border-gray-200 pb-3 mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 font-medium">
                              Total Lahan:
                            </span>
                            <span className="text-sm">{polygons.length}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 font-medium">
                              Total Luas:
                            </span>
                            <span className="text-sm">
                              {formatArea(
                                polygons.reduce(
                                  (acc, poly) => {
                                    const area = calculateArea(poly.coords);
                                    return {
                                      hectares: acc.hectares + area.hectares,
                                      squareMeters:
                                        acc.squareMeters + area.squareMeters,
                                    };
                                  },
                                  { hectares: 0, squareMeters: 0 }
                                )
                              )}
                            </span>
                          </div>
                        </div>
                      )}

                      <span className="text-sm font-semibold text-gray-700">
                        Legenda Peta
                      </span>
                      <div className="space-y-4 mt-2">
                        {latestRadarLayer && (
                          <div>
                            <span className="text-xs font-semibold text-gray-600 block mb-1">
                              Radar Cuaca BMKG
                            </span>
                            <div
                              className="w-full h-3 rounded-full"
                              style={{
                                background: `linear-gradient(to right, #00BFFF, #008000, #FFFF00, #FFA500, #FF0000, #FF00FF)`,
                              }}
                            />
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-gray-500">
                                Tidak Ada Hujan
                              </span>
                              <span className="text-xs text-gray-500">
                                Hujan Sangat Lebat
                              </span>
                            </div>
                          </div>
                        )}

                        <div>
                          <span className="text-xs font-semibold text-gray-600 block mb-1">
                            Curah Hujan
                          </span>
                          <div
                            className="w-full h-3 rounded-full"
                            style={{
                              background: `linear-gradient(to right, #00BFFF, #008000, #FFFF00, #FFA500, #FF0000, #FF00FF)`,
                            }}
                          />
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              Rendah
                            </span>
                            <span className="text-xs text-gray-500">
                              Tinggi
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-gray-600 block mb-1">
                            Suhu Udara
                          </span>
                          <div
                            className="w-full h-3 rounded-full"
                            style={{
                              background: `linear-gradient(to right, #00ffff, #00ff00, #ffff00, #ff0000)`,
                            }}
                          />
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              Dingin
                            </span>
                            <span className="text-xs text-gray-500">Panas</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-gray-600 block mb-1">
                            Tingkat Kekeruhan Awan
                          </span>
                          <div
                            className="w-full h-3 rounded-full"
                            style={{
                              background: `linear-gradient(to right, #e0e0e0, #a0a0a0, #606060)`,
                            }}
                          />
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">Cerah</span>
                            <span className="text-xs text-gray-500">
                              Mendung
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {!isMobile && (
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-[999]">
              <button
                onClick={() => {
                  setPanelDesktop(
                    panelDesktop === "collapsed" ? "expanded" : "collapsed"
                  );
                }}
                className="bg-white w-8 h-12 rounded-tr-xl rounded-br-xl shadow-lg flex items-center justify-center text-[#6C7D41]"
              >
                <span className="text-xl">
                  {panelDesktop === "collapsed" ? (
                    <ArrowRight />
                  ) : (
                    <ArrowLeft />
                  )}
                </span>
              </button>
            </div>
          )}

          {isMobile
            ? isAuthenticated && (
                <div
                  className={`fixed bottom-5 right-4 flex flex-col gap-2 z-[1000]`}
                >
                  <button
                    onClick={() => {
                      setPanelState(
                        panelState === "collapsed" ? "popup" : "collapsed"
                      );
                      setActiveSection("summary");
                    }}
                    className="bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-[#6C7D41]"
                  >
                    <span className="text-xl">📊</span>
                  </button>
                  <button
                    onClick={() => {
                      setPanelState(
                        panelState === "collapsed" ? "popup" : "collapsed"
                      );
                      setActiveSection("field");
                    }}
                    className="bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-[#6C7D41]"
                  >
                    <span className="text-xl">🌱</span>
                  </button>
                  <button
                    onClick={() => {
                      setPanelState(
                        panelState === "collapsed" ? "popup" : "collapsed"
                      );
                      setActiveSection("weather");
                    }}
                    className="bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-[#6C7D41]"
                  >
                    <span className="text-xl">🌤️</span>
                  </button>
                </div>
              )
            : null}

          {/* floating button to direct to now location */}
          {/* make vertical in mobile and horizontal in dekstop */}
          <div className="fixed left-0 md:left-auto bottom-5 z-[999] flex flex-col md:flex-row gap-2">
            <button
              onClick={() => {
                if (location) {
                  mapRef.current.setView(
                    [location.latitude, location.longitude],
                    18,
                    { animate: true, duration: 0.5 }
                  );
                } else {
                  alert("Lokasi Anda tidak ditemukan");
                }
              }}
              className="bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center ml-2"
            >
              <div className="relative z-10 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  width="16"
                  height="16"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
            </button>

            {!isAuthenticated
              ? !isMobile && (
                  <div className="fixed top-0 rounded-lg shadow-md z-[9999] m-2">
                    <div
                      className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 px-2 py-3 rounded gap-2"
                      role="alert"
                    >
                      <p className="block sm:inline text-xs">
                        <strong className="font-bold">Peringatan!</strong> Akses
                        data terbatas, silahkan masuk untuk mendapatkan akses
                        penuh.
                      </p>
                      <NavLink
                        to="/"
                        className="text-[#db7474]"
                        aria-label="Tutup Peringatan"
                        title="Tutup Peringatan"
                      >
                        <XIcon className="h-5 w-5" />
                      </NavLink>
                    </div>
                  </div>
                )
              : null}

            {!isAuthenticated
              ? isMobile && (
                  <div className="rounded-lg shadow-md z-[999] mx-2">
                    <div
                      className="flex items-center justify-center bg-red-50 border border-red-200 text-red-700 px-3 py-3 rounded relative"
                      role="alert"
                    >
                      <p className="block sm:inline text-sm">
                        <strong className="font-bold">Peringatan!</strong> Akses
                        data terbatas, silahkan masuk untuk mendapatkan akses
                        penuh.
                      </p>
                    </div>
                  </div>
                )
              : null}

            {isAuthenticated && (
              <button
                onClick={() => setShowNdiviTutorial(true)}
                className="bg-white rounded-full shadow-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center w-12 h-12 ml-2"
                title="Tampilkan Petunjuk NDVI"
              >
                <HelpCircle size={24} />
              </button>
            )}
          </div>

          {/* confirmation for polygons add in center bottom screen */}
          {isMobile && polygonPoints.length > 0 && (
            <m.div
              initial={{ opacity: 0, transform: "translate(-50%, 20px)" }}
              animate={{ opacity: 1, transform: "translate(-50%, 0)" }}
              exit={{ opacity: 0, transform: "translate(-50%, 20px)" }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[999] bg-white px-4 py-2 rounded-full shadow-md border border-gray-200 flex items-center space-x-3"
            >
              {polygonPoints.length > 2 && (
                <button
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded-full transition duration-200"
                  onClick={() => {
                    setConfirm(true);
                    setPanelState("popup");
                    setActiveSection("field");
                  }}
                >
                  Konfirmasi
                </button>
              )}

              <button
                onClick={() => {
                  setPolygonPoints([]);
                  setPanelState("collapsed");
                  setConfirm(false);
                }}
                className="bg-red-400 hover:bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full transition duration-200"
              >
                Batal
              </button>
            </m.div>
          )}
        </div>

        {isMobile && panelState !== "collapsed" && (
          <m.div
            key="mobile-panel"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-[99999] bg-white bg-opacity-90 backdrop-blur-sm overflow-y-auto"
          >
            <div className="p-4 min-h-screen">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {activeSection === "summary"
                      ? "Ringkasan Lahan"
                      : activeSection === "field"
                        ? "Detail Lahan"
                        : "Cuaca"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {activeSection === "summary"
                      ? "Lihat ringkasan informasi lahan Anda."
                      : activeSection === "field"
                        ? "Detail informasi lahan yang telah Anda pilih."
                        : "Informasi cuaca terkini untuk lahan Anda."}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setPanelState("collapsed");
                    setType("add");
                    setFieldName("");
                    setSoilType("");
                    setCropId("");
                    setCropDate("");
                    setEstimatedTime("");
                    setPolygonPoints([]);
                    setPreview(null);
                    setResult(null);
                    setTempData(null);
                    setConfirm(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close Panel"
                  title="Tutup Panel"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>

              {activeSection === "field" && renderFieldSection()}
              {activeSection === "summary" && renderSummarySection()}
              {activeSection === "weather" && renderWeatherSection()}
              {activeSection === "weather" && (
                <>
                  <span className="text-sm font-semibold text-gray-700">
                    Legenda Peta
                  </span>

                  <div className="space-y-4 mt-2">
                    {latestRadarLayer && (
                      <div>
                        <span className="text-xs font-semibold text-gray-600 block mb-1">
                          Radar Cuaca BMKG
                        </span>
                        <div
                          className="w-full h-3 rounded-full"
                          style={{
                            background: `linear-gradient(to right, #00BFFF, #008000, #FFFF00, #FFA500, #FF0000, #FF00FF)`,
                          }}
                        />
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">
                            Tidak Ada Hujan
                          </span>
                          <span className="text-xs text-gray-500">
                            Hujan Sangat Lebat
                          </span>
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="text-xs font-semibold text-gray-600 block mb-1">
                        Curah Hujan
                      </span>
                      <div
                        className="w-full h-3 rounded-full"
                        style={{
                          background: `linear-gradient(to right, #00BFFF, #008000, #FFFF00, #FFA500, #FF0000, #FF00FF)`,
                        }}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">Rendah</span>
                        <span className="text-xs text-gray-500">Tinggi</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-600 block mb-1">
                        Suhu Udara
                      </span>
                      <div
                        className="w-full h-3 rounded-full"
                        style={{
                          background: `linear-gradient(to right, #00ffff, #00ff00, #ffff00, #ff0000)`,
                        }}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">Dingin</span>
                        <span className="text-xs text-gray-500">Panas</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-600 block mb-1">
                        Tingkat Kekeruhan Awan
                      </span>
                      <div
                        className="w-full h-3 rounded-full"
                        style={{
                          background: `linear-gradient(to right, #e0e0e0, #a0a0a0, #606060)`,
                        }}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">Cerah</span>
                        <span className="text-xs text-gray-500">Mendung</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </m.div>
        )}

        {/* Camera Layout */}
        {open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 z-[99999]">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setOpen(false)}
              >
                <XIcon className="w-6 h-6" />
              </button>

              <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 md:mb-6">
                Deteksi Tipe Tanah & Rekomendasi Tanaman
              </h2>

              <div className="flex flex-col lg:flex-row gap-3 md:gap-6 justify-center items-start">
                <div className="flex flex-col items-center gap-4 w-full lg:w-2/3">
                  {preview && !isMobile && (
                    <div className="flex flex-col items-center w-full">
                      <img
                        src={preview}
                        alt="Preview"
                        className={`w-full ${result ? "h-40" : "h-60"} object-cover rounded-xl border shadow-lg`}
                      />
                    </div>
                  )}
                  {!preview && (
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      mirrored={false}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      className="rounded-xl border shadow-lg"
                    />
                  )}

                  {!isMobile && (
                    <>
                      {!preview ? (
                        <button
                          onClick={captureFromCamera}
                          className="bg-[#6C7D41] text-white font-semibold w-full py-2 px-5 rounded-lg shadow transition"
                        >
                          📸 Ambil Gambar
                        </button>
                      ) : (
                        <button
                          onClick={() => setPreview(null)}
                          className="bg-red-400 text-white font-semibold w-full py-2 px-5 rounded-lg shadow transition"
                        >
                          <span className="flex justify-center">
                            <TrashIcon className="w-5 h-5 mr-2" /> Ambil Ulang
                            Gambar
                          </span>
                        </button>
                      )}

                      <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium w-full px-4 py-2 rounded-lg border cursor-pointer transition justify-center flex">
                        📁 Unggah Gambar
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </>
                  )}

                  {isMobile && !preview && (
                    <>
                      {!preview ? (
                        <button
                          onClick={captureFromCamera}
                          className="bg-[#6C7D41] text-white font-semibold w-full py-2 px-5 rounded-lg shadow transition"
                        >
                          📸 Ambil Gambar
                        </button>
                      ) : (
                        <button
                          onClick={() => setPreview(null)}
                          className="bg-red-400 text-white font-semibold w-full py-2 px-5 rounded-lg shadow transition"
                        >
                          <span className="flex justify-center">
                            <TrashIcon className="w-5 h-5 mr-2" /> Ambil Ulang
                            Gambar
                          </span>
                        </button>
                      )}

                      <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium w-full px-4 py-2 rounded-lg border cursor-pointer transition justify-center flex">
                        📁 Unggah Gambar
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </>
                  )}
                </div>

                {result && (
                  <div className="w-full bg-green-50 border border-green-200 rounded-2xl p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-green-700">
                      Hasil Prediksi Tanah
                    </h3>
                    <p className="text-gray-700 mt-2">
                      <strong>Tipe Tanah:</strong> {result.label}
                    </p>
                    <p className="text-gray-700">
                      <strong>Ketepatan:</strong>{" "}
                      {(result.confidence * 100).toFixed(2)}%
                    </p>
                    {result.warning && (
                      <p className="text-red-600 font-medium">
                        ⚠️ {result.warning}
                      </p>
                    )}
                    {result.high_confidence && (
                      <p className="text-green-600 font-medium">
                        ✅ {result.high_confidence}
                      </p>
                    )}

                    <p className="mt-3 text-green-800 font-medium">
                      🌱 Tanaman yang cocok:{" "}
                      {result.recommendation.suitable_crops.length === 0
                        ? result.recommendation.reason
                        : ""}
                      {result.recommendation.suitable_crops.map(
                        (crop, index) => (
                          <span key={index}>
                            {crop}
                            {index <
                              result.recommendation.suitable_crops.length - 1 &&
                              ", "}
                          </span>
                        )
                      )}
                    </p>
                    <button
                      className="bg-[#6C7D41] text-white font-semibold w-full py-2 px-5 rounded-lg shadow transition mt-4"
                      onClick={() => {
                        setSoilType(result.label);
                        const centroidPosition =
                          calculateCentroid(polygonPoints);
                        recommendationData(
                          centroidPosition[0],
                          centroidPosition[1]
                        );
                        setOpen(false);
                      }}
                    >
                      Simpan Hasil
                    </button>
                  </div>
                )}

                {isMobile && preview && (
                  <>
                    <button
                      onClick={() => {
                        setPreview(null);
                        setResult(null);
                      }}
                      className="bg-red-400 text-white font-semibold w-full py-2 px-5 rounded-lg shadow transition"
                    >
                      <span className="flex justify-center">
                        <TrashIcon className="w-5 h-5 mr-2" /> Ambil Ulang
                        Gambar
                      </span>
                    </button>
                    <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium w-full px-4 py-2 rounded-lg border cursor-pointer transition justify-center flex">
                      📁 Unggah Gambar
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Canvas;
