import React from "react";
import { Link } from "react-router-dom";
import NonImage from "../../../assets/Images/nonimage.jpg";

const ItemKategori = ({ item }) => {
  return (
    <Link
      to={`/forum/kategori/${item.id_kategori}`}
      className="relative bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <img
        src={item.gambar ? 
          item.gambar : 
          NonImage}
        alt={item.nama}
        className="w-full h-60 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
      <div className="absolute bottom-4 left-4 text-white">
        <h2 className="text-lg font-semibold">{item.nama_kategori}</h2>
        <p className="text-sm">
          {item.jumlah_digunakan} Diskusi
        </p>
      </div>
    </Link>
  );
};

export default ItemKategori;
