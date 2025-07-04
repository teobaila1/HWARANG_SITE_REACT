import React, {useEffect, useState} from "react";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Navbar.css";
import LogoutButton from "./LogoutButton";
import {Link, NavLink} from "react-router-dom";

const Navbar = () => {
    const isLoggedIn = localStorage.getItem("username") !== null;
    const [rol, setRol] = useState(null);
    const username = localStorage.getItem("username");
    const [hideNavbar, setHideNavbar] = useState(false);
    let lastScrollY = window.scrollY;


    useEffect(() => {
        const storedRol = localStorage.getItem("rol");
        setRol(storedRol);
    }, []);


    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setHideNavbar(true); // scroll down
            } else {
                setHideNavbar(false); // scroll up
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    return (
        <header>
            <nav className={`navbar ${hideNavbar ? "hide-navbar" : ""}`}>
                <div className="navbar-flex-container">
                    <div className="logo">
                        <Link to="/acasa">
                            <img src="/images/favicon_circle_BANNER.png" alt="Logo Club"/>
                        </Link>
                    </div>

                    {username && (
                        <div className="welcome-text">
                            Bine ai venit, <strong>{username}</strong>
                        </div>
                    )}
                </div>
                <ul className="nav-links">
                    <li className="dropdown">
                        <a className="text-danger" href="#">TaeKwon-Do</a>
                        <ul className="dropdown-menu">
                            <li><a href="/acasa">Acasă</a></li>
                            <li><a href="/desprenoi">Despre</a></li>
                            <li><a href="/antrenori">Antrenori</a></li>
                            <li><a href="#">Galerie</a></li>
                            <li><a href="#footer">Contact</a></li>
                        </ul>
                    </li>

                    {isLoggedIn && (
                        <li className="dropdown">
                            <a>Calendar</a>
                            <ul className="dropdown-menu">
                                <li><a href="/calendar2025">Calendar 2025</a></li>
                            </ul>
                        </li>
                    )}

                    <li className="dropdown">
                        <a href="#">Kickbox</a>
                        <ul className="dropdown-menu">
                            <li><a href="#">Antrenamente</a></li>
                        </ul>
                    </li>

                    {!isLoggedIn &&
                        <li className="join-link"><a href="/inscriere">Alătură-te</a></li>
                    }

                    {isLoggedIn && <li><a href="#">Regulamente</a></li>}

                    <li>
                        {isLoggedIn && <li><a href="/documente">Documente</a></li>}
                    </li>


                    {rol === "admin" ? (
                        <li><a href="/concursuri">Concursuri</a></li>
                    ) : null}

                    {rol === "Parinte" || rol === "Sportiv" || rol === "Antrenor" ? (
                        <li><a href="/concursuri">Înscriere concursuri</a></li>
                    ) : null}


                    {/* Doar pentru părinți */}
                    {rol === "Parinte" && (
                        <Link to="/copiii-mei">Copiii mei</Link>
                    )}


                    {rol === "admin" && <li><Link to="/admin-dashboard">Admin</Link></li>}


                    {rol === "Antrenor" && (
                        <li><Link to="/antrenor_dashboard">Meniu</Link></li>
                    )}


                    {rol === "AntrenorExtern" && (
                        <li><Link to="/concursuri-extern">Concursuri</Link></li>
                    )}


                    {rol && (
                        <li>
                            <LogoutButton/>
                        </li>
                    )}

                    {!isLoggedIn && (
                        <>
                            <li><Link to="/autentificare">Login</Link></li>
                            <li><Link to="/inregistrare">Înregistrare</Link></li>
                            {/*<li><Link to="/inregistrare-extern">Antrenor Extern</Link></li>*/}
                        </>
                    )}


                    {/*{rol !== 'AntrenorExtern' && (*/}
                    {/*    <>*/}
                    {/*        <NavLink to="/admin_dashboard">Admin Dashboard</NavLink>*/}
                    {/*        <NavLink to="/antrenor_dashboard">Antrenor Dashboard</NavLink>*/}
                    {/*        <NavLink to="/registerForm">Înregistrare</NavLink>*/}
                    {/*        /!* Alte linkuri specifice altor roluri *!/*/}
                    {/*    </>*/}
                    {/*)}*/}


                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
