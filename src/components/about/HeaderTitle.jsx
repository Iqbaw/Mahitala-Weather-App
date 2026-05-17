import React from "react";

const HeaderTitle = () => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
      <h1 className="text-xl md:text-4xl text-center font-bold text-white mb-2">
        Menciptakan Solusi Pertanian Berkelanjutan
      </h1>
      <p className="text-sm md:text-xl text-center text-gray-300">
        Prediksi Cuaca Berbasis AI Untuk Menentukan Rekomendasi Tanaman dan Juga Teknologi GIS Untuk Melihat Data Ilmiah
      </p>
    </div>
  );
};

export default HeaderTitle;
