import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import LogoutButton from "./LogoutButton";
import "../../static/css/Navbar.css";
import "../../static/css/MobileMenu.css";
import MemberCard from "./MemberCard";


const API_BASE_URL = "https://backend-hwarang-new.onrender.com";

const Navbar = () => {
    const isLoggedIn = localStorage.getItem("username") !== null;
    const [rol] = useState(localStorage.getItem("rol"));
    const username = localStorage.getItem("username") || "";

    const [hideNavbar, setHideNavbar] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState({tkd: false, cal: false, kick: false});

    // --- STATE PENTRU CARD ---
    const [showMyCard, setShowMyCard] = useState(false);
    const [userData, setUserData] = useState(null);

    // --- STATE PENTRU LISTA DE COPII ---
    const [copiiList, setCopiiList] = useState([]);
    const [selectedEntity, setSelectedEntity] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();
    const lastScrollY = useRef(0);

    // 1. Initializare date utilizator curent (Adult/Părinte)
    useEffect(() => {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("user_id");
        const nume = localStorage.getItem("nume_complet") || localStorage.getItem("username");

        if (token && id) {
            const currentUser = { id, nume, type: 'user' };
            setUserData(currentUser);
            // Implicit selectăm adultul la început
            setSelectedEntity(currentUser);
        }
    }, []);

    // 2. LOGICĂ COPII (Se activează când showMyCard devine TRUE)
    useEffect(() => {
        if (showMyCard) {
            const token = localStorage.getItem("token");
            // console.log("Navbar: Cerere copii inițiată...");

            fetch(`${API_BASE_URL}/api/copiii_mei`, {
                headers: { 'x-access-token': token }
            })
            .then(res => {
                if (!res.ok) throw new Error(`Server status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                // console.log("Navbar: Date primite:", data);
                if (Array.isArray(data) && data.length > 0) {
                    setCopiiList(data);
                } else {
                    setCopiiList([]); // Resetăm dacă nu are copii
                }
            })
            .catch(err => console.error("Eroare fetch copii:", err));
        }
    }, [showMyCard]); // <--- Dependența care face totul să meargă automat

    // Logică Scroll
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

    useEffect(() => {
        setMenuOpen(false);
        setMobileExpanded({tkd: false, cal: false, kick: false});
        document.body.classList.remove("nav-open");
    }, [location.pathname]);

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
            {/* NAVBAR DESKTOP */}
            <nav className={`navbar ${hideNavbar ? "hide-navbar" : ""}`}>
                <div className="navbar-flex-container">
                    <div className="logo">
                        <Link to="/acasa" aria-label="Acasă">
                            <img src="/images/favicon/favicon_circle_BANNER.png" alt="Logo Club"/>
                        </Link>
                    </div>
                </div>

                <button type="button" className="hamburger-btn" onClick={() => setMenuOpen(true)}
                        style={{opacity: menuOpen ? 0 : 1}}>
                    <span/><span/><span/>
                </button>

                <ul className="nav-links desktop-only-nav">
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
                            <ul className="dropdown-menu">
                                <li><button onClick={() => navigate("/calendar")}>Calendar Club</button></li>
                            </ul>
                        </li>
                    )}
                    <li className="dropdown">
                        <a href="#">Kickbox</a>
                        <ul className="dropdown-menu">
                            <li><button onClick={() => navigate("/training")}>Antrenamente</button></li>
                        </ul>
                    </li>
                    {!isLoggedIn && <li className="join-link">
                        <button onClick={() => navigate("/termeni_si_conditii")}>Termeni & Condiții</button>
                    </li>}
                    {isLoggedIn && rol !== "AntrenorExtern" && (
                        <>
                            <li><a href="https://sites.google.com/hwarang.ro/hwarang-info" target="_blank" rel="noreferrer">Info</a></li>
                            <li><button onClick={() => navigate("/documente")}>Documente</button></li>
                        </>
                    )}
                    {(rol === "admin" || rol === "Parinte" || rol === "Sportiv" || rol === "Antrenor") && <li>
                        <button onClick={() => navigate("/concursuri")}>Concursuri</button>
                    </li>}
                    {(rol === "Parinte" || rol === "admin") && <li>
                        <button onClick={() => navigate("/copiii-mei")}>Copiii mei</button>
                    </li>}
                    {rol === "admin" && <li>
                        <button onClick={() => navigate("/admin-dashboard")}>Admin</button>
                    </li>}
                    {(rol === "Antrenor" || rol === "admin") && (<li>
                        <button onClick={() => navigate("/antrenor_dashboard")}>Grupe</button>
                    </li>)}

                    {isLoggedIn ? (
                        <li className="user-menu dropdown">
                            <div className="user-chip">
                                <span className="avatar">{username[0]?.toUpperCase()}</span>
                                <span className="name">{username}</span>
                            </div>
                            <ul className="dropdown-menu dropdown-menu--right user-dropdown-modern">
                                <li className="user-header">
                                    <small>Conectat ca</small>
                                    <span>{username}</span>
                                </li>
                                <div className="dropdown-divider"></div>
                                <li>
                                    <button className="btn-card-meniu mobile-menu-footer"
                                            onClick={() => setShowMyCard(true)}>
                                        Cardul Meu
                                    </button>
                                </li>
                                <div className="dropdown-divider"></div>
                                <li className="logout-li"><LogoutButton/></li>
                            </ul>
                        </li>
                    ) : (
                        <li className="auth-links-desktop">
                            <button onClick={() => navigate("/autentificare")}>Login</button>
                            <button onClick={() => navigate("/inregistrare")}>SignUp</button>
                        </li>
                    )}
                </ul>
            </nav>


            {/* ================= MENIU MOBIL ================= */}
            <div className={`mobile-overlay ${menuOpen ? "is-open" : ""}`}>
                <div className="mobile-menu-header">
                    <img src="/images/favicon/favicon_circle_BANNER.png" alt="Logo" className="mobile-logo"/>
                    <button className="mobile-close-btn" onClick={closeMenu}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"
                             strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="mobile-menu-content">
                    <div className="mobile-group">
                        <button className={`mobile-group-toggle ${mobileExpanded.tkd ? 'active' : ''}`}
                                onClick={() => toggleMobileSection('tkd')}>TaeKwon-Do <span className="arrow">›</span>
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
                                    onClick={() => toggleMobileSection('cal')}>Calendar <span className="arrow">›</span>
                            </button>
                            <div className={`mobile-sub-links ${mobileExpanded.cal ? 'open' : ''}`}>
                                <button onClick={() => handleMobileNavigate("/calendar")}>Calendar Club</button>
                            </div>
                        </div>
                    )}

                    <div className="mobile-group">
                        <button className={`mobile-group-toggle ${mobileExpanded.kick ? 'active' : ''}`}
                                onClick={() => toggleMobileSection('kick')}>Kickbox <span className="arrow">›</span>
                        </button>
                        <div className={`mobile-sub-links ${mobileExpanded.kick ? 'open' : ''}`}>
                            <button onClick={() => handleMobileNavigate("/training")}>Antrenamente</button>
                        </div>
                    </div>

                    <div className="mobile-simple-links">
                        {(rol === "admin" || rol === "Parinte" || rol === "Sportiv" || rol === "Antrenor") &&
                            <button onClick={() => handleMobileNavigate("/concursuri")}>Concursuri</button>}

                        {(rol === "Parinte" || rol === "admin") &&
                            <button onClick={() => handleMobileNavigate("/copiii-mei")}>Copiii mei</button>}

                        {rol === "admin" &&
                            <button onClick={() => handleMobileNavigate("/admin-dashboard")}>Admin</button>}

                        {(rol === "Antrenor" || rol === "admin") &&
                            <button onClick={() => handleMobileNavigate("/antrenor_dashboard")}>Grupe</button>
                        }
                    </div>
                </div>

                <div className="mobile-close-area">
                    <button className="btn-close-menu" onClick={closeMenu}>Închide Meniul</button>
                </div>

                <div className="mobile-menu-footer">
                    {isLoggedIn ? (
                        <>
                            <button
                                className="btn-card-meniu mobile-menu-footer"
                                onClick={() => {
                                    closeMenu();
                                    setShowMyCard(true);
                                }}
                            >
                                Cardul Meu
                            </button>

                            <div className="mobile-user-card">
                                <div className="info">
                                    <div className="avatar">{username[0]?.toUpperCase()}</div>
                                    <div className="text"><small>Conectat ca</small><strong>{username}</strong></div>
                                </div>
                                <div className="action"><LogoutButton/></div>
                            </div>
                        </>
                    ) : (
                        <div className="mobile-auth-row">
                            <button className="btn-login" onClick={() => handleMobileNavigate("/autentificare")}>Login</button>
                            <button className="btn-register" onClick={() => handleMobileNavigate("/inregistrare")}>SignUp</button>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODAL CARD CU SELECTOR DE PERSOANE --- */}
            {showMyCard && userData && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.9)",
                    backdropFilter: "blur(5px)",
                    display: "flex", justifyContent: "center", alignItems: "center",
                    zIndex: 10000
                }} onClick={() => setShowMyCard(false)}>

                    <div onClick={e => e.stopPropagation()} style={{animation: "fadeIn 0.3s ease", width: '100%', maxWidth: '320px'}}>

                        {/* SELECTOR: Apare DOAR dacă lista de copii nu e goală */}
                        {copiiList.length > 0 && (
                            <div style={{marginBottom: '20px', textAlign: 'center'}}>
                                <label style={{color: '#ccc', display: 'block', marginBottom: '8px', fontSize: '0.9rem'}}>
                                    Selectează persoana:
                                </label>
                                <select
                                    className="form-control"
                                    style={{
                                        width: '90%',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        backgroundColor: '#333',
                                        color: 'white',
                                        border: '1px solid #555',
                                        fontSize: '1rem',
                                        margin: '0 auto',
                                        display: 'block'
                                    }}
                                    value={selectedEntity ? selectedEntity.id : userData.id}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        // Verificăm dacă userul a selectat "Eu" (comparăm ca string să fim siguri)
                                        if (val === userData.id.toString()) {
                                            setSelectedEntity(userData);
                                        } else {
                                            // Căutăm copilul în listă
                                            const copil = copiiList.find(c => c.id.toString() === val);
                                            if (copil) setSelectedEntity({...copil, type: 'copil'});
                                        }
                                    }}
                                >
                                    <option value={userData.id}>Eu ({userData.nume})</option>
                                    {copiiList.map(c => (
                                        <option key={c.id} value={c.id}>Copil: {c.nume}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* COMPONENTA MEMBERCARD - Primește ID-ul și Numele celui selectat */}
                        <MemberCard
                            id={selectedEntity ? selectedEntity.id : userData.id}
                            nume={selectedEntity ? selectedEntity.nume : userData.nume}
                            titlu={selectedEntity && selectedEntity.type === 'copil' ? "Sportiv (Junior)" : "Membru Hwarang"}
                        />

                        <div style={{textAlign: "center", marginTop: "20px"}}>
                            <button
                                onClick={() => setShowMyCard(false)}
                                style={{
                                    background: "transparent",
                                    border: "1px solid #666",
                                    color: "#ccc",
                                    padding: "8px 20px",
                                    borderRadius: "20px",
                                    cursor: "pointer"
                                }}
                            >
                                Închide
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default Navbar;