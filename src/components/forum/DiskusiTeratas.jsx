import { useState, useEffect, useRef } from "react";
import ItemDiskusiTeratas from "./SubComponents/ItemDiskusiTeratas";

import { getForumTeratas } from "../../hooks/forum/getForum";

const DiskusiTeratas = () => {
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    getForumTeratas().then((data) => setDiscussions(data));
  }, []);

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [isPaginated, setIsPaginated] = useState(false);
  const topRef = useRef(null);

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  const currentItems = discussions.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(discussions.length / itemsPerPage);

  useEffect(() => {
    if (discussions.length === 0) {
      setCurrentPage(0);
      setIsPaginated(false);
    } else if (currentPage === 0) {
      setCurrentPage(1);
    }
  }, [discussions, currentPage, totalPages]);

  useEffect(() => {
    if (isPaginated && topRef.current) {
      const offsetTop = topRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
      setIsPaginated(false);
    }
  }, [isPaginated]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
      setIsPaginated(true);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      setIsPaginated(true);
    }
  };

  return (
    <>
      <h2 ref={topRef} className="text-2xl font-semibold text-[#6C7D41] mb-6">
        Diskusi Teratas
      </h2>
      <div className="space-y-4">
        {discussions.length === 0 && (
          <div className="text-gray-500 text-center bg-gray-100 p-4 rounded-lg">
            Tidak ada diskusi teratas, buat diskusi pertama Anda!
          </div>
        )}
        {currentItems.map((discussion, index) => (
          <ItemDiskusiTeratas key={index} discussion={discussion} />
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ease-in-out ${
            currentPage === 1 || totalPages === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#6C7D41] text-white hover:bg-[#5b6936]"
          } shadow-sm`}
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          Kembali
        </button>
        <span className="text-gray-500 text-sm">
          Halaman {totalPages === 0 ? 0 : currentPage} dari {totalPages}
        </span>
        <button
          className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ease-in-out ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#6C7D41] text-white hover:bg-[#5b6936]"
          } shadow-sm`}
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Selanjutnya
        </button>
      </div>
    </>
  );
};

export default DiskusiTeratas;
