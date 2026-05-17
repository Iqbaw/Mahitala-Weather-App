import React from "react";

const TujuanProyek = () => {
  return (
    <>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold mb-4">Pengembangan Proyek</h2>
        <p className="text-gray-700">
          Menggunakan AI dengan integrasi data GIS dan API BMKG untuk memberikan rekomendasi tanaman yang optimal berdasarkan cuaca dan lokasi.
        </p>
      </div>
      <div className="flex flex-wrap gap-8 justify-center">
        <div className="w-full md:w-1/4 bg-white rounded-lg p-8 border border-gray-200">
          <h3 className="text-xl font-semibold mb-2">Tujuan Proyek</h3>
          <p className="text-gray-700">
            Proyek ini bertujuan untuk memberdayakan petani dengan wawasan
            berbasis data mengenai pola cuaca dan kecocokan tanaman untuk
            mengoptimalkan hasil panen.
          </p>
        </div>
        <div className="w-full md:w-1/4 bg-white rounded-lg p-8 border border-gray-200">
          <h3 className="text-xl font-semibold mb-2">
            Teknologi yang Digunakan
          </h3>
          <p className="text-gray-700">
            Memanfaatkan teknologi AI untuk analisis data cuaca dan GIS untuk
            visualisasi data geospasial, memungkinkan petani untuk membuat keputusan
            yang lebih baik.
          </p>
        </div>
        <div className="w-full md:w-1/4 bg-white rounded-lg p-8 border border-gray-200">
          <h3 className="text-xl font-semibold mb-2">
            Dampak pada Keberlanjutan
          </h3>
          <p className="text-gray-700">
            Dengan memberikan rekomendasi tanaman yang tepat, proyek ini
            bertujuan untuk meningkatkan keberlanjutan pertanian, mengurangi
            limbah, dan meningkatkan ketahanan pangan.
          </p>
        </div>
      </div>
    </>
  );
};

export default TujuanProyek;
