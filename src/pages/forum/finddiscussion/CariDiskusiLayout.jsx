import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import ListDiskusiDicari from "../../../components/forum/finddiscussion/ListDiskusiDicari";
import DiskusiTrending from "../../../components/forum/finddiscussion/DiskusiTrending";
import PaginationDicari from "../../../components/forum/finddiscussion/PaginationDicari";
import HeadDiskusiDicari from "../../../components/forum/finddiscussion/HeadDiskusiDicari";

import { getForumTeratas, getSearchForum } from "../../../hooks/forum/getForum";


const CariDiskusiLayout = () => {
  const [discussions, setDiscussions] = useState([]);
  const [popularDiscussions, setPopularDiscussions] = useState([]);
  const { keyword } = useParams();
  
  useEffect(() => {
    getForumTeratas().then((res) => setPopularDiscussions(res));
  }, []);

  useEffect(() => {
    getSearchForum(keyword).then((res) => setDiscussions(res));
  }, [keyword]);

  const itemsPerPage = 6;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(discussions.length / itemsPerPage);
  const displayedDiscussions = discussions.slice(
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
      <HeadDiskusiDicari keyword={keyword} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ListDiskusiDicari displayedDiscussions={displayedDiscussions} />
          {totalPages > 1 && (
            <PaginationDicari
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

export default CariDiskusiLayout;
