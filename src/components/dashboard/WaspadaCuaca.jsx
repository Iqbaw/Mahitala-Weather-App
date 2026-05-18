import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  Clock,
  MapPin,
  Zap,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";

const WeatherWarningDisplay = () => {
  const [expanded, setExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [warningData, setWarningData] = useState(null);

  useEffect(() => {
    // Weather warning API is currently unavailable
    // Will be re-enabled when a public warning endpoint is available
    setWarningData(null);
  }, []);

  if (!warningData) {
    return null; // Don't render anything if no warnings
  }

  const decodeHtmlEntities = (text) => {
    if (!text) return "";

    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  };

  const cleanText = (html) => {
    if (!html) return "";
    const decoded = decodeHtmlEntities(html);
    const withoutTags = decoded.replace(/<[^>]*>/g, " ");
    const withoutAsterisk = withoutTags.replace(/\*/g, "");
    const cleaned = withoutAsterisk.replace(/\s+/g, " ").trim();

    return cleaned;
  };

  const parseAffectedAreas = () => {
    try {
      if (!warningData.text_waspada) return [];

      const decodedText = decodeHtmlEntities(warningData.text_waspada);
      const cleanedText = decodedText
        .replace(/<[^>]*>/g, " ")
        .replace(/\*/g, "")
        .replace(/dan sekitarnya\.?/gi, "")
        .trim();

      const areas = [];

      const patterns = [
        /Kabupaten Kulon Progo:\s*Kecamatan:\s*([^*]+?)(?=Kabupaten|Kota|$)/gi,
        /Kabupaten Bantul:\s*Kecamatan:\s*([^*]+?)(?=Kabupaten|Kota|$)/gi,
        /Kabupaten Gunungkidul:\s*Kecamatan:\s*([^*]+?)(?=Kabupaten|Kota|$)/gi,
        /Kabupaten Sleman:\s*Kecamatan:\s*([^*]+?)(?=Kabupaten|Kota|$)/gi,
        /Kota Yogyakarta:\s*Kecamatan:\s*([^*]+?)(?=Kabupaten|Kota|$)/gi,
      ];

      const districtNames = [
        "Kabupaten Kulon Progo",
        "Kabupaten Bantul",
        "Kabupaten Gunungkidul",
        "Kabupaten Sleman",
        "Kota Yogyakarta",
      ];

      patterns.forEach((pattern, index) => {
        const matches = [...cleanedText.matchAll(pattern)];
        matches.forEach((match) => {
          if (match[1]) {
            const kecamatanList = match[1].replace(/,\s*$/, "").trim();

            if (kecamatanList) {
              areas.push({
                district: districtNames[index],
                areas: kecamatanList,
              });
            }
          }
        });
      });

      return areas;
    } catch (error) {
      console.error("Error parsing areas:", error);
      return [];
    }
  };

  const affectedAreas = parseAffectedAreas();
  const hazards = [
    "Banjir",
    "Banjir Bandang",
    "Tanah Longsor",
    "Pohon Tumbang",
  ];

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const getCleanWarningText = () => {
    const cleaned = cleanText(warningData.text_warning);
    const mainWarning = cleaned.split("Kabupaten")[0].trim();
    return (
      mainWarning ||
      "Peringatan dini potensi cuaca ekstrem (hujan lebat/sangat lebat/ekstrem yang dapat disertai dengan angin kencang dan kilat/petir)"
    );
  };

  if (warningData){
    const now = new Date();
    const issuedTime = new Date(warningData.issued);
    
    const isExpired = now > issuedTime;

    if (isExpired) {
      return (<></>);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div
        className="bg-[#F4F7F4] text-white px-4 py-4 relative cursor-pointer"
        title="Klik untuk memperluas"
        onClick={toggleExpand}
      >
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <div className="relative w-6 h-6 flex items-center justify-center">
                <span className="absolute w-2 h-2 top-0 right-0 bg-red-400 rounded-full animate-ping" />
                <AlertTriangle
                  size={18}
                  className="text-[#6C7D41] animate-pulse relative z-10"
                />
              </div>
            </div>

            <div>
              <h1 className="font-bold text-green-800 text-sm tracking-wide">
                PERINGATAN CUACA
              </h1>
              <p className="text-xs text-[#6C7D41] opacity-90">
                BMKG Yogyakarta
              </p>
            </div>
          </div>
          <button className="flex items-center text-[#6C7D41] focus:outline-none">
            Klik untuk {expanded ? "Sembunyikan" : "Memperluas"}
          </button>
        </div>
      </div>

      {expanded && (
        <>
          <div className="p-4 space-y-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg">
              <div className="flex items-start gap-2">
                <Zap
                  size={14}
                  className="text-yellow-600 mt-0.5 flex-shrink-0"
                />
                <p className="text-xs text-gray-700 leading-relaxed">
                  {getCleanWarningText()}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-500" />
                <span className="text-xs font-medium text-gray-700">
                  Berlaku:
                </span>
                <span className="text-xs text-gray-600">
                  {formatTime(warningData.valid_start)} -{" "}
                  {formatTime(warningData.valid_end)} WIB
                </span>
              </div>
              <button
                onClick={toggleDetails}
                className="text-xs text-[#6C7D41] flex items-center gap-1"
              >
                <Info size={12} />
                {showDetails ? "Sembunyikan" : "Detail"}
              </button>
            </div>

            {showDetails && (
              <div className="p-3 rounded-lg border border-gray-200">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="font-medium text-gray-500">
                      Nomor Peringatan
                    </p>
                    <p className="text-gray-700 break-all">
                      {warningData.warning_no}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Operator</p>
                    <p className="text-gray-700">{warningData.analisis}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Dikeluarkan</p>
                    <p className="text-gray-700">
                      {formatTime(warningData.issued)} WIB
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Diperbarui</p>
                    <p className="text-gray-700">
                      {new Date(warningData.updated_at).toLocaleString(
                        "id-ID",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-red-100 p-1.5 rounded-full">
                  <MapPin size={12} className="text-red-500" />
                </div>
                <h3 className="font-bold text-sm text-gray-800">
                  Wilayah Terdampak
                </h3>
              </div>
              <div className="space-y-2 text-xs">
                {affectedAreas.map((area, index) => (
                  <div
                    key={index}
                    className="bg-white p-2 rounded border border-gray-200"
                  >
                    <p className="font-semibold text-red-600 mb-1">
                      {area.district}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Kecamatan: {area.areas}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-gray-200 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-red-100 p-1 rounded-full">
                  <AlertTriangle size={12} className="text-red-600" />
                </div>
                <p className="text-xs font-bold text-red-800">
                  WASPADA BENCANA HIDROMETEOROLOGI
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {hazards.map((hazard, index) => (
                  <span
                    key={index}
                    className="bg-white px-2 py-1 rounded text-red-700 text-center font-medium border border-red-100"
                  >
                    {hazard}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherWarningDisplay;
