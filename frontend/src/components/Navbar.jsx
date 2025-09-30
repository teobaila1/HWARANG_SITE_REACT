import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import LogoutButton from "./LogoutButton";
import "../../static/css/Navbar.css";

const Navbar = () => {
  const isLoggedIn = localStorage.getItem("username") !== null;
  const [rol, setRol] = useState(null);
  const username = localStorage.getItem("username");
  const [hideNavbar, setHideNavbar] = useState(false);

  useEffect(() => {
    const storedRol = localStorage.getItem("rol");
    setRol(storedRol);
  }, []);

  let lastScrollY = window.scrollY;
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setHideNavbar(true);
      } else {
        setHideNavbar(false);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav className={`navbar ${hideNavbar ? "hide-navbar" : ""}`}>
        {/* stânga: logo */}
        <div className="navbar-flex-container">
          <div className="logo">
            <Link to="/acasa" aria-label="Acasă">
              <img src="/images/favicon/favicon_circle_BANNER.png" alt="Logo Club" />
            </Link>
          </div>
        </div>

        {/* dreapta: linkuri */}
        <ul className="nav-links">
          <li className="dropdown">
            <a href="/acasa" className="text-danger" tabIndex={0} aria-haspopup="true" aria-expanded="false">
              TaeKwon-Do
            </a>
            <ul className="dropdown-menu">
              <li><a href="/acasa">Acasă</a></li>
              <li><a href="/desprenoi">Despre</a></li>
              <li><a href="/antrenori">Antrenori</a></li>
              <li><a href="/galerie">Galerie</a></li>
              <li><a href="#footer">Contact</a></li>
            </ul>
          </li>

          {isLoggedIn && (
            <li className="dropdown">
              <a href="#" tabIndex={0} aria-haspopup="true" aria-expanded="false">
                Calendar
              </a>
              <ul className="dropdown-menu">
                <li><a href="/calendar2025">Calendar 2025</a></li>
              </ul>
            </li>
          )}

          <li className="dropdown">
            <a href="/training" tabIndex={0} aria-haspopup="true" aria-expanded="false">
              Kickbox
            </a>
            <ul className="dropdown-menu">
              <li><a href="/training">Antrenamente</a></li>
            </ul>
          </li>

          {!isLoggedIn && (
            <li className="join-link">
              <a href="/inscriere">Alătură-te</a>
            </li>
          )}

          {isLoggedIn && <li><a href="#">Regulamente</a></li>}

          {isLoggedIn && rol !== "AntrenorExtern" && (
            <li><a href="/documente">Documente</a></li>
          )}

          {(rol === "admin" || rol === "Parinte" || rol === "Sportiv" || rol === "Antrenor") && (
            <li><a href="/concursuri">Concursuri</a></li>
          )}

          {rol === "Parinte" && (
            <li><Link to="/copiii-mei">Copiii mei</Link></li>
          )}

          {rol === "admin" && <li><Link to="/admin-dashboard">Admin</Link></li>}
          {rol === "Antrenor" && <li><Link to="/antrenor_dashboard">Grupe</Link></li>}
          {rol === "AntrenorExtern" && <li><Link to="/concursuri-extern">Concursuri</Link></li>}

          {/* user chip cu dropdown (bine ai venit + logout) */}
          {isLoggedIn ? (
            <li className="dropdown user-menu">
              <button className="user-chip" aria-haspopup="true" aria-expanded="false">
                <span className="avatar">{(username || "?")[0].toUpperCase()}</span>
                <span className="greet">
                  Bine ai venit,&nbsp;<strong className="name" title={username}>{username}</strong>
                </span>
              </button>

              <ul className="dropdown-menu dropdown-menu--right">
                <li className="dropdown-caption">
                  Conectat ca <strong>{username}</strong>
                </li>
                <li className="logout-item">
                  <LogoutButton />
                </li>
              </ul>
            </li>
          ) : (
            // 🔧 Grupăm Login + Înregistrare într-un singur <li> ca să nu existe spațiu mare
            <li className="auth-links">
              <Link to="/autentificare">Login</Link>
              <Link to="/inregistrare">Înregistrare</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
