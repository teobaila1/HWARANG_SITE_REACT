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

  // Stare pentru acordeonul din meniul mobil
  const [mobileExpanded, setMobileExpanded] = useState({ tkd: false, cal: false, kick: false });

  const location = useLocation();
  const navigate = useNavigate();
  const lastScrollY = useRef(0);

  // --- 1. LOGICA DE SCROLL (Ascunde bara de sus la scroll în jos) ---
  useEffect(() => {
    const onScroll = () => {
      // Dacă meniul e deschis, NU facem nimic (rămâne fix)
      if (menuOpen) return;

      const y = window.scrollY;
      // Ascundem doar dacă am scrolat mai mult de 50px și mergem în jos
      setHideNavbar(y > lastScrollY.current && y > 50);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  // --- 2. RESET LA NAVIGARE ---
  useEffect(() => {
    setMenuOpen(false);
    setMobileExpanded({ tkd: false, cal: false, kick: false });
    document.body.classList.remove("nav-open"); // Deblochează scroll
  }, [location.pathname]);

  // --- 3. BLOCARE SCROLL CÂND MENIUL E DESCHIS ---
  useEffect(() => {
    if (menuOpen) {
        document.body.classList.add("nav-open");
    } else {
        document.body.classList.remove("nav-open");
    }
    // Cleanup
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  // Funcții ajutătoare
  const closeMenu = () => setMenuOpen(false);

  const handleMobileNavigate = (to) => {
      closeMenu();
      navigate(to);
  };

  const toggleMobileSection = (section) => {
    setMobileExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <>
      {/* ================= NAVBAR PRINCIPAL (Bara de sus) ================= */}
      <nav className={`navbar ${hideNavbar ? "hide-navbar" : ""}`}>
        <div className="navbar-flex-container">
          <div className="logo">
            <Link to="/acasa" aria-label="Acasă">
              <img src="/images/favicon/favicon_circle_BANNER.png" alt="Logo Club" />
            </Link>
          </div>
        </div>

        {/* BUTON HAMBURGER (Vizibil doar pe mobil) */}
        {/* Important: Z-index mare pentru a fi peste orice, dar sub overlay-ul deschis */}
        <button
            type="button"
            className="hamburger-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Deschide meniu"
        >
            <span/><span/><span/>
        </button>

        {/* --- MENIU DESKTOP CLASIC (Ascuns complet pe mobil din CSS) --- */}
        <ul className="nav-links desktop-only-nav">
             {/* ... Codul existent pentru Desktop ... */}
             <li className="dropdown">
                 <a href="#" className="menu-title text-danger">TaeKwon-Do</a>
                 <ul className="dropdown-menu">
                     <li><button onClick={() => navigate("/acasa")}>Acasă</button></li>
                     <li><button onClick={() => navigate("/desprenoi")}>Despre</button></li>
                     <li><button onClick={() => navigate("/antrenori")}>Antrenori</button></li>
                     <li><button onClick={() => navigate("/galerie")}>Galerie</button></li>
                     <li><a href="#footer">Contact</a></li>
                 </ul>
             </li>
             {isLoggedIn && (
                <li className="dropdown">
                    <a href="#">Calendar</a>
                    <ul className="dropdown-menu"><li><button onClick={() => navigate("/calendar2025")}>Calendar 2025</button></li></ul>
                </li>
             )}
             <li className="dropdown">
                 <a href="#">Kickbox</a>
                 <ul className="dropdown-menu"><li><button onClick={() => navigate("/training")}>Antrenamente</button></li></ul>
             </li>

             {!isLoggedIn && (
                <li className="join-link"><button onClick={() => navigate("/inscriere")}>Alătură-te</button></li>
             )}

             {isLoggedIn && rol !== "AntrenorExtern" && (
                <>
                    <li><a href="https://sites.google.com/hwarang.ro/hwarang-info" target="_blank">Info</a></li>
                    <li><button onClick={() => navigate("/documente")}>Documente</button></li>
                </>
             )}

             {(rol === "admin" || rol === "Parinte" || rol === "Sportiv" || rol === "Antrenor") && (
                 <li><button onClick={() => navigate("/concursuri")}>Concursuri</button></li>
             )}

             {rol === "Parinte" && <li><button onClick={() => navigate("/copiii-mei")}>Copiii mei</button></li>}
             {rol === "admin" && <li><button onClick={() => navigate("/admin-dashboard")}>Admin</button></li>}
             {rol === "Antrenor" && <li><button onClick={() => navigate("/antrenor_dashboard")}>Grupe</button></li>}
             {rol === "AntrenorExtern" && <li><button onClick={() => navigate("/concursuri-extern")}>Extern</button></li>}

             {/* User Desktop */}
             {isLoggedIn ? (
               <li className="user-menu-desktop dropdown">
                   <div className="user-chip">
                       <span className="avatar">{username[0]?.toUpperCase()}</span>
                       <span className="name">{username}</span>
                   </div>
                   <ul className="dropdown-menu dropdown-menu--right">
                       <li><LogoutButton/></li>
                   </ul>
               </li>
           ) : (
               <li className="auth-links-desktop">
                   <button onClick={() => navigate("/autentificare")}>Login</button>
                   <button onClick={() => navigate("/inregistrare")}>Înregistrare</button>
               </li>
           )}
        </ul>
      </nav>

      {/* ==================================================================================
          NOUL MENIU MOBIL FULL-SCREEN (OVERLAY)
          Acesta este complet separat de navbar-ul de sus pentru a evita conflictele.
      ================================================================================== */}
      <div className={`mobile-overlay ${menuOpen ? "is-open" : ""}`}>

        {/* Header-ul meniului (Logo + Buton Close) */}
        <div className="mobile-menu-header">
             <img src="/images/favicon/favicon_circle_BANNER.png" alt="Logo" className="mobile-logo"/>
             <button className="mobile-close-btn" onClick={closeMenu}>&times;</button>
        </div>

        {/* Lista de link-uri (Scrollabilă) */}
        <div className="mobile-menu-content">

            {/* TAEKWON-DO */}
            <div className="mobile-group">
                <button className={`mobile-group-toggle ${mobileExpanded.tkd ? 'active' : ''}`} onClick={() => toggleMobileSection('tkd')}>
                    TaeKwon-Do <span className="arrow">›</span>
                </button>
                <div className={`mobile-sub-links ${mobileExpanded.tkd ? 'open' : ''}`}>
                    <button onClick={() => handleMobileNavigate("/acasa")}>Acasă</button>
                    <button onClick={() => handleMobileNavigate("/desprenoi")}>Despre Noi</button>
                    <button onClick={() => handleMobileNavigate("/antrenori")}>Antrenori</button>
                    <button onClick={() => handleMobileNavigate("/galerie")}>Galerie Foto</button>
                    <a href="#footer" onClick={closeMenu}>Contact</a>
                </div>
            </div>

            {/* CALENDAR */}
            {isLoggedIn && (
            <div className="mobile-group">
                <button className={`mobile-group-toggle ${mobileExpanded.cal ? 'active' : ''}`} onClick={() => toggleMobileSection('cal')}>
                    Calendar <span className="arrow">›</span>
                </button>
                <div className={`mobile-sub-links ${mobileExpanded.cal ? 'open' : ''}`}>
                    <button onClick={() => handleMobileNavigate("/calendar2025")}>Calendar 2025</button>
                </div>
            </div>
            )}

            {/* KICKBOX */}
            <div className="mobile-group">
                 <button className={`mobile-group-toggle ${mobileExpanded.kick ? 'active' : ''}`} onClick={() => toggleMobileSection('kick')}>
                    Kickbox <span className="arrow">›</span>
                </button>
                 <div className={`mobile-sub-links ${mobileExpanded.kick ? 'open' : ''}`}>
                    <button onClick={() => handleMobileNavigate("/training")}>Antrenamente</button>
                </div>
            </div>

            {/* ALTE LINKURI */}
            <div className="mobile-simple-links">
                {!isLoggedIn && <button className="highlight-btn" onClick={() => handleMobileNavigate("/inscriere")}>Alătură-te clubului</button>}

                {isLoggedIn && rol !== "AntrenorExtern" && (
                    <>
                        <a href="https://sites.google.com/hwarang.ro/hwarang-info" target="_blank" rel="noreferrer">Info Generale</a>
                        <button onClick={() => handleMobileNavigate("/documente")}>Documente</button>
                    </>
                )}
                {(rol === "admin" || rol === "Parinte" || rol === "Sportiv" || rol === "Antrenor") && (
                        <button onClick={() => handleMobileNavigate("/concursuri")}>Concursuri</button>
                )}
                {rol === "Parinte" && <button onClick={() => handleMobileNavigate("/copiii-mei")}>Copiii mei</button>}
                {rol === "admin" && <button onClick={() => handleMobileNavigate("/admin-dashboard")}>Admin Dashboard</button>}
                {rol === "Antrenor" && <button onClick={() => handleMobileNavigate("/antrenor_dashboard")}>Panou Antrenor</button>}
            </div>
        </div>

        {/* Footer-ul meniului (User & Login) - Sticky Bottom */}
        <div className="mobile-menu-footer">
            {isLoggedIn ? (
                <div className="mobile-user-card">
                    <div className="info">
                        <div className="avatar">{username[0]?.toUpperCase()}</div>
                        <div className="text">
                            <small>Conectat ca</small>
                            <strong>{username}</strong>
                        </div>
                    </div>
                    <div className="action">
                         <LogoutButton />
                    </div>
                </div>
            ) : (
                <div className="mobile-auth-row">
                    <button className="btn-login" onClick={() => handleMobileNavigate("/autentificare")}>Autentificare</button>
                    <button className="btn-register" onClick={() => handleMobileNavigate("/inregistrare")}>Înregistrare</button>
                </div>
            )}
        </div>

      </div>
    </>
  );
};

export default Navbar;