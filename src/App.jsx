import React, { useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ForecastDashboard from "./pages/ForecastDashboard";
import About from "./pages/About";
import ForumDiskusi from "./pages/forum/ForumDiskusiLayout";
import BuatDiskusi from "./pages/forum/creatediscussion/BuatDiskusiLayout";
import DetailDiskusi from "./pages/forum/detaildiscussion/DetailDiskusiLayout";
import KategoriDiskusi from "./pages/forum/categoryforum/KategoriLayout";
import DetailKategori from "./pages/forum/categoryforum/detailcategory/DetailKategoriLayout";
import DiskusiTerbaruLayout from "./pages/forum/newsdiscussion/DiskusiTerbaruLayout";
import CariDiskusiLayout from "./pages/forum/finddiscussion/CariDiskusiLayout";
import Peta from "./pages/Peta";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { UserProvider } from "./utils/userContext";
import ProtectedRoute from "./utils/middleware";
import {
  requestPermissionAndRegisterToken,
  onMessageListener,
} from "./utils/firebase";
import PwaHandler from "./PwaHandler";
import DiskusiTerakhir from "./components/forum/lastdiscussion/DiskusiTerakhir";

const routesMeta = {
  "/": {
    title: "Mahitala - Agrikultur Berbasis Teknologi",
    description:
      "Mahitala adalah aplikasi penyedia solusi agrikultur berbasis teknologi yang membantu petani dalam perencanaan dan pengelolaan pertanian. Aplikasi ini menawarkan fitur seperti prediksi cuaca akurat, rekomendasi tanaman berbasis AI, serta analisis data pertanian untuk meningkatkan produktivitas dan efisiensi.",
    keywords:
      "Mahitala, aplikasi agrikultur, teknologi pertanian, prediksi cuaca, rekomendasi tanaman, AI untuk pertanian, analisis data pertanian, efisiensi pertanian, solusi agrikultur, produktivitas pertanian, inovasi teknologi pertanian, Infinite Learning, IL, Mahitala IL",
  },
  "/peta": {
    title: "Mahitala - Peta Interaktif",
    description:
      "Peta interaktif Mahitala adalah fitur yang memungkinkan pengguna untuk melihat informasi cuaca dan tanaman di lokasi mereka. Dengan peta ini, pengguna dapat mengetahui kondisi cuaca saat ini, prediksi cuaca, serta rekomendasi tanaman yang cocok untuk ditanam di lokasi mereka.",
    keywords:
      "Mahitala Peta Interaktif, peta cuaca, peta tanaman, peta pertanian, peta agrikultur, peta interaktif, peta lokasi, peta prediksi cuaca, peta rekomendasi tanaman, peta informasi pertanian, peta petani, peta agrikultur Indonesia",
  },
  "/tentang-kami": {
    title: "Mahitala - Tentang Kami",
    description:
      "Mahitala adalah aplikasi penyedia solusi agrikultur berbasis teknologi yang membantu petani dalam perencanaan dan pengelolaan pertanian. Aplikasi ini menawarkan fitur seperti prediksi cuaca akurat, rekomendasi tanaman berbasis AI, serta analisis data pertanian untuk meningkatkan produktivitas dan efisiensi.",
    keywords:
      "Mahitala, aplikasi agrikultur, teknologi pertanian, prediksi cuaca, rekomendasi tanaman, AI untuk pertanian, analisis data pertanian, efisiensi pertanian, solusi agrikultur, produktivitas pertanian, inovasi teknologi pertanian, Infinite Learning, IL, Mahitala IL",
  },
  "/forum": {
    title: "Mahitala - Forum Diskusi",
    description:
      "Forum diskusi Mahitala adalah tempat berbagi informasi, pengalaman, dan pengetahuan seputar pertanian. Bergabunglah dengan komunitas petani dan ahli pertanian lainnya untuk mendiskusikan topik-topik menarik seputar dunia pertanian.",
    keywords:
      "Mahitala Forum Diskusi, forum diskusi pertanian, komunitas petani, diskusi pertanian, informasi pertanian, pengetahuan pertanian, pertanian Indonesia, komunitas pertanian, diskusi tanaman, diskusi hama, diskusi penyakit tanaman, diskusi teknologi pertanian",
  },
  "/forum/buat-diskusi": {
    title: "Mahitala - Buat Diskusi",
    description:
      "Buat diskusi di forum Mahitala untuk berbagi informasi, pengalaman, dan pengetahuan seputar pertanian. Ajak komunitas petani dan ahli pertanian lainnya untuk berdiskusi tentang topik-topik menarik.",
    keywords:
      "Mahitala Buat Diskusi, forum diskusi pertanian, buat diskusi pertanian, komunitas petani, diskusi pertanian, informasi pertanian, pengetahuan pertanian, pertanian Indonesia, komunitas pertanian, diskusi tanaman, diskusi hama, diskusi penyakit tanaman, diskusi teknologi pertanian",
  },
  "/forum/diskusi-terakhir": {
    title: "Mahitala - Diskusi Terakhir",
    description:
      "Lihat diskusi terakhir di forum Mahitala untuk mendapatkan informasi terbaru seputar pertanian. Diskusi ini mencakup berbagai topik menarik yang dibahas oleh komunitas petani dan ahli pertanian.",
    keywords:
      "Mahitala Diskusi Terakhir, forum diskusi pertanian, diskusi terakhir pertanian, komunitas petani, diskusi pertanian, informasi pertanian, pengetahuan pertanian, pertanian Indonesia, komunitas pertanian, diskusi tanaman, diskusi hama, diskusi penyakit tanaman, diskusi teknologi pertanian",
  },
  "/forum/diskusi/:id": {
    title: "Mahitala - Detail Diskusi",
    description:
      "Lihat detail diskusi di forum Mahitala untuk mendapatkan informasi lengkap seputar topik yang dibahas. Diskusi ini mencakup berbagai pertanyaan, jawaban, dan komentar dari komunitas petani dan ahli pertanian.",
    keywords:
      "Mahitala Detail Diskusi, forum diskusi pertanian, detail diskusi pertanian, komunitas petani, diskusi pertanian, informasi pertanian, pengetahuan pertanian, pertanian Indonesia, komunitas pertanian, diskusi tanaman, diskusi hama, diskusi penyakit tanaman, diskusi teknologi pertanian",
  },
  "/forum/kategori": {
    title: "Mahitala - Kategori Diskusi",
    description:
      "Lihat kategori diskusi di forum Mahitala untuk menemukan topik-topik menarik seputar pertanian. Kategori ini mencakup berbagai diskusi yang dibahas oleh komunitas petani dan ahli pertanian.",
    keywords:
      "Mahitala Kategori Diskusi, forum diskusi pertanian, kategori diskusi pertanian, komunitas petani, diskusi pertanian, informasi pertanian, pengetahuan pertanian, pertanian Indonesia, komunitas pertanian, diskusi tanaman, diskusi hama, diskusi penyakit tanaman, diskusi teknologi pertanian",
  },
  "/forum/kategori/:id": {
    title: "Mahitala - Detail Kategori",
    description:
      "Lihat detail kategori diskusi di forum Mahitala untuk menemukan topik-topik menarik seputar pertanian. Kategori ini mencakup berbagai diskusi yang dibahas oleh komunitas petani dan ahli pertanian.",
    keywords:
      "Mahitala Detail Kategori, forum diskusi pertanian, detail kategori diskusi pertanian, komunitas petani, diskusi pertanian, informasi pertanian, pengetahuan pertanian, pertanian Indonesia, komunitas pertanian, diskusi tanaman, diskusi hama, diskusi penyakit tanaman, diskusi teknologi pertanian",
  },
  "/forum/diskusi-terbaru": {
    title: "Mahitala - Diskusi Terbaru",
    description:
      "Lihat diskusi terbaru di forum Mahitala untuk mendapatkan informasi terbaru seputar pertanian. Diskusi ini mencakup berbagai topik menarik yang dibahas oleh komunitas petani dan ahli pertanian.",
    keywords:
      "Mahitala Diskusi Terbaru, forum diskusi pertanian, diskusi terbaru pertanian, komunitas petani, diskusi pertanian, informasi pertanian, pengetahuan pertanian, pertanian Indonesia, komunitas pertanian, diskusi tanaman, diskusi hama, diskusi penyakit tanaman, diskusi teknologi pertanian",
  },
  "/forum/cari/:keyword": {
    title: "Mahitala - Cari Diskusi",
    description:
      "Cari diskusi di forum Mahitala untuk menemukan topik-topik menarik seputar pertanian. Gunakan fitur pencarian untuk menemukan diskusi yang relevan dengan minat Anda.",
    keywords:
      "Mahitala Cari Diskusi, forum diskusi pertanian, cari diskusi pertanian, komunitas petani, diskusi pertanian, informasi pertanian, pengetahuan pertanian, pertanian Indonesia, komunitas pertanian, diskusi tanaman, diskusi hama, diskusi penyakit tanaman, diskusi teknologi pertanian",
  },
};

const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

const PageWrapper = ({ children, routePath }) => {
  const meta = routesMeta[routePath];
  return (
    <>
      {meta && (
        <Helmet>
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
          <meta name="keywords" content={meta.keywords} />
        </Helmet>
      )}
      <main className="flex-grow">{children}</main>
    </>
  );
};

function App() {
  useEffect(() => {
    requestPermissionAndRegisterToken();

    const unsubscribe = onMessageListener().then((payload) => {
      console.log("Message received. ", payload);
      const { title, body } = payload.notification;

      toast.info(
        <div
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            padding: "4px 0",
          }}
        >
          <div
            style={{
              fontWeight: "600",
              fontSize: "15px",
              color: "#111827",
              marginBottom: "6px",
              lineHeight: "1.3",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#4b5563",
              lineHeight: "1.4",
            }}
          >
            {body}
          </div>
        </div>,
        {
          style: {
            background: "#ffffff",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            padding: "12px 16px",
          },
          progressStyle: {
            background: "#3b82f6",
          },
        }
      );
    });

    return () => {
      unsubscribe.then((unsub) => unsub()).catch((err) => console.error(err));
    };
  }, []);

  return (
    <HelmetProvider>
      <UserProvider>
        <div className="flex flex-col min-h-screen">
          <Routes>
            <Route element={<MainLayout />}>
              <Route
                path="/tentang-kami"
                element={
                  <PageWrapper routePath="/tentang-kami">
                    <About />
                  </PageWrapper>
                }
              />
              <Route
                path="/forum"
                element={
                  <PageWrapper routePath="/forum">
                    <ForumDiskusi />
                  </PageWrapper>
                }
              />
              <Route
                path="/forum/buat-diskusi"
                element={
                  <ProtectedRoute>
                    <BuatDiskusi />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/forum/diskusi-terakhir"
                element={
                  <ProtectedRoute>
                    <DiskusiTerakhir />
                  </ProtectedRoute>
                }
              />
              <Route path="/forum/diskusi/:id" element={<DetailDiskusi />} />
              <Route path="/forum/kategori" element={<KategoriDiskusi />} />
              <Route path="/forum/kategori/:id" element={<DetailKategori />} />
              <Route
                path="/forum/diskusi-terbaru"
                element={<DiskusiTerbaruLayout />}
              />
              <Route
                path="/forum/cari/:keyword"
                element={<CariDiskusiLayout />}
              />
            </Route>

            <Route
              path="/"
              element={
                <PageWrapper routePath="/">
                  <ForecastDashboard />
                </PageWrapper>
              }
            />
            <Route
              path="/peta"
              element={
                <PageWrapper routePath="/peta">
                  <Peta />
                </PageWrapper>
              }
            />
          </Routes>
        </div>

        <PwaHandler />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
        />
      </UserProvider>
    </HelmetProvider>
  );
}

export default App;
