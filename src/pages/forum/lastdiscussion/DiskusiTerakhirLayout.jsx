import React, { useEffect } from "react";
import { motion } from "framer-motion";

import DiskusiTerakhir from "../../../components/forum/lastdiscussion/DiskusiTerakhir";
import HeadDiskusiTerakhir from "../../../components/forum/lastdiscussion/HeadDiskusiTerakhir";

const DiskusiTerakhirLayout = () => {
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
      className="container mx-auto my-6 px-2"
    >
      <HeadDiskusiTerakhir />

      <DiskusiTerakhir />
    </motion.div>
  );
};

export default DiskusiTerakhirLayout;
