import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import logo from "../assets/Logo/Mahitala.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full transition duration-300 ease-in-out ${
          isScrolled ? "shadow-lg bg-white" : "bg-transparent"
        } z-50`}
      >
        <div className="flex container justify-between mx-auto px-5 py-4">
          <a href="/" className="flex items-center">
            <img src={logo} alt="Mahitala" className="w-36" />
          </a>

          <button
            type="button"
            className="xl:hidden text-gray-500 hover:text-[#6C7D41] focus:outline-none"
            onClick={toggleMenu}
          >
            <FaBars size={20} />
          </button>

          <div className="hidden xl:flex space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-md font-semibold flex items-center px-5 rounded-md ${
                  isActive
                    ? "text-white bg-[#6C7D41]"
                    : "text-[#6C7D41] hover:bg-gray-100"
                }`
              }
            >
              Halaman Utama
            </NavLink>
            <NavLink
              to="/peta"
              className={({ isActive }) =>
                `text-md flex items-center font-semibold px-5 rounded-md ${
                  isActive
                    ? "text-white bg-[#6C7D41]"
                    : "text-[#6C7D41] hover:bg-gray-100"
                }`
              }
            >
              Peta Interaktif
            </NavLink>
            <NavLink
              to="/forum"
              className={({ isActive }) =>
                `text-md flex items-center font-semibold px-5 rounded-md ${
                  isActive
                    ? "text-white bg-[#6C7D41]"
                    : "text-[#6C7D41] hover:bg-gray-100"
                }`
              }
            >
              Forum Diskusi
            </NavLink>
            <NavLink
              to="/tentang-kami"
              className={({ isActive }) =>
                `text-md flex items-center font-semibold px-5 rounded-md ${
                  isActive
                    ? "text-white bg-[#6C7D41]"
                    : "text-[#6C7D41] hover:bg-gray-100"
                }`
              }
            >
              Tentang Kami
            </NavLink>
          </div>
        </div>
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
      <div className="h-[3.5rem] md:h-20"></div>
    </>
  );
};

export default Header;
