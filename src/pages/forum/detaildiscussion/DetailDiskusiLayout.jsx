import React, { useEffect } from "react";
import { motion } from "framer-motion";

import DetailDiskusi from "../../../components/forum/detaildiscussion/DetailDiskusi";

const DiscussionDetail = () => {
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
      className="container mx-auto px-4 py-8"
    >
      <DetailDiskusi />
    </motion.div>
  );
};

export default DiscussionDetail;
