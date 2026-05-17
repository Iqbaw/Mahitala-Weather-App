import React, { useEffect } from "react";
import { motion } from "framer-motion";

import HeadForum from "../../components/forum/HeadForum";
import KategoriPopuler from "../../components/forum/KategoriPopuler";
import DiskusiTerbaru from "../../components/forum/DiskusiTerbaru";
import DiskusiTerakhir from "../../components/forum/DiskusiTerakhir";
import DiskusiTeratas from "../../components/forum/DiskusiTeratas";

const ForumDiskusi = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container px-6 mx-auto my-8"
    >
      <HeadForum />
      <div className="my-4 md:my-12" />
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
        <div>
          <KategoriPopuler />
          <div className="my-8" />
          <DiskusiTeratas />
        </div>
        <div>
          <DiskusiTerbaru />
          <DiskusiTerakhir />
        </div>
      </div>
    </motion.div>
  );
};

export default ForumDiskusi;
