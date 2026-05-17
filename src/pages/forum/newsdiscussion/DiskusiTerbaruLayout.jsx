import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import HeadCariDiskusi from "../../../components/forum/newsdiscussion/HeadCariDiskusi";
import ListDiskusiTerbaru from "../../../components/forum/newsdiscussion/ListDiskusiTerbaru";
import DiskusiTrending from "../../../components/forum/newsdiscussion/DiskusiTrending";
import PaginationDiskusi from "../../../components/forum/newsdiscussion/PaginationDiskusi";

import { getForumTerbaru, getForumTeratas } from "../../../hooks/forum/getForum";

const DiskusiTerbaruLayout = () => {
  const [discussions, setDiscussions] = useState([]);

  const [popularDiscussions, setPopularDiscussions] = useState([]);

  useEffect(() => {
    getForumTerbaru().then((data) => setDiscussions(data));
    getForumTeratas().then((data) => setPopularDiscussions(data));
  }, []);

  const itemsPerPage = 6;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDiscussions = discussions.filter((discussion) => {
    return discussion.judul.toLowerCase().includes(searchTerm.toLowerCase());
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
      <HeadCariDiskusi searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ListDiskusiTerbaru displayedDiscussions={displayedDiscussions} />
          {totalPages > 1 && (
            <PaginationDiskusi
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

export default DiskusiTerbaruLayout;
