import React, { useEffect, useState, useCallback } from "react";
import logo from "../assets/Logo/Mahitala.png";
import { NavLink } from "react-router-dom";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Swal from "sweetalert2";

import { useUser } from "../utils/userContext";
import { Modal, LoginForm, RegisterForm } from "../components/auth/ModalAuth";
import { loginAuth, registerAuth, logoutAuth } from "../hooks/auth/Authentication";
import { generateSecureToken } from "../utils/Constants";
import { downloadTokenAsFile } from "../utils/organizeKeyFile";

const Footer = () => {
  const { isAuthenticated, setIsAuthenticated } = useUser();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const registerToken = generateSecureToken(32);

  useEffect(() => {
    const storedUser = localStorage.getItem("token");
    if (storedUser) {
      setIsAuthenticated(true);
    }
  }, []);

  const toggleLoginModal = useCallback(() => {
    setIsError(false);
    setIsLoginOpen((prev) => !prev);
  }, []);

  const toggleRegisterModal = useCallback(() => {
    setIsError(false);
    setIsRegisterOpen((prev) => !prev);
  }, []);

  const handleLogin = useCallback(async (formData) => {
    try {
      if (!formData.username || !formData.token) {
        setIsError(true);
        setErrorMessage("Username dan token harus diisi");
        return;
      }

      const res = await loginAuth(formData);
      if (res.status === 200) {
        setIsAuthenticated(true);
        setIsLoginOpen(false);
        window.location.reload();
      } else {
        setIsError(true);
        setErrorMessage(res.message || "Terjadi kesalahan, silahkan coba lagi");
      }
    } catch (error) {
      setIsError(true);
      setErrorMessage("Terjadi kesalahan, silahkan coba lagi");
    }
  }, []);

  const handleRegister = useCallback(async (formData) => {
    try {
      if (!formData.username) {
        setIsError(true);
        setErrorMessage("Username harus diisi");
        return;
      }

      const res = await registerAuth(formData);

      if (res.status === 200) {
        setIsAuthenticated(true);
        setIsRegisterOpen(false);
        downloadTokenAsFile(formData.token, formData.username);
        window.location.reload();
      } else {
        setIsError(true);
        setErrorMessage(res.message || "Terjadi kesalahan, silahkan coba lagi");
      }
    } catch (error) {
      setIsError(true);
      setErrorMessage("Terjadi kesalahan, silahkan coba lagi");
    }
  }, []);

  return (
    <>
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="container mx-auto px-6 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex flex-col items-center lg:items-start">
                <img
                  src={logo}
                  className="w-44 h-auto mb-4"
                  alt="Mahitala Logo"
                />
                <p className="text-gray-600 text-base leading-relaxed text-center lg:text-left max-w-sm">
                  Solusi terpercaya untuk membantu petani mengelola risiko
                  terkait perubahan cuaca ekstrem.
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center lg:text-left">
                Navigasi
              </h3>
              <nav className="flex flex-col space-y-3">
                <NavLink
                  to="/"
                  className="text-gray-600 hover:text-[#6C7D41] font-medium transition-colors duration-300 text-center lg:text-left py-1"
                >
                  Halaman Utama
                </NavLink>
                <NavLink
                  to="/peta"
                  className="text-gray-600 hover:text-[#6C7D41] font-medium transition-colors duration-300 text-center lg:text-left py-1"
                >
                  Peta
                </NavLink>
                <NavLink
                  to="/forum"
                  className="text-gray-600 hover:text-[#6C7D41] font-medium transition-colors duration-300 text-center lg:text-left py-1"
                >
                  Forum Diskusi
                </NavLink>
                <NavLink
                  to="/tentang-kami"
                  className="text-gray-600 hover:text-[#6C7D41] font-medium transition-colors duration-300 text-center lg:text-left py-1"
                >
                  Tentang Kami
                </NavLink>
              </nav>
            </div>

            {/* Authentication Section */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center lg:text-left">
                {isAuthenticated ? "Pengaturan" : "Authentikasi"}
              </h3>
              <div className="flex justify-center lg:justify-start">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={() => {
                        Swal.fire({
                          title: "Konfirmasi Keluar",
                          text: "Apakah Anda yakin ingin keluar?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#ff6565",
                          confirmButtonText: "Ya, Keluar",
                          cancelButtonText: "Batal",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            logoutAuth();
                            setIsAuthenticated(false);
                            Swal.fire({
                              title: "Berhasil Keluar",
                              text: "Anda telah berhasil keluar.",
                              icon: "success",
                              timer: 2000,
                              showConfirmButton: false,
                            });
                          }
                        });
                      }}
                      className="text-gray-600 hover:text-[#6C7D41] font-medium transition-colors duration-300 text-center lg:text-left py-1"
                    >
                      Keluar
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-4">
                    <button
                      onClick={toggleLoginModal}
                      className="text-gray-600 hover:text-[#6C7D41] font-medium transition-colors duration-300 text-center lg:text-left py-1"
                    >
                      Masuk
                    </button>
                    <button
                      onClick={toggleRegisterModal}
                      className="text-gray-600 hover:text-[#6C7D41] font-medium transition-colors duration-300 text-center lg:text-left py-1"
                    >
                      Daftar
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media Section */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center lg:text-left">
                Ikuti Kami
              </h3>
              <div className="flex justify-center lg:justify-start space-x-5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 hover:bg-[#6C7D41] rounded-full flex items-center justify-center text-gray-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <FaFacebookF size={18} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 hover:bg-[#6C7D41] rounded-full flex items-center justify-center text-gray-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                  aria-label="Twitter"
                >
                  <FaXTwitter size={18} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 hover:bg-[#6C7D41] rounded-full flex items-center justify-center text-gray-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <FaInstagram size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Mahitala. All rights reserved. 
            </p>
            <p className="text-gray-500 text-sm">
              Powered by{" "}
              <a
                href="https://bmkg.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6C7D41] hover:underline"
              >
                BMKG
              </a>
              , {" "}
              <a
                href="https://soilgrids.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6C7D41] hover:underline"
              >
                {" "}SoilGrids
              </a>
              , and{" "}
              <a
                href="https://insights.planet.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6C7D41] hover:underline"
              >
                Planet Labs
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
      <Modal
        isOpen={isLoginOpen}
        onClose={toggleLoginModal}
        isError={isError}
        errorMessage={errorMessage}
        title="Selamat Datang"
        description="Silahkan masuk untuk mengakses fitur dan data yang lebih lengkap"
      >
        <LoginForm onSubmit={handleLogin} />
      </Modal>

      <Modal
        isOpen={isRegisterOpen}
        onClose={toggleRegisterModal}
        isError={isError}
        errorMessage={errorMessage}
        title="Buat Akun"
        description="Silahkan buat akun untuk mendapatkan fitur dan data yang lebih lengkap"
      >
        <RegisterForm onSubmit={handleRegister} initialToken={registerToken} />
      </Modal>
    </>
  );
};

export default Footer;
