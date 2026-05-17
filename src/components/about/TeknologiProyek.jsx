import React from "react";
import ItemKomponenTeknologi from "./SubComponents/ItemKomponenTeknologi";

const TeknologiProyek = () => {
  return (
    <>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold mb-4">Teknologi Yang Digunakan</h2>
        <p className="text-gray-700 md:w-1/2 mx-auto">
          Proyek ini menggunakan teknologi terkini untuk memberikan solusi
          pertanian yang lebih baik. Dengan memanfaatkan AI dan GIS, kami
          bertujuan untuk memberikan rekomendasi tanaman yang optimal berdasarkan
          data cuaca dan lokasi.
        </p>
      </div>
      <div className="flex flex-wrap gap-8 justify-center">
        {
        [
          "Pembelajaran Mesin",
          "Geographic Information System",
          "Data API BMKG"
        ].map(
          (tech, i) => (
            <ItemKomponenTeknologi key={i} tech={tech} />
          )
        )}
      </div>
    </>
  );
};

export default TeknologiProyek;
