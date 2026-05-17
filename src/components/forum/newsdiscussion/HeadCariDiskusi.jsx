import React from "react";
import { FaChevronLeft, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HeadCariDiskusi = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  return (
    <>
      <button
        onClick={() => navigate(-1)}
        className="flex justify-center text-start items-center text-[#6C7D41] text-2xl font-semibold hover:text-[#4A5A2C] transition-colors mb-5"
      >
        <FaChevronLeft className="hidden md:flex mr-2" />
        Diskusi Terbaru
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex flex-col md:flex-row gap-6 mb-8 items-center justify-between lg:col-span-2">
          <div className="relative w-full md:w-1/2">
            <div className="flex items-center px-4 py-2 transition-all duration-300 rounded-lg bg-gray-200 focus-within:bg-gray-300">
              <FaSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Cari diskusi"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 text-gray-700 w-full focus:outline-none bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeadCariDiskusi;
