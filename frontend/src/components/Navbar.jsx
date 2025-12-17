import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import LogoutButton from "./LogoutButton";
import "../../static/css/Navbar.css";
import "../../static/css/MobileMenu.css";

const Navbar = () => {
    const isLoggedIn = localStorage.getItem("username") !== null;
    const [rol] = useState(localStorage.getItem("rol"));
    const username = localStorage.getItem("username") || "";

    const [hideNavbar, setHideNavbar] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState({tkd: false, cal: false, kick: false});

    const location = useLocation();
    const navigate = useNavigate();
    const lastScrollY = useRef(0);

    // --- SCROLL LOGIC ---
    useEffect(() => {
        const onScroll = () => {
            if (menuOpen) return;
            const y = window.scrollY;
            setHideNavbar(y > lastScrollY.current && y > 50);
            lastScrollY.current = y;
        };
        window.addEventListener("scroll", onScroll, {passive: true});
        return () => window.removeEventListener("scroll", onScroll);
    }, [menuOpen]);

    // --- RESET LA NAVIGARE ---
    useEffect(() => {
        setMenuOpen(false);
        setMobileExpanded({tkd: false, cal: false, kick: false});
        document.body.classList.remove("nav-open");
    }, [location.pathname]);

    // --- BLOCARE BODY SCROLL ---
    useEffect(() => {
        if (menuOpen) document.body.classList.add("nav-open");
        else document.body.classList.remove("nav-open");
        return () => document.body.classList.remove("nav-open");
    }, [menuOpen]);

    const closeMenu = () => setMenuOpen(false);

    const handleMobileNavigate = (to) => {
        closeMenu();
        navigate(to);
    };

    const toggleMobileSection = (section) => {
        setMobileExpanded(prev => ({...prev, [section]: !prev[section]}));
    };

    return (
        <>
            {/* ================= NAVBAR PRINCIPAL (Desktop & Hamburger) ================= */}
            <nav className={`navbar ${hideNavbar ? "hide-navbar" : ""}`}>
                <div className="navbar-flex-container">
                    <div className="logo">
                        <Link to="/acasa" aria-label="Acasă">
                            <img src="/images/favicon/favicon_circle_BANNER.png" alt="Logo Club"/>
                        </Link>
                    </div>
                </div>

                {/* Buton Hamburger (Vizibil doar când meniul e ÎNCHIS) */}
                <button
                    type="button"
                    className="hamburger-btn"
                    onClick={() => setMenuOpen(true)}
                    aria-label="Deschide meniu"
                    style={{opacity: menuOpen ? 0 : 1}} // Îl ascundem vizual când meniul e deschis
                >
                    <span/><span/><span/>
                </button>

                {/* Meniu Desktop (Ascuns pe mobil din CSS) */}
                <ul className="nav-links desktop-only-nav">
                    <li className="dropdown">
                        <a href="#" className="menu-title text-danger">TaeKwon-Do</a>
                        <ul className="dropdown-menu">
                            <li>
                                <button onClick={() => navigate("/acasa")}>Acasă</button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/desprenoi")}>Despre</button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/antrenori")}>Antrenori</button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/galerie")}>Galerie</button>
                            </li>
                            <li><a href="#footer">Contact</a></li>
                        </ul>
                    </li>
                    {isLoggedIn && (
                        <li className="dropdown">
                            <a href="#">Calendar</a>
                            <ul className="dropdown-menu">
                                <li>
                                    <button onClick={() => navigate("/calendar2025")}>Calendar 2025</button>
                                </li>
                            </ul>
                        </li>
                    )}
                    <li className="dropdown">
                        <a href="#">Kickbox</a>
                        <ul className="dropdown-menu">
                            <li>
                                <button onClick={() => navigate("/training")}>Antrenamente</button>
                            </li>
                        </ul>
                    </li>
                    {!isLoggedIn && (
                        <li className="join-link">
                            <button onClick={() => navigate("/inscriere")}>Alătură-te</button>
                        </li>
                    )}
                    {isLoggedIn && rol !== "AntrenorExtern" && (
                        <>
                            <li><a href="https://sites.google.com/hwarang.ro/hwarang-info" target="_blank">Info</a></li>
                            <li>
                                <button onClick={() => navigate("/documente")}>Documente</button>
                            </li>
                        </>
                    )}
                    {(rol === "admin" || rol === "Parinte" || rol === "Sportiv" || rol === "Antrenor") && (
                        <li>
                            <button onClick={() => navigate("/concursuri")}>Concursuri</button>
                        </li>
                    )}
                    {rol === "Parinte" && <li>
                        <button onClick={() => navigate("/copiii-mei")}>Copiii mei</button>
                    </li>}
                    {rol === "admin" && <li>
                        <button onClick={() => navigate("/admin-dashboard")}>Admin</button>
                    </li>}
                    {rol === "Antrenor" && <li>
                        <button onClick={() => navigate("/antrenor_dashboard")}>Grupe</button>
                    </li>}
                    {rol === "AntrenorExtern" && <li>
                        <button onClick={() => navigate("/concursuri-extern")}>Extern</button>
                    </li>}

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
                MENIU MOBIL FULL-SCREEN (REPARAT)
            ================================================================================== */}
            <div className={`mobile-overlay ${menuOpen ? "is-open" : ""}`}>

                {/* --- HEADER: Logo (Stânga) + X (Dreapta) --- */}
                <div className="mobile-menu-header">
                    <img src="/images/favicon/favicon_circle_BANNER.png" alt="Logo" className="mobile-logo"/>

                    {/* BUTONUL X - Acum este în dreapta logo-ului, pe același rând */}
                    <button className="mobile-close-btn" onClick={closeMenu} aria-label="Închide">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                             strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* --- CONȚINUT --- */}
                <div className="mobile-menu-content">
                    <div className="mobile-group">
                        <button className={`mobile-group-toggle ${mobileExpanded.tkd ? 'active' : ''}`}
                                onClick={() => toggleMobileSection('tkd')}>
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

                    {isLoggedIn && (
                        <div className="mobile-group">
                            <button className={`mobile-group-toggle ${mobileExpanded.cal ? 'active' : ''}`}
                                    onClick={() => toggleMobileSection('cal')}>
                                Calendar <span className="arrow">›</span>
                            </button>
                            <div className={`mobile-sub-links ${mobileExpanded.cal ? 'open' : ''}`}>
                                <button onClick={() => handleMobileNavigate("/calendar2025")}>Calendar 2025</button>
                            </div>
                        </div>
                    )}

                    <div className="mobile-group">
                        <button className={`mobile-group-toggle ${mobileExpanded.kick ? 'active' : ''}`}
                                onClick={() => toggleMobileSection('kick')}>
                            Kickbox <span className="arrow">›</span>
                        </button>
                        <div className={`mobile-sub-links ${mobileExpanded.kick ? 'open' : ''}`}>
                            <button onClick={() => handleMobileNavigate("/training")}>Antrenamente</button>
                        </div>
                    </div>

                    <div className="mobile-simple-links">
                        {!isLoggedIn && <button className="highlight-btn"
                                                onClick={() => handleMobileNavigate("/inscriere")}>Alătură-te
                            clubului</button>}

                        {isLoggedIn && rol !== "AntrenorExtern" && (
                            <>
                                <a href="https://sites.google.com/hwarang.ro/hwarang-info" target="_blank"
                                   rel="noreferrer">Info Generale</a>
                                <button onClick={() => handleMobileNavigate("/documente")}>Documente</button>
                            </>
                        )}
                        {(rol === "admin" || rol === "Parinte" || rol === "Sportiv" || rol === "Antrenor") && (
                            <button onClick={() => handleMobileNavigate("/concursuri")}>Concursuri</button>
                        )}
                        {rol === "Parinte" &&
                            <button onClick={() => handleMobileNavigate("/copiii-mei")}>Copiii mei</button>}
                        {rol === "admin" &&
                            <button onClick={() => handleMobileNavigate("/admin-dashboard")}>Admin Dashboard</button>}
                        {rol === "Antrenor" &&
                            <button onClick={() => handleMobileNavigate("/antrenor_dashboard")}>Panou Antrenor</button>}
                    </div>
                </div>

                {/* --- FOOTER --- */}
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
                            <div className="action"><LogoutButton/></div>
                        </div>
                    ) : (
                        <div className="mobile-auth-row">
                            <button className="btn-login"
                                    onClick={() => handleMobileNavigate("/autentificare")}>Autentificare
                            </button>
                            <button className="btn-register"
                                    onClick={() => handleMobileNavigate("/inregistrare")}>Înregistrare
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;