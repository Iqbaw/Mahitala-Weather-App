import React from "react";
import { FaChevronLeft, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HeadKategori = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => navigate(-1)}
        className="flex justify-center items-center text-[#6C7D41] text-2xl font-semibold hover:text-[#4A5A2C] transition-colors mb-5"
      >
        <FaChevronLeft className="mr-2" />
        Kategori Diskusi
      </button>
      <div className="w-full md:w-1/3 flex items-center px-4 py-2 transition-all duration-300 rounded-lg bg-gray-200 focus-within:bg-gray-300 mb-6">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Cari diskusi"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-4 text-gray-700 w-full focus:outline-none bg-transparent"
        />
      </div>
    </>
  );
};

export default HeadKategori;
