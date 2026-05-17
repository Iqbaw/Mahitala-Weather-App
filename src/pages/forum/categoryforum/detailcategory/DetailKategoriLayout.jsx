import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import HeadDetailKategori from "../../../../components/forum/categoryforum/detailcategory/HeadDetailKategori";
import ListKategoriTerkait from "../../../../components/forum/categoryforum/detailcategory/ListKategoriTerkait";
import DiskusiTrending from "../../../../components/forum/categoryforum/detailcategory/DiskusiTrending";
import PaginationKategori from "../../../../components/forum/categoryforum/detailcategory/PaginationKategori";

import { getKategoriById } from "../../../../hooks/forum/kategori/getKategori";
import { getForumKategori, getForumTeratas } from "../../../../hooks/forum/getForum";

const CategoryDiscussionsPage = () => {
  const [category, setCategory] = useState({});
  const { id } = useParams();
  const [discussions, setDiscussions] = useState([]);

  const [popularDiscussions, setPopularDiscussions] = useState([]);

  useEffect(() => {
    getKategoriById(id).then((data) => {
      setCategory(data);
    });
  }, []);

  useEffect(() => {
    getForumKategori(id).then((data) => {
      setDiscussions(data);
    });
  }, []);

  useEffect(() => {
    getForumTeratas().then((data) => setPopularDiscussions(data));
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const itemsPerPage = 6;
  const numericCategoryId = parseInt(id, 10);

  if (isNaN(numericCategoryId)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-lg">ID kategori tidak valid.</p>
      </div>
    );
  }

  const filteredDiscussions = discussions
    .filter((discussion) =>
      discussion.judul.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.tgl_dibuat) - new Date(a.tgl_dibuat);
      } else if (sortBy === "oldest") {
        return new Date(a.tgl_dibuat) - new Date(b.tgl_dibuat);
      } else if (sortBy === "popular") {
        return b.jumlah_diskusi - a.jumlah_diskusi;
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredDiscussions.length / itemsPerPage);
  const displayedDiscussions = filteredDiscussions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <HeadDetailKategori
        category={category}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
        <ListKategoriTerkait displayedDiscussions={displayedDiscussions} />
        {totalPages > 1 && (
          <PaginationKategori
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
        </div>

        <DiskusiTrending popularDiscussions={popularDiscussions} />
      </div>
    </motion.div>
  );
};

export default CategoryDiscussionsPage;
