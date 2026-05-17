import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getKategoriBest } from "../../hooks/forum/kategori/getKategori";

import ItemKategori from "./SubComponents/ItemKategori";

const KategoriPopuler = () => {
  const [kategori, setKategori] = useState([]);

  useEffect(() => {
    getKategoriBest().then((res) => {
      setKategori(res);
    });
  }, []);

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#6C7D41] mb-5">Kategori Populer</h2>
        <Link to="/forum/kategori" className="text-[#6C7D41] font-semibold hover:text-[#5b6936] transition-all duration-300">Lihat Semua</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {kategori.map((item, index) => (
          <ItemKategori key={index} item={item} />
        ))}
      </div>
    </>
  );
};

export default KategoriPopuler;
