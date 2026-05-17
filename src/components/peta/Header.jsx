import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav
        className={`absolute top-2.5 left-3 transition duration-300 ease-in-out]`}
        style={{ zIndex: 99998 }}
      >
          <button
            type="button"
            className="md:hidden bg-white p-3 text-gray-400 hover:text-[#6C7D41] focus:outline-none border border-gray-300 rounded-md"
            onClick={toggleMenu}
          >
            <FaBars size={20} />
          </button>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <button
                type="button"
                className="absolute top-4 right-4 text-gray-500 hover:text-[#6C7D41] focus:outline-none"
                onClick={toggleMenu}
              >
                <FaTimes size={30} />
              </button>
              <ul className="space-y-6 text-center">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `text-2xl font-semibold ${
                        isActive ? "text-[#6C7D41]" : "text-black"
                      }`
                    }
                    onClick={toggleMenu}
                  >
                    Halaman Utama
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/peta"
                    className={({ isActive }) =>
                      `text-2xl font-semibold ${
                        isActive ? "text-[#6C7D41]" : "text-black"
                      }`
                    }
                    onClick={toggleMenu}
                  >
                    Peta Interaktif
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/forum"
                    className={({ isActive }) =>
                      `text-2xl font-semibold ${
                        isActive ? "text-[#6C7D41]" : "text-black"
                      }`
                    }
                    onClick={toggleMenu}
                  >
                    Forum Diskusi
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/tentang-kami"
                    className={({ isActive }) =>
                      `text-2xl font-semibold ${
                        isActive ? "text-[#6C7D41]" : "text-black"
                      }`
                    }
                    onClick={toggleMenu}
                  >
                    Tentang Kami
                  </NavLink>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Header;
