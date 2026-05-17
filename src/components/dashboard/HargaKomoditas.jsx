import React, { useEffect, useState } from "react";
import { formatCurrency, formatNumber } from "../../utils/Constants";
import { Loader2Icon } from "lucide-react";

const HargaKomoditas = ({ dataHargaKomoditas }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (dataHargaKomoditas) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [dataHargaKomoditas]);

  const lengthDataHargaKomoditas = dataHargaKomoditas
    ? dataHargaKomoditas.length
    : 0;

  const [itemsPerView, setItemsPerView] = useState(4);

  const totalSlides = Math.ceil(lengthDataHargaKomoditas / itemsPerView);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isPaused || !lengthDataHargaKomoditas) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, lengthDataHargaKomoditas, totalSlides]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 p-4 bg-[#F4F7F4] rounded-t-xl">
        <h2 className="text-lg font-medium text-[#6C7D41]">
          Harga Komoditas Produsen
        </h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2Icon className="w-8 h-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Memuat data...</span>
        </div>
      ) : lengthDataHargaKomoditas === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Data harga komoditas tidak tersedia</p>
        </div>
      ) : null}

      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div
                key={slideIndex}
                className="w-full flex-shrink-0 px-4 pb-4 mt-4"
              >
                <div
                  className={`grid gap-3 ${
                    itemsPerView === 1
                      ? "grid-cols-1"
                      : itemsPerView === 2
                        ? "grid-cols-2"
                        : itemsPerView === 3
                          ? "grid-cols-3"
                          : "grid-cols-4"
                  }`}
                >
                  {dataHargaKomoditas
                    .slice(
                      slideIndex * itemsPerView,
                      (slideIndex + 1) * itemsPerView
                    )
                    .map((item, i) => {
                      const isPositive =
                        item.gap_color === "green" || item.gap_change === "↑";
                      const isNeutral =
                        item.gap_color === "blue" || item.gap_change === "-";
                      const isNegative =
                        item.gap_color === "red" || item.gap_change === "↓";

                      const bgAccent = isPositive
                        ? "bg-emerald-50"
                        : isNegative
                          ? "bg-red-50"
                          : isNeutral
                            ? "bg-blue-50"
                            : "bg-gray-50";
                      const textAccent = isPositive
                        ? "text-emerald-700"
                        : isNegative
                          ? "text-red-700"
                          : isNeutral
                            ? "text-blue-700"
                            : "text-gray-700";
                      const badgeBg = isPositive
                        ? "bg-emerald-500"
                        : isNegative
                          ? "bg-red-500"
                          : isNeutral
                            ? "bg-blue-500"
                            : "bg-gray-400";

                      return (
                        <div
                          key={`${slideIndex}-${i}`}
                          className="bg-white rounded-lg border-2 p-3 transition-shadow duration-200"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex-1">
                              <h3
                                className="text-sm font-semibold text-gray-800 line-clamp-1"
                                title={item.nama}
                              >
                                {item.nama}
                              </h3>
                              <p className="text-xs text-gray-500">
                                per {item.satuan}
                              </p>
                            </div>
                          </div>

                          <div className={`rounded-lg ${bgAccent} p-2 mb-2`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-600">
                                  Harga Hari Ini
                                </p>
                                <p
                                  className={`text-lg font-bold ${textAccent}`}
                                >
                                  {item.satuan && item.hari_ini
                                    ? item.satuan
                                        .toLowerCase()
                                        .includes("rp") ||
                                      item.hari_ini.toString().includes("Rp")
                                      ? formatCurrency(item.hari_ini)
                                      : formatNumber(item.hari_ini)
                                    : "Data tidak tersedia"}
                                </p>
                              </div>

                              <div
                                className={`${badgeBg} text-white rounded-full p-2`}
                              >
                                {isPositive ? (
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                                    />
                                  </svg>
                                ) : isNegative ? (
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                    />
                                  </svg>
                                ) : isNeutral ? (
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M20 12H4"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      cx="12"
                                      cy="12"
                                      r="1"
                                      fill="currentColor"
                                    />
                                  </svg>
                                )}
                              </div>
                            </div>

                            <div className="mt-1">
                              <span
                                className={`text-xs font-bold ${textAccent}`}
                              >
                                {item.gap_change === "↑" ? "+" : ""}
                                {item.gap_persen}%
                              </span>
                              <span className="text-xs text-gray-600 ml-1">
                                dari kemarin
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-1 text-xs">
                            <div className="bg-gray-50 rounded p-1.5">
                              <p className="text-gray-500 text-xs">Kemarin</p>
                              <p className="font-semibold text-gray-700">
                                {item.satuan && item.kemarin
                                  ? item.satuan.toLowerCase().includes("rp") ||
                                    item.kemarin.toString().includes("Rp")
                                    ? formatCurrency(item.kemarin)
                                    : formatNumber(item.kemarin)
                                  : "Data tidak tersedia"}
                              </p>
                            </div>
                            <div className={`${bgAccent} rounded p-1.5`}>
                              <p className="text-gray-500 text-xs">Selisih</p>
                              <p className={`font-semibold ${textAccent}`}>
                                Rp. {item.gap > 0 ? "+" : ""}{" "}
                                {formatNumber(item.gap)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {totalSlides > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:shadow-xl transition-all"
              aria-label="Previous items"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:shadow-xl transition-all"
              aria-label="Next items"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {totalSlides > 1 && (
          <div className="flex justify-center gap-2 pb-4">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === currentIndex
                    ? "bg-[#6C7D41] w-8 h-2"
                    : "bg-gray-300 w-2 h-2 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-4 text-xs text-gray-500 bg-gray-50 rounded-b-xl">
        <p>
          Data harga komoditas ini diperoleh dari Badan Pangan Nasional (BPN)
          dan diperbarui setiap hari.
        </p>
      </div>
    </div>
  );
};

export default HargaKomoditas;
