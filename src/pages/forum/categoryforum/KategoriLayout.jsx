import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Perkebunan from "../../../assets/Images/perkebunan.png";
import Perbuahan from "../../../assets/Images/perbuahan.jpg";
import Obat from "../../../assets/Images/obat.jpeg";
import HeadKategori from "../../../components/forum/categoryforum/HeadKategori";
import KategoriForum from "../../../components/forum/categoryforum/KategoriForum";

const CategoriesPage = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <HeadKategori searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <KategoriForum searchTerm={searchTerm} />
    </motion.div>
  );
};

export default CategoriesPage;
