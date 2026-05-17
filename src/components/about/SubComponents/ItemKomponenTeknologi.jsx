import React from "react";

const ItemKomponenTeknologi = ({ tech }) => {
  return (
    <div
      key={tech}
      className="w-96 bg-white rounded-lg p-6 text-center border border-gray-200"
    >
      <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
        {tech === "Pembelajaran Mesin" ? (
          <img
            src="https://img.icons8.com/color/96/000000/artificial-intelligence.png"
            alt="AI"
          />
        ) : tech === "Data API BMKG" ? (
          <img
            src="https://img.icons8.com/color/96/000000/cloud.png"
            alt="Weather API"
          />
        ) : (
          tech === "Geographic Information System" && (
            <img
              src="https://img.icons8.com/color/96/000000/data-configuration.png"
              alt="Data Analysis"
            />
          )
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{tech}</h3>
      <p className="text-gray-600">Komponen Utama</p>
    </div>
  );
};

export default ItemKomponenTeknologi;
