import React, {useEffect, useState, useRef} from "react";
import {Link, NavLink, useLocation} from "react-router-dom";
import LogoutButton from "./LogoutButton";
import "../../static/css/Navbar.css";

const Navbar = () => {
    const isLoggedIn = localStorage.getItem("username") !== null;
    const [rol, setRol] = useState(null);
    const username = localStorage.getItem("username") || "";
    const [hideNavbar, setHideNavbar] = useState(false);

    // NEW: control pentru hamburger
    const [menuOpen, setMenuOpen] = useState(false);
    const wrapRef = useRef(null);
    const location = useLocation();
    const navRef = useRef(null);

    useEffect(() => {
        const storedRol = localStorage.getItem("rol");
        setRol(storedRol);
    }, []);

    // închide meniul când se schimbă ruta
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    let lastScrollY = useRef(window.scrollY);
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
                setHideNavbar(true);
            } else {
                setHideNavbar(false);
            }
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // click în afara meniului = close
    useEffect(() => {
        const onDoc = (e) => {
            if (!wrapRef.current) return;
            if (!wrapRef.current.contains(e.target)) setMenuOpen(false);
        };
        if (menuOpen) document.addEventListener("click", onDoc);
        return () => document.removeEventListener("click", onDoc);
    }, [menuOpen]);


    useEffect(() => {
        const setTop = () => {
            if (!navRef.current) return;
            const h = navRef.current.getBoundingClientRect().height;
            document.documentElement.style.setProperty("--nav-top", `${Math.ceil(h)}px`);
        };
        setTop();
        const ro = new ResizeObserver(setTop);
        if (navRef.current) ro.observe(navRef.current);
        window.addEventListener("resize", setTop);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", setTop);
        };
    }, []);

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

                {/* buton hamburger (vizibil pe mobil) */}
                <button
                    className={`nav-toggle ${menuOpen ? "is-open" : ""}`}
                    aria-label="Deschide meniul"
                    aria-expanded={menuOpen}
                    aria-controls="primary-menu"
                    onClick={() => setMenuOpen(v => !v)}
                >
                    <span/><span/><span/>
                </button>

                {/* dreapta: linkuri */}
                <ul id="primary-menu" className={`nav-links ${menuOpen ? "show" : ""}`}>
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

                    {isLoggedIn && <li><NavLink to="/regulamente">Regulamente</NavLink></li>}

                    {isLoggedIn && rol !== "AntrenorExtern" && (
                        <li><NavLink to="/documente">Documente</NavLink></li>
                    )}

                    {(rol === "admin" || rol === "Parinte" || rol === "Sportiv" || rol === "Antrenor") && (
                        <li><NavLink to="/concursuri">Concursuri</NavLink></li>
                    )}

                    {rol === "Parinte" && (
                        <li><NavLink to="/copiii-mei">Copiii mei</NavLink></li>
                    )}

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
                                <li className="dropdown-caption">
                                    Conectat ca <strong>{username}</strong>
                                </li>
                                <li className="logout-item">
                                    <LogoutButton/>
                                </li>
                            </ul>
                        </li>
                    ) : (
                        <li className="auth-links">
                            <NavLink to="/autentificare">Login</NavLink>
                            <NavLink to="/inregistrare">Înregistrare</NavLink>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
