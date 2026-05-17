import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import ItemDiskusiTerakhir from "./SubComponents/ItemDiskusiTerakhir";
import { Link } from "react-router-dom";
import { getForumTerakhir } from "../../../hooks/forum/getForum";
import { getKategori } from "../../../hooks/forum/kategori/getKategori";

const DiskusiTerakhir = () => {
  const [ discussions, setDiscussions ] = useState([]);
  const [ kategori, setKategori ] = useState([]);

  useEffect(() => {
    getForumTerakhir().then((data) => {
      if (data === "401" || data === "404") {
        setError(data);
      } else {
        setDiscussions(data);
      }
    });
  }, []);

  useEffect(() => {
    getKategori().then((data) => {
      setKategori(data);
    });
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [itemsPerPage] = useState(6);

  const filteredDiscussions = discussions.filter((discussion) => {
    const matchesSearch =
      discussion.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" || discussion.kategori.nama === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDiscussions = filteredDiscussions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredDiscussions.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <main className="container px-6 mx-auto my-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center md:w-1/3 px-4 py-2 transition-all duration-300 rounded-lg bg-gray-200 focus-within:bg-gray-300">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Cari Judul atau Pengguna"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 text-gray-700 w-full focus:outline-none bg-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-1/3 md:w-1/6 px-3 py-2 ml-2 border border-gray-300 rounded-lg focus:outline-none"
        >
          <option value="Semua">Semua Kategori</option>
          {
            kategori.map((item) => (
              <option key={item.id_kategori} value={item.nama}>{item.nama}</option>
            ))
          }
        </select>
      </div>

      {currentDiscussions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {currentDiscussions.map((discussion) => (
            <ItemDiskusiTerakhir key={discussion.id_diskusi} discussion={discussion} setDiscussion={setDiscussions} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-32 text-gray-600">
          <p className="text-lg font-semibold">
            Tidak ada diskusi yang ditemukan!
          </p>
          <p className="text-sm text-gray-500 mb-4 text-center">
            Mulailah diskusi baru dan bagikan pemikiran Anda.
          </p>
          <Link
            to={"/forum/buat-diskusi"}
            className="px-4 py-2 bg-[#6C7D41] text-white font-semibold rounded-lg hover:bg-[#5B6B34]"
          >
            Mulai Diskusi Baru
          </Link>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? "bg-[#6C7D41] text-white" : "bg-gray-200 text-gray-600"} focus:outline-none`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {currentDiscussions.length > 0 && (
        <div className="mt-8 py-6 bg-[#6C7D41] text-white rounded-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">
            Ingin Mulai Diskusi Baru?
          </h3>
          <p className="text-center text-sm mb-4">
            Bagikan pemikiran Anda dengan komunitas kami!
          </p>
          <Link
            to={"/forum/buat-diskusi"}
            className="px-4 py-2 bg-white text-[#6C7D41] font-semibold rounded-lg hover:bg-gray-100"
          >
            Mulai Diskusi Baru
          </Link>
        </div>
      )}
    </main>
  );
};

export default DiskusiTerakhir;
