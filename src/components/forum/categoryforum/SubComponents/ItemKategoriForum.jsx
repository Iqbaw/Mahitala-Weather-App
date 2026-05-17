import React from "react";
import { Link } from "react-router-dom";

const ItemKategoriForum = ({ category }) => {
  return (
    <Link
      to={`/forum/kategori/${category.id_kategori}`}
      className="relative flex items-end h-48 rounded-lg overflow-hidden bg-cover bg-center group transition-all"
      style={{ backgroundImage: `url(${category.gambar})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 group-hover:opacity-90 group-hover:from-[#6C7D41] transition-opacity duration-700 ease-out" />
      <div className="absolute bottom-4 left-4 right-4 flex flex-col items-center transition-transform duration-700 ease-out group-hover:scale-110 group-hover:transform-gpu">
        <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-500 group-hover:scale-125 group-hover:translate-y-[-10px] ease-in-out group-hover:ease-bounce">
          <h2 className="text-center text-sm font-semibold text-[#6C7D41] px-2">
            {category.nama_kategori}
          </h2>
        </div>
        <p className="mt-2 text-xs text-gray-300 opacity-90 group-hover:text-white group-hover:opacity-100 transition-opacity duration-300">
          {category.jumlah_diskusi} Diskusi
        </p>
      </div>
      <div className="absolute inset-0 transform scale-100 group-hover:scale-110 transition-transform duration-500 ease-out" />
    </Link>
  );
};

export default ItemKategoriForum;
