import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import "../../static/css/Navbar.css";
import "../../static/css/MobileMenu.css";

const Navbar = () => {
  const isLoggedIn = localStorage.getItem("username") !== null;
  const [rol] = useState(localStorage.getItem("rol"));
  const username = localStorage.getItem("username") || "";

  const [hideNavbar, setHideNavbar] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  /* ================== SCROLL HIDE NAVBAR ================== */
  const lastScrollY = useRef(window.scrollY);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHideNavbar(y > lastScrollY.current && y > 50);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================== NAV HEIGHT VAR ================== */
  useEffect(() => {
    const setVar = () => {
      const h = navRef.current?.offsetHeight || 72;
      document.documentElement.style.setProperty("--nav-top", `${h}px`);
    };
    setVar();
    window.addEventListener("resize", setVar);
    return () => window.removeEventListener("resize", setVar);
  }, []);

  /* ================== ROUTE CHANGE ================== */
  useEffect(() => {
    setMenuOpen(false);
    setOpenSection(null);
  }, [location.pathname]);

  /* ================== BODY LOCK ================== */
  useEffect(() => {
    if (menuOpen) document.body.classList.add("nav-open");
    else document.body.classList.remove("nav-open");
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  /* ================== HELPERS ================== */
  const handleNavigate = (to) => () => {
    setMenuOpen(false);
    setOpenSection(null);
    navigate(to);
  };

  const toggleSection = (key) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  /* ====================================================== */
  return (
    <header>
      {/* ================= TOP BAR ================= */}
      <nav ref={navRef} className={`navbar ${hideNavbar ? "hide-navbar" : ""}`}>
        <div className="navbar-flex-container">
          <div className="logo">
            <Link to="/acasa">
              <img
                src="/images/favicon/favicon_circle_BANNER.png"
                alt="Logo"
              />
            </Link>
          </div>
        </div>

        <button
          className={`nav-toggle ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* ================= FULLSCREEN MENU ================= */}
      <div
        className={`nav-backdrop ${menuOpen ? "show" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setMenuOpen(false);
        }}
      >
        <nav className="nav-sheet">
          <ul className="nav-links">
            {/* ===== TAEKWON-DO ===== */}
            <li className={`dropdown ${openSection === "tkd" ? "open" : ""}`}>
              <button
                className="menu-title text-danger"
                data-keep="true"
                onClick={() => toggleSection("tkd")}
              >
                TaeKwon-Do
              </button>
              <ul className="dropdown-menu">
                <li><button onClick={handleNavigate("/acasa")}>Acasă</button></li>
                <li><button onClick={handleNavigate("/desprenoi")}>Despre</button></li>
                <li><button onClick={handleNavigate("/antrenori")}>Antrenori</button></li>
                <li><button onClick={handleNavigate("/galerie")}>Galerie</button></li>
                <li><a href="#footer" onClick={() => setMenuOpen(false)}>Contact</a></li>
              </ul>
            </li>

            {/* ===== CALENDAR ===== */}
            {isLoggedIn && (
              <li className={`dropdown ${openSection === "cal" ? "open" : ""}`}>
                <button className="menu-title" onClick={() => toggleSection("cal")}>
                  Calendar
                </button>
                <ul className="dropdown-menu">
                  <li><button onClick={handleNavigate("/calendar2025")}>Calendar 2025</button></li>
                </ul>
              </li>
            )}

            {/* ===== KICKBOX ===== */}
            <li className={`dropdown ${openSection === "kick" ? "open" : ""}`}>
              <button className="menu-title" onClick={() => toggleSection("kick")}>
                Kickbox
              </button>
              <ul className="dropdown-menu">
                <li><button onClick={handleNavigate("/training")}>Antrenamente</button></li>
              </ul>
            </li>

            {/* ===== EXTRA ===== */}
            {!isLoggedIn && (
              <li><button onClick={handleNavigate("/inscriere")}>Alătură-te</button></li>
            )}

            {isLoggedIn && rol !== "AntrenorExtern" && (
              <>
                <li>
                  <a
                    href="https://sites.google.com/hwarang.ro/hwarang-info/pagina-de-pornire"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setMenuOpen(false)}
                  >
                    Informații generale TKD
                  </a>
                </li>
                <li><button onClick={handleNavigate("/documente")}>Documente</button></li>
              </>
            )}

            {(rol === "admin" || rol === "Parinte" || rol === "Sportiv" || rol === "Antrenor") && (
              <li><button onClick={handleNavigate("/concursuri")}>Concursuri</button></li>
            )}

            {rol === "Parinte" && <li><button onClick={handleNavigate("/copiii-mei")}>Copiii mei</button></li>}
            {rol === "admin" && <li><button onClick={handleNavigate("/admin-dashboard")}>Admin</button></li>}
            {rol === "Antrenor" && <li><button onClick={handleNavigate("/antrenor_dashboard")}>Grupe</button></li>}
            {rol === "AntrenorExtern" && <li><button onClick={handleNavigate("/concursuri-extern")}>Concursuri</button></li>}

            {/* ===== AUTH ===== */}
            {isLoggedIn ? (
              <li className="logout-item-mobile">
                <LogoutButton />
              </li>
            ) : (
              <li className="auth-links">
                <button onClick={handleNavigate("/autentificare")}>Login</button>
                <button onClick={handleNavigate("/inregistrare")}>Înregistrare</button>
              </li>
            )}
          </ul>
        </nav>

        {/* CLOSE */}
        <button className="nav-close show" onClick={() => setMenuOpen(false)}>
          ×
        </button>
      </div>
    </header>
  );
};

export default Navbar;
