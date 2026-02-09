import React, {useEffect, useState} from "react";
import "../../static/css/Orar.css";
import "../../static/css/Divider_Why_us.css";
import "../../static/css/FooterHome.css";
import "../../static/css/Home.css"; // <--- IMPORTĂM NOUL FIȘIER CSS AICI
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from "../components/Navbar";
import OrarSwiper from "../components/OrarSwiper";
import Footer from "../components/Footer";
import NextEventFeed from "../components/NextEventFeed";
import {toast} from "react-toastify";
import MemberCard from "../components/MemberCard";

const Home = () => {
    // Stări pentru Cardul Digital
    const [userData, setUserData] = useState(null); // { id, nume }

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 0, // <--- IMPORTANT: Declasăm animația imediat, nu așteptăm scroll mult
            mirror: false,
            // Opțional: poți scoate comentariul de mai jos dacă vrei să dezactivezi animațiile complet pe mobil pentru stabilitate maximă
            disable: window.innerWidth < 950
        });
        window.history.pushState(null, "", window.location.href);
        const handlePop = () => {
            window.history.pushState(null, "", window.location.href);
        };
        window.addEventListener("popstate", handlePop);

        // --- VERIFICARE LOGIN PENTRU CARD ---
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("user_id");
        const nume = localStorage.getItem("nume_complet") || localStorage.getItem("username");

        if (token && id) {
            setUserData({ id, nume });
        }

        return () => window.removeEventListener("popstate", handlePop);
    }, []);

    return (
        <>
            <Navbar/>

            <NextEventFeed />

            {/* --- BUTON FLOTANT WHATSAPP --- */}
            {/* Stilurile sunt acum în Home.css clasa .whatsapp-float */}
            <a
                href="https://wa.me/40770633848?text=Bună%20ziua!%20Vreau%20să%20mă%20înscriu%20la%20un%20antrenament%20gratuit."
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-float"
            >
                <i className="fab fa-whatsapp" style={{fontSize: '24px'}}></i>
                <span className="whatsapp-text">Antrenament Gratuit</span>
            </a>

            {/* --- HERO SECTION (Rămas neschimbat) --- */}
            <div className="video-container">
                <video autoPlay muted loop playsInline id="bg-video" poster="/images/hero_poster.jpg">
                    <source src="/video/hwarang.mp4" type="video/mp4"/>
                </video>
                <div className="video-overlay"/>
                <div className="video-gradient" aria-hidden/>
                <div className="video-noise" aria-hidden/>

                <div className="hero-copy">
                    <h1>ACS Hwarang Academy Sibiu</h1>
                    <p>Respect. Integritate. Perseverență. Autocontrol. Spirit de luptă neînfricat.</p>
                    <div className="hero-cta">
                        <a href="/galerie" className="btn btn-primary">Vezi atmosfera</a>
                        <a href="/inregistrare" className="btn btn-ghost">Haide in echipa noastră</a>
                    </div>
                </div>
                <div className="video-spacer"/>
            </div>

            <div className="fade-transition"></div>

            <div data-aos="fade-up">
                <OrarSwiper/>
            </div>

            {/* --- TRANZIȚIE BRUSH --- */}
            <div style={{width: '100%', overflow: 'hidden', lineHeight: 0}}>
                <img
                    src="images/brush_transition/brush.png"
                    alt="Tranziție Brush"
                    style={{width: '100%', height: 'auto', display: 'block'}}
                />
            </div>

            {/* --- SECȚIUNEA "DE CE NOI" --- */}
            <section id="de-ce-noi" className="why-us-v2">
                <div
                    className="why-panel"
                    onMouseMove={(e) => {
                        // Această logică rămâne inline deoarece este dinamică (JS)
                        const r = e.currentTarget.getBoundingClientRect();
                        e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
                        e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
                    }}
                >
                    <div className="why-header" data-aos="fade-up">
                        <h2>Mai mult decât un club. O familie.</h2>
                        <p>Valorile care ne definesc și rezultatele care ne recomandă:</p>
                        <div className="why-accent-line" aria-hidden/>
                    </div>

                    <div className="features-grid">
                        {/* 1. FAMILIE */}
                        <article className="feature-card" data-aos="fade-up" data-aos-delay="50" tabIndex={0}>
                            <div className="icon-wrap"><i className="fas fa-heart"/></div>
                            <h3>Hwarang este o Familie</h3>
                            <p>Un mediu unit unde părinții și copiii cresc împreună. Evenimente și antrenamente comune.</p>
                        </article>

                        {/* 2. VALORI / EDUCAȚIE */}
                        <article className="feature-card" data-aos="fade-up" data-aos-delay="100" tabIndex={0}>
                            <div className="icon-wrap"><i className="fas fa-brain"/></div>
                            <h3>Educație & Caracter</h3>
                            <p>Discipline, Respect, Autocontrol. Învățăm gestionarea emoțiilor și încrederea în sine.</p>
                        </article>

                        {/* 3. REZULTATE */}
                        <article className="feature-card" data-aos="fade-up" data-aos-delay="150" tabIndex={0}>
                            <div className="icon-wrap"><i className="fas fa-trophy"/></div>
                            <h3>Rezultate Dovedite</h3>
                            <p>Istoric de campioni. Medalii naționale și internaționale obținute de sportivii noștri.</p>
                        </article>

                        {/* 4. SANATATE */}
                        <article className="feature-card" data-aos="fade-up" data-aos-delay="200" tabIndex={0}>
                            <div className="icon-wrap"><i className="fas fa-heartbeat"/></div>
                            <h3>Healthy Lifestyle</h3>
                            <p>Dezvoltare fizică armonioasă, mobilitate și un stil de viață sănătos pe termen lung.</p>
                        </article>

                        {/* 5. EXPERIENTA */}
                        <article className="feature-card" data-aos="fade-up" data-aos-delay="250" tabIndex={0}>
                            <div className="icon-wrap"><i className="fas fa-user-ninja"/></div>
                            <h3>Antrenori de Top</h3>
                            <p>25+ ani experiență. Îndrumare profesionistă de la centuri negre cu palmares bogat.</p>
                        </article>
                    </div>

                    <ul className="quick-stats" data-aos="zoom-in" data-aos-delay="250">
                        <li><span>25+</span> ani experiență</li>
                        <li><span>120+</span> sportivi activi</li>
                    </ul>

                    <div className="spotlight" aria-hidden/>
                    <div className="grid-overlay" aria-hidden/>
                </div>
            </section>

            {/* --- TRANZIȚIE BRUSH INVERS --- */}
            <div style={{width: '100%', overflow: 'hidden', lineHeight: 0}}>
                <img
                    src="images/brush_transition/brush_invers.png"
                    alt="Tranziție Brush"
                    style={{width: '100%', height: 'auto', display: 'block'}}
                />
            </div>

            {/* --- SECȚIUNE ABONAMENTE & COSTURI --- */}
            <section className="tarife-section">
                <div className="tarife-container" data-aos="fade-up">

                    <h2 className="tarife-title">
                        Abonamente & Costuri
                    </h2>
                    <p className="tarife-subtitle">
                        <span className="tarife-highlight-text">Prima ședință este GRATUITĂ!</span>
                    </p>

                    <div className="tarife-cards-wrapper">

                        {/* CARD INFO GRUPE */}
                        <div className="tarife-card">
                            <div className="card-header">
                                <div className="icon-circle">
                                    <i className="fas fa-info-circle"></i>
                                </div>
                                <h3 className="card-title">Info Grupe</h3>
                            </div>

                            <ul className="card-list info-list">
                                <li>
                                    <strong className="list-label">Grupa Mică (4-10 ani)</strong>
                                    Inițiere, jocuri motrice, disciplină de bază.
                                </li>
                                <li>
                                    <strong className="list-label">Juniori (11-18 ani)</strong>
                                    Tehnică Taekwon-Do, condiție fizică, pregătire pentru centuri.
                                </li>
                                <li style={{borderBottom: 'none'}}>
                                    <strong className="list-label">Avansați & Seniori</strong>
                                    Luptă, autoapărare, performanță sportivă.
                                </li>
                            </ul>
                            <p className="card-note">
                                *Vezi orarul detaliat mai sus.
                            </p>
                        </div>

                        {/* CARD ABONAMENT (Highlited) */}
                        <div className="tarife-card highlight">
                            <div className="recomandat-badge">
                                RECOMANDAT
                            </div>

                            <div>
                                <h3 className="card-title" style={{marginBottom: '10px'}}>Abonament Lunar</h3>
                                <p className="price-desc">Investește în disciplina și sănătatea copilului tău</p>

                                <div className="price-amount">
                                    200 <span className="price-currency">RON / lună</span>
                                </div>

                                <ul className="card-list">
                                    <li><i className="fas fa-check-circle check-icon"></i> 2 Antrenamente/săptămână</li>
                                    <li><i className="fas fa-check-circle check-icon"></i> Evaluări periodice</li>
                                    <li><i className="fas fa-check-circle check-icon"></i> Atmosferă de familie</li>
                                    <li><i className="fas fa-check-circle check-icon"></i> Dezvoltare fizică și psihică</li>
                                </ul>
                            </div>

                            <a href="/inregistrare" className="tarife-btn">
                                Vreau să mă înscriu
                            </a>
                        </div>

                    </div>
                </div>
            </section>

            <Footer/>
        </>
    );
};

export default Home;