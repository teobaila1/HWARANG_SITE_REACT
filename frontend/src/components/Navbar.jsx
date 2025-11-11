import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import LogoutButton from "./LogoutButton";
import "../../static/css/Navbar.css";

const Navbar = () => {
    const isLoggedIn = localStorage.getItem("username") !== null;
    const [rol] = useState(localStorage.getItem("rol"));
    const username = localStorage.getItem("username") || "";

    const [hideNavbar, setHideNavbar] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [openSection, setOpenSection] = useState(null); // acordeon pe mobil: "tkd" | "cal" | "kick" | null

    const wrapRef = useRef(null);
    const navRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    // ascunde/arată navbar la scroll
    const lastScrollY = useRef(typeof window !== "undefined" ? window.scrollY : 0);
    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setHideNavbar(y > lastScrollY.current && y > 50);
            lastScrollY.current = y;
        };
        window.addEventListener("scroll", onScroll, {passive: true});
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // setează --nav-top = înălțimea reală a barei
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
    useEffect(() => {
        setMenuOpen(false);
        setOpenSection(null);
    }, [location.pathname]);

    // închide la click în afara navbar-ului
    useEffect(() => {
        const onDocClick = (e) => {
            if (!menuOpen) return;
            if (!wrapRef.current?.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener("click", onDocClick);
        return () => document.removeEventListener("click", onDocClick);
    }, [menuOpen]);

    // ESC + blochează scroll pe body când e deschis
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") setMenuOpen(false);
        };
        document.addEventListener("keydown", onKey);
        if (menuOpen) document.body.classList.add("nav-open");
        else document.body.classList.remove("nav-open");
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.classList.remove("nav-open");
        };
    }, [menuOpen]);

    // helper sigur de navigație (rezolvă tap pe iOS)
    const handleNavigate = (to) => () => {
        setMenuOpen(false);
        setOpenSection(null);
        document.body.classList.remove("nav-open");
        navigate(to);
    };

    // toggle pentru secțiuni (acordeon: doar una deschisă)
    const toggleSection = (key) => {
        setOpenSection((prev) => (prev === key ? null : key));
    };

    return (
        <header ref={wrapRef}>
            <nav ref={navRef} className={`navbar ${hideNavbar ? "hide-navbar" : ""}`}>
                {/* stânga: logo */}
                <div className="navbar-flex-container">
                    <div className="logo">
                        <Link to="/acasa" aria-label="Acasă">
                            <img src="/images/favicon/favicon_circle_BANNER.png" alt="Logo Club"/>
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
                    <span/><span/><span/>
                </button>

                {/* MENIU */}
                <ul
                    id="primary-menu"
                    className={`nav-links ${menuOpen ? "show" : ""}`}
                    aria-hidden={!menuOpen}
                    onClick={(e) => {
                        // închide panoul doar când se apasă pe un link real (nu pe titlurile de secțiune data-keep)
                        const a = e.target.closest("a,button");
                        if (!a) return;
                        if (a.dataset.keep === "true") return;
                        // pentru ancore interne tratăm în handleNavigate; aici nu forțăm nimic
                    }}
                >
                    {/* ===== TAEKWON-DO (acordeon) ===== */}
                    <li className={`dropdown ${openSection === "tkd" ? "open" : ""}`}>
                        {/* titlu-secțiune: arată ca link, nu navighează; doar toggle */}
                        <a
                            href="#"
                            className="menu-title text-danger"
                            role="button"
                            aria-expanded={openSection === "tkd"}
                            aria-controls="tkd-submenu"
                            data-keep="true"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleSection("tkd");
                            }}
                        >
                            TaeKwon-Do
                        </a>

                        <ul id="tkd-submenu" className="dropdown-menu">
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

                    {/* ===== CALENDAR (doar logat) ===== */}
                    {isLoggedIn && (
                        <li className={`dropdown ${openSection === "cal" ? "open" : ""}`}>
                            <a
                                href="#"
                                className="menu-title"
                                role="button"
                                aria-expanded={openSection === "cal"}
                                aria-controls="cal-submenu"
                                data-keep="true"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleSection("cal");
                                }}
                            >
                                Calendar
                            </a>
                            <ul id="cal-submenu" className="dropdown-menu">
                                <li>
                                    <button onClick={handleNavigate("/calendar2025")}>Calendar 2025</button>
                                </li>
                            </ul>
                        </li>
                    )}

                    {/* ===== KICKBOX ===== */}
                    <li className={`dropdown ${openSection === "kick" ? "open" : ""}`}>
                        <a
                            href="#"
                            className="menu-title"
                            role="button"
                            aria-expanded={openSection === "kick"}
                            aria-controls="kick-submenu"
                            data-keep="true"
                            onClick={(e) => {
                                e.preventDefault();
                                toggleSection("kick");
                            }}
                        >
                            Kickbox
                        </a>
                        <ul id="kick-submenu" className="dropdown-menu">
                            <li>
                                <button onClick={handleNavigate("/training")}>Antrenamente</button>
                            </li>
                        </ul>
                    </li>

                    {/* ===== Alătură-te ===== */}
                    {!isLoggedIn && (
                        <li className="join-link">
                            <button onClick={handleNavigate("/inscriere")}>Alătură-te</button>
                        </li>
                    )}

                    {/* ===== Diverse după rol ===== */}
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
                        <button onClick={handleNavigate("/concursuri-extern")}>Concursuri</button>
                    </li>}

                    {/* ===== User / Auth ===== */}
                    {isLoggedIn ? (
                        <>
                            <li className="dropdown user-menu">
                                <button className="user-chip" aria-haspopup="true" aria-expanded="false"
                                        data-keep="true">
                                    <span className="avatar">{username[0]?.toUpperCase() || "?"}</span>
                                    <span className="greet">
          Bine ai venit,&nbsp;<strong className="name" title={username}>{username}</strong>
        </span>
                                </button>
                                <ul className="dropdown-menu dropdown-menu--right">
                                    <li className="dropdown-caption">Conectat ca <strong>{username}</strong></li>
                                    <li className="logout-item"><LogoutButton/></li>
                                </ul>
                            </li>

                            {/* === Logout DOAR pe mobil (în drawer), SIBLING, nu în dropdown === */}
                            <li className="logout-item mobile-only">
                                <LogoutButton/>
                            </li>
                        </>
                    ) : (
                        <li className="auth-links">
                            <button onClick={handleNavigate("/autentificare")}>Login</button>
                            <button onClick={handleNavigate("/inregistrare")}>Înregistrare</button>
                        </li>
                    )}
                </ul>

                {/* buton închidere (mobil) */}
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
