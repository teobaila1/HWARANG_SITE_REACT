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
    const [openSection, setOpenSection] = useState(null);

    const wrapRef = useRef(null);
    const navRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Ascunde bara la scroll
    const lastScrollY = useRef(typeof window !== "undefined" ? window.scrollY : 0);
    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setHideNavbar(y > lastScrollY.current && y > 50 && !menuOpen); // Nu ascunde dacă meniul e deschis
            lastScrollY.current = y;
        };
        window.addEventListener("scroll", onScroll, {passive: true});
        return () => window.removeEventListener("scroll", onScroll);
    }, [menuOpen]);

    useEffect(() => {
        setMenuOpen(false);
        setOpenSection(null);
    }, [location.pathname]);

    // Blocare scroll body
    useEffect(() => {
        if (menuOpen) document.body.classList.add("nav-open");
        else document.body.classList.remove("nav-open");
    }, [menuOpen]);

    const handleNavigate = (to) => () => {
        setMenuOpen(false);
        navigate(to);
    };

    const toggleSection = (key) => {
        setOpenSection((prev) => (prev === key ? null : key));
    };

    return (
        <header ref={wrapRef}>
            <nav ref={navRef} className={`navbar ${hideNavbar ? "hide-navbar" : ""}`}>

                {/* LOGO */}
                <div className="navbar-flex-container">
                    <div className="logo">
                        <Link to="/acasa" aria-label="Acasă">
                            <img src="/images/favicon/favicon_circle_BANNER.png" alt="Logo Club"/>
                        </Link>
                    </div>
                </div>

                {/* HAMBURGER BUTON */}
                <button
                    type="button"
                    className={`nav-toggle ${menuOpen ? "is-open" : ""}`}
                    onClick={() => setMenuOpen((v) => !v)}
                >
                    <span/><span/><span/>
                </button>

                {/* --- MENIU PRINCIPAL --- */}
                <ul className={`nav-links ${menuOpen ? "show" : ""}`}>

                    {/* 1. TAEKWON-DO */}
                    <li className={`dropdown ${openSection === "tkd" ? "open" : ""}`}>
                        <a href="#" className="menu-title text-danger" onClick={(e) => {
                            e.preventDefault();
                            toggleSection("tkd");
                        }}>
                            TaeKwon-Do
                        </a>
                        <ul className="dropdown-menu">
                            <li>
                                <button onClick={handleNavigate("/acasa")}>Acasă</button>
                            </li>
                            <li>
                                <button onClick={handleNavigate("/desprenoi")}>Despre</button>
                            </li>
                            <li>
                                <button onClick={handleNavigate("/antrenori")}>Antrenori</button>
                            </li>
                            <li>
                                <button onClick={handleNavigate("/galerie")}>Galerie</button>
                            </li>
                            <li><a href="#footer" onClick={() => setMenuOpen(false)}>Contact</a></li>
                        </ul>
                    </li>

                    {/* 2. CALENDAR */}
                    {isLoggedIn && (
                        <li className={`dropdown ${openSection === "cal" ? "open" : ""}`}>
                            <a href="#" className="menu-title" onClick={(e) => {
                                e.preventDefault();
                                toggleSection("cal");
                            }}>
                                Calendar
                            </a>
                            <ul className="dropdown-menu">
                                <li>
                                    <button onClick={handleNavigate("/calendar2025")}>Calendar 2025</button>
                                </li>
                            </ul>
                        </li>
                    )}

                    {/* 3. KICKBOX */}
                    <li className={`dropdown ${openSection === "kick" ? "open" : ""}`}>
                        <a href="#" className="menu-title" onClick={(e) => {
                            e.preventDefault();
                            toggleSection("kick");
                        }}>
                            Kickbox
                        </a>
                        <ul className="dropdown-menu">
                            <li>
                                <button onClick={handleNavigate("/training")}>Antrenamente</button>
                            </li>
                        </ul>
                    </li>

                    {/* LINK-URI SIMPLE (Fără dropdown) */}
                    {!isLoggedIn && (
                        <li className="join-link">
                            <button onClick={handleNavigate("/inscriere")}>Alătură-te</button>
                        </li>
                    )}

                    {isLoggedIn && rol !== "AntrenorExtern" && (
                        <>
                            <li>
                                <a href="https://sites.google.com/hwarang.ro/hwarang-info/pagina-de-pornire"
                                   target="_blank" rel="noreferrer">
                                    Info Generale
                                </a>
                            </li>
                            <li>
                                <button onClick={handleNavigate("/documente")}>Documente</button>
                            </li>
                        </>
                    )}

                    {(rol === "admin" || rol === "Parinte" || rol === "Sportiv" || rol === "Antrenor") && (
                        <li>
                            <button onClick={handleNavigate("/concursuri")}>Concursuri</button>
                        </li>
                    )}

                    {rol === "Parinte" && <li>
                        <button onClick={handleNavigate("/copiii-mei")}>Copiii mei</button>
                    </li>}
                    {rol === "admin" && <li>
                        <button onClick={handleNavigate("/admin-dashboard")}>Admin</button>
                    </li>}
                    {rol === "Antrenor" && <li>
                        <button onClick={handleNavigate("/antrenor_dashboard")}>Grupe</button>
                    </li>}
                    {rol === "AntrenorExtern" && <li>
                        <button onClick={handleNavigate("/concursuri-extern")}>Concursuri Ext.</button>
                    </li>}

                    {/* --- ZONA DE JOS (USER / LOGIN) --- */}
                    {isLoggedIn ? (
                        <li className="user-menu">
                            {/* Pe Desktop e Hover, Pe Mobile e Card Static */}
                            <div className="user-chip">
                                <span className="avatar">{username[0]?.toUpperCase() || "?"}</span>
                                <span className="greet">
                                    <span style={{opacity: 0.6, fontSize: '0.85em'}}>Conectat ca</span>
                                    <strong className="name">{username}</strong>
                                </span>
                            </div>

                            {/* Desktop Dropdown (ascuns pe mobil prin CSS) */}
                            <ul className="dropdown-menu dropdown-menu--right">
                                <li className="dropdown-caption">Conectat ca <strong>{username}</strong></li>
                                <li className="logout-item"><LogoutButton/></li>
                            </ul>

                            {/* Mobile Logout (vizibil doar pe mobil prin CSS) */}
                            <div className="mobile-logout-btn">
                                <LogoutButton/>
                            </div>
                        </li>
                    ) : (
                        <li className="auth-links">
                            <button onClick={handleNavigate("/autentificare")}>Login</button>
                            <button onClick={handleNavigate("/inregistrare")}>Înregistrare</button>
                        </li>
                    )}
                </ul>

                {/* Buton X pentru închidere (Mobile) */}
                <button
                    type="button"
                    className={`nav-close ${menuOpen ? "show" : ""}`}
                    onClick={() => setMenuOpen(false)}
                >
                    &times;
                </button>
            </nav>

            <div className={`nav-backdrop ${menuOpen ? "show" : ""}`} onClick={() => setMenuOpen(false)}/>
        </header>
    );
};

export default Navbar;