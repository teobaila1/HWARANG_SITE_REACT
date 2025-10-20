import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import "../../static/css/Navbar.css";

const Navbar = () => {
  const isLoggedIn = localStorage.getItem("username") !== null;
  const [rol, setRol] = useState(localStorage.getItem("rol"));
  const username = localStorage.getItem("username") || "";

  const [hideNavbar, setHideNavbar] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const wrapRef = useRef(null);
  const navRef = useRef(null);
  const location = useLocation();

  // ascunde/arată navbar la scroll
  const lastScrollY = useRef(typeof window !== "undefined" ? window.scrollY : 0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHideNavbar(y > lastScrollY.current && y > 50);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // actualizează variabila CSS --nav-top cu înălțimea reală a barei
  useEffect(() => {
    const setVar = () => {
      const h = navRef.current?.offsetHeight || 72;
      document.documentElement.style.setProperty("--nav-top", `${h}px`);
    };
    setVar();
    window.addEventListener("resize", setVar);
    return () => window.removeEventListener("resize", setVar);
  }, []);

  // închide meniul la schimbarea rutei
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // închide meniul la click în afara navbar-ului
  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuOpen) return;
      if (!wrapRef.current?.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [menuOpen]);

  // închide la ESC + blochează scroll pe body când e deschis
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    if (menuOpen) document.body.classList.add("nav-open");
    else document.body.classList.remove("nav-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("nav-open");
    };
  }, [menuOpen]);

  return (
    <header ref={wrapRef}>
      <nav ref={navRef} className={`navbar ${hideNavbar ? "hide-navbar" : ""}`}>
        {/* stânga: logo */}
        <div className="navbar-flex-container">
          <div className="logo">
            <Link to="/acasa" aria-label="Acasă">
              <img src="/images/favicon/favicon_circle_BANNER.png" alt="Logo Club" />
            </Link>
          </div>
        </div>

        {/* buton hamburger (mobil) */}
        <button
          type="button"
          className={`nav-toggle ${menuOpen ? "is-open" : ""}`}
          aria-label={menuOpen ? "Închide meniul" : "Deschide meniul"}
          aria-expanded={menuOpen}
          aria-controls="primary-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>

        {/* MENIU */}
        <ul
          id="primary-menu"
          className={`nav-links ${menuOpen ? "show" : ""}`}
          aria-hidden={!menuOpen}
          onClick={(e) => {
            // click pe un link închide meniul
            if (e.target.closest("a")) setMenuOpen(false);
          }}
        >
          <li className="dropdown">
            <NavLink to="/acasa" className="text-danger" tabIndex={0}>
              TaeKwon-Do
            </NavLink>
            <ul className="dropdown-menu">
              <li><NavLink to="/acasa">Acasă</NavLink></li>
              <li><NavLink to="/desprenoi">Despre</NavLink></li>
              <li><NavLink to="/antrenori">Antrenori</NavLink></li>
              <li><NavLink to="/galerie">Galerie</NavLink></li>
              <li><a href="#footer">Contact</a></li>
            </ul>
          </li>

          {isLoggedIn && (
            <li className="dropdown">
              <NavLink to="/calendar2025" tabIndex={0}>Calendar</NavLink>
              <ul className="dropdown-menu">
                <li><NavLink to="/calendar2025">Calendar 2025</NavLink></li>
              </ul>
            </li>
          )}

          <li className="dropdown">
            <NavLink to="/training" tabIndex={0}>Kickbox</NavLink>
            <ul className="dropdown-menu">
              <li><NavLink to="/training">Antrenamente</NavLink></li>
            </ul>
          </li>

          {!isLoggedIn && (
            <li className="join-link">
              <NavLink to="/inscriere">Alătură-te</NavLink>
            </li>
          )}

          {isLoggedIn && rol !== "AntrenorExtern" && (
            <li>
              <NavLink to="https://sites.google.com/hwarang.ro/hwarang-info/pagina-de-pornire">
                Informații generale TKD
              </NavLink>
            </li>
          )}
          {isLoggedIn && rol !== "AntrenorExtern" && (
            <li><NavLink to="/documente">Documente</NavLink></li>
          )}

          {(rol === "admin" || rol === "Parinte" || rol === "Sportiv" || rol === "Antrenor") && (
            <li><NavLink to="/concursuri">Concursuri</NavLink></li>
          )}

          {rol === "Parinte" && <li><NavLink to="/copiii-mei">Copiii mei</NavLink></li>}
          {rol === "admin" && <li><NavLink to="/admin-dashboard">Admin</NavLink></li>}
          {rol === "Antrenor" && <li><NavLink to="/antrenor_dashboard">Grupe</NavLink></li>}
          {rol === "AntrenorExtern" && <li><NavLink to="/concursuri-extern">Concursuri</NavLink></li>}

          {isLoggedIn ? (
            <li className="dropdown user-menu">
              <button className="user-chip" aria-haspopup="true" aria-expanded="false">
                <span className="avatar">{username[0]?.toUpperCase() || "?"}</span>
                <span className="greet">
                  Bine ai venit,&nbsp;<strong className="name" title={username}>{username}</strong>
                </span>
              </button>
              <ul className="dropdown-menu dropdown-menu--right">
                <li className="dropdown-caption">Conectat ca <strong>{username}</strong></li>
                <li className="logout-item"><LogoutButton /></li>
              </ul>
            </li>
          ) : (
            <li className="auth-links">
              <NavLink to="/autentificare">Login</NavLink>
              <NavLink to="/inregistrare">Înregistrare</NavLink>
            </li>
          )}
        </ul>

        {/* buton de închidere (mobil) */}
        <button
          type="button"
          className={`nav-close ${menuOpen ? "show" : ""}`}
          aria-label="Închide meniul"
          onClick={() => setMenuOpen(false)}
        >
          ×
        </button>
      </nav>

      {/* backdrop – tap închide */}
      <div
        className={`nav-backdrop ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
      />
    </header>
  );
};

export default Navbar;
