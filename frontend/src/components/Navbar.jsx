import React, {useEffect, useRef, useState} from "react";
import {Link, NavLink, useNavigate, useLocation} from "react-router-dom";
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

    // actualizează înălțimea în variabila CSS --nav-top
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

    // închide la ESC + blochează scroll pe body când e deschis
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

    // funcție care navighează corect (rezolvă bug-ul iOS)
    const handleNavigate = (path) => () => {
        setMenuOpen(false);
        document.body.classList.remove("nav-open");
        navigate(path);
    };

    return (
        <header ref={wrapRef}>
            <nav ref={navRef} className={`navbar ${hideNavbar ? "hide-navbar" : ""}`}>
                {/* stânga: logo */}
                <div className="navbar-flex-container">
                    <div className="logo">
                        <Link to="/acasa" aria-label="Acasă">
                            <img
                                src="/images/favicon/favicon_circle_BANNER.png"
                                alt="Logo Club"
                            />
                        </Link>
                    </div>
                </div>

                {/* buton hamburger */}
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
                >
                    <li className="dropdown">
                        <span className="menu-title text-danger">TaeKwon-Do</span>
                        <ul className="dropdown-menu">
                            <li><button onClick={handleNavigate("/acasa")}>Acasă</button></li>
                            <li><button onClick={handleNavigate("/desprenoi")}>Despre</button></li>
                            <li><button onClick={handleNavigate("/antrenori")}>Antrenori</button></li>
                            <li><button onClick={handleNavigate("/galerie")}>Galerie</button></li>
                            <li><a href="#footer" onClick={() => setMenuOpen(false)}>Contact</a></li>
                        </ul>
                    </li>

                    {isLoggedIn && (
                        <li className="dropdown">
                            <span className="menu-title">Calendar</span>
                            <ul className="dropdown-menu">
                                <li><button onClick={handleNavigate("/calendar2025")}>Calendar 2025</button></li>
                            </ul>
                        </li>
                    )}

                    <li className="dropdown">
                        <span className="menu-title">Kickbox</span>
                        <ul className="dropdown-menu">
                            <li><button onClick={handleNavigate("/training")}>Antrenamente</button></li>
                        </ul>
                    </li>

                    {!isLoggedIn && (
                        <li className="join-link">
                            <button onClick={handleNavigate("/inscriere")}>Alătură-te</button>
                        </li>
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

                    {isLoggedIn ? (
                        <li className="dropdown user-menu">
                            <button className="user-chip" aria-haspopup="true" aria-expanded="false">
                                <span className="avatar">{username[0]?.toUpperCase() || "?"}</span>
                                <span className="greet">
                                    Bine ai venit,&nbsp;<strong className="name" title={username}>{username}</strong>
                                </span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu--right">
                                <li className="dropdown-caption">
                                    Conectat ca <strong>{username}</strong>
                                </li>
                                <li className="logout-item"><LogoutButton/></li>
                            </ul>
                        </li>
                    ) : (
                        <li className="auth-links">
                            <button onClick={handleNavigate("/autentificare")}>Login</button>
                            <button onClick={handleNavigate("/inregistrare")}>Înregistrare</button>
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

            {/* backdrop */}
            <div
                className={`nav-backdrop ${menuOpen ? "show" : ""}`}
                onClick={() => setMenuOpen(false)}
            />
        </header>
    );
};

export default Navbar;
