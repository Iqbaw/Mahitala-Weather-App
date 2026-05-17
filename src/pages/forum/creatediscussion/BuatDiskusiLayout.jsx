import React, { useEffect } from "react";
import { motion } from "framer-motion";

import FormBuatDiskusi from "../../../components/forum/creatediscussion/FormBuatDiskusi";
import HeadForm from "../../../components/forum/creatediscussion/HeadForm";

const BuatDiskusi = () => {
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
      className="container px-6 mx-auto my-8 max-w-3xl"
    >
      <HeadForm />

      <FormBuatDiskusi />
    </motion.div>
  );
};

export default BuatDiskusi;
