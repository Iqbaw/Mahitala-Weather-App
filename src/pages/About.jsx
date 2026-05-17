import React, { useEffect } from "react";
import { motion } from "framer-motion";

import AboutTop from "../assets/Images/about.jpeg";
import HeaderTitle from "../components/about/HeaderTitle";
import TujuanProyek from "../components/about/TujuanProyek";
import TeknologiProyek from "../components/about/TeknologiProyek";
import SorotanProyek from "../components/about/SorotanProyek";
import HubungiKami from "../components/about/HubungiKami";

function AboutPage() {
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
    >
      <div
        className="relative h-[70vh] w-full bg-cover bg-center mt-4 md:mt-0 parallax"
        style={{
          backgroundImage: `url(${AboutTop})`,
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <HeaderTitle />
      </div>
      <section className="px-8 py-16 mx-auto">
        <TujuanProyek />
      </section>
      <section className="px-8 py-16 bg-gray-100">
        <TeknologiProyek />
      </section>
      <section className="px-8 py-16 max-w-6xl mx-auto">
        <SorotanProyek />
      </section>
      <section className="bg-[#6C7D41] text-white py-16 px-8">
        <HubungiKami />
      </section>
    </motion.div>
  );
}

export default AboutPage;
