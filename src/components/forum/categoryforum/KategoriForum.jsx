import React, { useEffect, useState } from "react";
import ItemKategoriForum from "./SubComponents/ItemKategoriForum";
import { getKategori } from "../../../hooks/forum/kategori/getKategori";

const KategoriForum = ({ searchTerm }) => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getKategori().then((data) => setCategories(data));
  }, []);

  const itemsPerPage = 8;

  const filteredCategories = categories.filter((category) =>
    category.nama_kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const displayedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => setCurrentPage(page);
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedCategories.length === 0 ? (
          <>
            <div className="flex items-center justify-center h-64 col-span-full">
              <p className="text-gray-500 text-lg">Kategori tidak ditemukan.</p>
            </div>
          </>
        ) : (
          displayedCategories.map((category) => (
            <ItemKategoriForum key={category.id_kategori} category={category} />
          ))
        )}
      </div>
      <div className="flex justify-center items-center mt-8 space-x-2">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => goToPage(index + 1)}
            className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? "bg-[#6C7D41] text-white" : "bg-gray-200 text-gray-700"} hover:bg-[#6C7D41] hover:text-white transition-all`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default KategoriForum;
