import React, { useEffect, useState } from "react";
import {
  getDataFieldByUserID,
  deleteDataField,
} from "../../hooks/field_user/dataField";

import { getCropDataById } from "../../hooks/crop/getCropData";
import { API_URL_CLF, capitalizeFirstLetter } from "../../utils/Constants";
import {
  healthAssessmentRules,
  conditionScores,
} from "../../utils/healthAssessmentRules";

import Swal from "sweetalert2";

import { useUser } from "../../utils/userContext";
import axios from "axios";

function DashboardData() {
  const [activeTab, setActiveTab] = useState("lahan");
  const [dataLahan, setDataLahan] = useState([]);
  const [healthCheckData, setHealthCheckData] = useState({
    plant: "padi",
    leafColor: "",
    stemCondition: "",
    leafCondition: [],
    growth: "",
  });
  const [healthResult, setHealthResult] = useState(null);
  const [explainHealth, setExplainHealth] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useUser();

  useEffect(() => {
    if (isAuthenticated) {
      getDataFieldByUserID().then(async (res) => {
        if (res) {
          const dataLahanWithNames = await Promise.all(
            res.map(async (item) => ({
              id: item.id_field,
              nama_lahan: item.nama_lahan,
              nama_tanaman: await getCropName(parseInt(item.id_tanaman)),
              tanggal_tanam: new Date(item.tanggal_tanam).toLocaleDateString(
                "id-ID",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              ),
              estimasi_panen: new Date(item.estimasi_panen).toLocaleDateString(
                "id-ID",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              ),
              luas_lahan: JSON.parse(item.luas_lahan).hectares.toFixed(2),
            }))
          );

          setDataLahan(dataLahanWithNames);
          setTotalPages(Math.ceil(dataLahanWithNames.length / itemsPerPage));
        }
      });
    }
  }, []);

  const getCropName = async (id) => {
    const res = await getCropDataById(id);
    if (res) {
      return res.label;
    }
    return null;
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
            setDataLahan((prev) => prev.filter((item) => item.id !== id));
            setTotalPages(Math.ceil((dataLahan.length - 1) / itemsPerPage));
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

  // Health assessment function using heuristic rules
  const assessHealth = () => {
    const plantType = healthCheckData.plant;
    const rules =
      healthAssessmentRules[plantType] || healthAssessmentRules.padi;

    // Calculate score for leaf color
    const leafColorScore = healthCheckData.leafColor
      ? conditionScores.leafColor[healthCheckData.leafColor] || 0
      : 0;

    // Calculate score for stem condition
    const stemScore = healthCheckData.stemCondition
      ? conditionScores.stemCondition[healthCheckData.stemCondition] || 0
      : 0;

    // Calculate leaf condition score (average if multiple conditions)
    let leafConditionScore = 0;
    if (
      healthCheckData.leafCondition &&
      healthCheckData.leafCondition.length > 0
    ) {
      const totalScore = healthCheckData.leafCondition.reduce(
        (sum, condition) => {
          return sum + (conditionScores.leafCondition[condition] || 0);
        },
        0
      );
      leafConditionScore = totalScore / healthCheckData.leafCondition.length;
    }

    // Calculate growth score
    const growthScore = healthCheckData.growth
      ? conditionScores.growth[healthCheckData.growth] || 0
      : 0;

    // Calculate weighted score
    const weightedScore =
      leafColorScore * rules.leafColorWeight +
      stemScore * rules.stemConditionWeight +
      leafConditionScore * rules.leafConditionWeight +
      growthScore * rules.growthWeight;

    // Determine health status
    let status, suggestions;
    if (weightedScore >= rules.thresholds.good) {
      status = "Sehat";
      suggestions = "Tanaman dalam kondisi baik. Lanjutkan perawatan rutin.";
    } else if (weightedScore >= rules.thresholds.attention) {
      status = "Perlu Perhatian";

      // Generate specific suggestions
      const specificSuggestions = [];

      if (leafColorScore < 0.7) {
        specificSuggestions.push("Periksa kebutuhan nitrogen tanaman Anda.");
      }

      if (stemScore < 0.7) {
        specificSuggestions.push(
          "Pastikan kelembaban tanah dan dukungan batang memadai."
        );
      }

      if (leafConditionScore < 0.7) {
        specificSuggestions.push(
          "Periksa tanda-tanda hama atau penyakit pada daun."
        );
      }

      if (growthScore < 0.7) {
        specificSuggestions.push(
          "Sesuaikan jarak tanam dan kebutuhan nutrisi tanaman."
        );
      }

      suggestions = `Perhatikan: ${specificSuggestions.join(" ")}`;
    } else {
      status = "Masalah Serius";
      suggestions =
        "Tanaman mengalami masalah serius. Disarankan pemeriksaan langsung oleh ahli pertanian.";
    }

    // Return assessment result
    return {
      score: Math.round(weightedScore * 100),
      status,
      suggestions,
    };
  };

  const handleHealthCheck = () => {
    if (
      !healthCheckData.leafColor ||
      !healthCheckData.stemCondition ||
      healthCheckData.leafCondition.length === 0 ||
      !healthCheckData.growth
    ) {
      Swal.fire({
        icon: "error",
        title: "Ada Masalah",
        text: "Mohon lengkapi semua parameter pemeriksaan kesehatan",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    setLoading(true);
    const result = assessHealth();
    const explain_req = axios
      .post(API_URL_CLF+"/api/health-assessment", healthCheckData)
      .then((res) => {
        setLoading(false);
        setHealthResult(result);
        setExplainHealth(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Ada Masalah",
          text: "Terjadi kesalahan saat memeriksa kesehatan tanaman",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  const handleHealthCheckInput = (field, value) => {
    setHealthCheckData((prev) => {
      if (field === "leafCondition") {
        let updatedConditions = [...prev.leafCondition];
        if (updatedConditions.includes(value)) {
          updatedConditions = updatedConditions.filter(
            (item) => item !== value
          );
        } else {
          updatedConditions.push(value);
        }
        return { ...prev, [field]: updatedConditions };
      }
      return { ...prev, [field]: value };
    });
  };

  const Pagination = ({ label }) => (
    <div className="md:flex items-center justify-center md:justify-between mt-4">
      <p className="text-sm justify-center flex md:justify-center text-gray-500">
        {label}
      </p>
      <div className="flex justify-center space-x-2 mt-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md border text-sm ${
            currentPage === 1
              ? "text-gray-400 border-gray-200"
              : "text-gray-600 border-gray-300 hover:bg-gray-100"
          }`}
        >
          Sebelumnya
        </button>
        <span className="hidden md:flex items-center text-sm text-gray-700">
          Halaman {currentPage} dari {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md border text-sm ${
            currentPage === totalPages
              ? "text-gray-400 border-gray-200"
              : "text-gray-600 border-gray-300 hover:bg-gray-100"
          }`}
        >
          Berikutnya
        </button>
      </div>
    </div>
  );

  const itemsPerPage = 2;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLahan = dataLahan.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    if (status === "Sehat") return "text-green-600 bg-[#F4F7F4]";
    if (status === "Perlu perhatian" || status === "Perlu Perhatian")
      return "text-yellow-600 bg-yellow-50";
    if (status === "Masalah Serius") return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-50";
  };

  const getButtonStyle = (field, value) => {
    if (field === "leafCondition") {
      return healthCheckData.leafCondition.includes(value)
        ? "bg-[#6C7D4120] border-[#F4F7F4]"
        : "border-gray-300 hover:bg-[#F4F7F4]";
    }

    return healthCheckData[field] === value
      ? "bg-[#6C7D4120] border-[#F4F7F4]"
      : "border-gray-300 hover:bg-[#F4F7F4]";
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4 bg-[#F4F7F4] rounded-t-2xl">
        <h2 className="text-xl font-semibold text-[#6C7D41]">Dashboard Pengguna</h2>
        <p className="text-sm text-gray-500">
          Kelola data lahan dan kesehatan tanaman Anda dengan mudah.
        </p>
      </div>

      {isAuthenticated ? (
        <>
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("lahan")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "lahan"
                  ? "text-[#6C7D41] border-b-2 border-[#6C7D41]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              🌾 Data Lahan
            </button>
            <button
              onClick={() => {
                setActiveTab("healthCheck");
                setHealthResult(null);
              }}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "healthCheck"
                  ? "text-[#6C7D41] border-b-2 border-[#6C7D41]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              🔍 Cek Kesehatan
            </button>
          </div>

          <div className="p-6 space-y-8">
            {activeTab === "lahan" && (
              <div>
                {dataLahan.length === 0 ? (
                  <div className="flex items-center justify-center text-center h-44">
                    <p className="text-gray-500 text-md">
                      Tidak ada data lahan yang tersedia. Silakan tambahkan
                      lahan
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      {currentLahan.map((lahan, idx) => (
                        <div
                          key={idx}
                          className="border border-gray-200 rounded-xl px-4 py-3 bg-white transition duration-200"
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="text-md font-semibold text-gray-700">
                              {capitalizeFirstLetter(lahan.nama_lahan)}
                            </h4>
                          </div>

                          <div className="block md:flex flex-wrap mt-2">
                            <div className="w-full md:w-1/2 pr-2">
                              <p className="text-sm text-gray-500">
                                Tanaman:{" "}
                                <span className="text-gray-700 font-medium">
                                  {capitalizeFirstLetter(lahan.nama_tanaman)}
                                </span>
                              </p>
                              <p className="text-sm text-gray-500">
                                Tanggal Tanam: {lahan.tanggal_tanam}
                              </p>
                              <p className="text-sm text-gray-500">
                                Estimasi Panen: {lahan.estimasi_panen}
                              </p>
                            </div>
                            <div className="w-full md:w-1/2 md:pl-2 border-l border-gray-100">
                              <p className="text-sm text-gray-500">
                                Luas Lahan: {lahan.luas_lahan} hektar
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-end mt-2">
                            <button
                              className="text-sm bg-red-500 text-white rounded-md px-2 py-1 mr-2 hover:bg-red-600"
                              onClick={() => handleDeleteLahan(lahan.id)}
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Pagination
                      label={`Menampilkan ${currentLahan.length} dari ${dataLahan.length} lahan`}
                    />
                  </>
                )}
              </div>
            )}

            {activeTab === "healthCheck" && (
              <div>
                {!healthResult && !explainHealth ? (
                  // Health check form
                  <>
                    <h4 className="font-medium text-[#6C7D41] mb-3 text-lg">
                      Sistem Pengecekan Tanaman Berbasis Aturan
                    </h4>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pilih tanaman:
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white"
                        value={healthCheckData.plant}
                        onChange={(e) =>
                          handleHealthCheckInput("plant", e.target.value)
                        }
                      >
                        {healthAssessmentRules &&
                          Object.keys(healthAssessmentRules).map((crop) => (
                            <option key={crop} value={crop}>
                              {capitalizeFirstLetter(crop)}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="space-y-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Warna daun:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          <button
                            className={`px-3 py-1 border rounded-md text-sm ${getButtonStyle("leafColor", "hijau-tua")}`}
                            onClick={() =>
                              handleHealthCheckInput("leafColor", "hijau-tua")
                            }
                          >
                            Hijau tua
                          </button>
                          <button
                            className={`px-3 py-1 border rounded-md text-sm ${getButtonStyle("leafColor", "hijau-muda")}`}
                            onClick={() =>
                              handleHealthCheckInput("leafColor", "hijau-muda")
                            }
                          >
                            Hijau muda
                          </button>
                          <button
                            className={`px-3 py-1 border rounded-md text-sm ${getButtonStyle("leafColor", "kekuningan")}`}
                            onClick={() =>
                              handleHealthCheckInput("leafColor", "kekuningan")
                            }
                          >
                            Kekuningan
                          </button>
                          <button
                            className={`px-3 py-1 border rounded-md text-sm ${getButtonStyle("leafColor", "kecoklatan")}`}
                            onClick={() =>
                              handleHealthCheckInput("leafColor", "kecoklatan")
                            }
                          >
                            Kecoklatan
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kondisi batang:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          <button
                            className={`px-3 py-1 border rounded-md text-sm ${getButtonStyle("stemCondition", "tegak-kuat")}`}
                            onClick={() =>
                              handleHealthCheckInput(
                                "stemCondition",
                                "tegak-kuat"
                              )
                            }
                          >
                            Tegak kuat
                          </button>
                          <button
                            className={`px-3 py-1 border rounded-md text-sm ${getButtonStyle("stemCondition", "sedikit-lemah")}`}
                            onClick={() =>
                              handleHealthCheckInput(
                                "stemCondition",
                                "sedikit-lemah"
                              )
                            }
                          >
                            Sedikit lemah
                          </button>
                          <button
                            className={`px-3 py-1 border rounded-md text-sm ${getButtonStyle("stemCondition", "rebah")}`}
                            onClick={() =>
                              handleHealthCheckInput("stemCondition", "rebah")
                            }
                          >
                            Rebah
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kondisi daun:{" "}
                          <span className="text-xs text-gray-500">
                            (bisa pilih beberapa)
                          </span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          <button
                            className={`px-3 py-1 border rounded-md text-sm ${getButtonStyle("leafCondition", "normal")}`}
                            onClick={() =>
                              handleHealthCheckInput("leafCondition", "normal")
                            }
                          >
                            Normal
                          </button>
                          <button
                            className={`px-3 py-1 border rounded-md text-sm ${getButtonStyle("leafCondition", "berbintik")}`}
                            onClick={() =>
                              handleHealthCheckInput(
                                "leafCondition",
                                "berbintik"
                              )
                            }
                          >
                            Berbintik
                          </button>
                          <button
                            className={`px-3 py-1 border rounded-md text-sm ${getButtonStyle("leafCondition", "berlubang")}`}
                            onClick={() =>
                              handleHealthCheckInput(
                                "leafCondition",
                                "berlubang"
                              )
                            }
                          >
                            Berlubang
                          </button>
                          <button
                            className={`px-3 py-1 border rounded-md text-sm ${getButtonStyle("leafCondition", "keriting")}`}
                            onClick={() =>
                              handleHealthCheckInput(
                                "leafCondition",
                                "keriting"
                              )
                            }
                          >
                            Keriting
                          </button>
                          <button
                            className={`px-3 py-1 border rounded-md text-sm ${getButtonStyle("leafCondition", "ujung-kering")}`}
                            onClick={() =>
                              handleHealthCheckInput(
                                "leafCondition",
                                "ujung-kering"
                              )
                            }
                          >
                            Ujung kering
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pertumbuhan:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          <button
                            className={`px-3 py-1 border rounded-md text-sm ${getButtonStyle("growth", "merata")}`}
                            onClick={() =>
                              handleHealthCheckInput("growth", "merata")
                            }
                          >
                            Merata
                          </button>
                          <button
                            className={`px-3 py-1 border rounded-md text-sm ${getButtonStyle("growth", "tidak-merata")}`}
                            onClick={() =>
                              handleHealthCheckInput("growth", "tidak-merata")
                            }
                          >
                            Tidak merata
                          </button>
                          <button
                            className={`px-3 py-1 border rounded-md text-sm ${getButtonStyle("growth", "terhambat")}`}
                            onClick={() =>
                              handleHealthCheckInput("growth", "terhambat")
                            }
                          >
                            Terhambat
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleHealthCheck}
                      className={`w-full mt-4 px-4 py-3 text-white rounded-md hover:bg-opacity-90 ${
                        loading
                          ? "cursor-not-allowed bg-gray-400"
                          : "bg-[#6C7D41] cursor-pointer"
                      }`}
                      disabled={loading}
                    >
                      {loading ? "Memeriksa..." : "Periksa Kesehatan"}
                    </button>
                  </>
                ) : (
                  // Display health check result
                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-medium text-[#6C7D41] mb-3">
                      Hasil Pemeriksaan Kesehatan
                    </h4>
                    <p className="text-sm mb-2">
                      Skor Kesehatan: {healthResult.score}%
                    </p>
                    <p
                      className={`text-sm font-semibold ${getStatusColor(healthResult.status)}`}
                    >
                      Status: {healthResult.status}
                    </p>
                    {explainHealth && (
                      <p
                        className="mt-2 text-sm text-gray-700"
                        dangerouslySetInnerHTML={{
                          __html: explainHealth.response,
                        }}
                      ></p>
                    )}
                    <button
                      onClick={() => {
                        setHealthResult(null);
                        setExplainHealth(null);
                      }}
                      className="mt-4 px-4 py-2 bg-[#6C7D41] text-white rounded-md hover:bg-opacity-90"
                    >
                      Kembali
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center text-center h-52">
          <p className="text-gray-500 text-md">
            Silakan masuk untuk mengakses data lahan dan kesehatan tanaman Anda.
          </p>
        </div>
      )}
    </div>
  );
}

export default DashboardData;
