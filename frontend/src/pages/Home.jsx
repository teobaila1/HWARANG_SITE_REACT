import React, {useEffect, useState} from "react";
import "../../static/css/Orar.css";
import "../../static/css/Divider_Why_us.css";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from "../components/Navbar";
import OrarSwiper from "../components/OrarSwiper";
import Footer from "../components/Footer";
import NextEventFeed from "../components/NextEventFeed";
import "../../static/css/FooterHome.css";
import {toast} from "react-toastify";
import MemberCard from "../components/MemberCard"; // <--- IMPORT PENTRU CARD

const Home = () => {
    // Stări pentru Cardul Digital
    const [showMyCard, setShowMyCard] = useState(false);
    const [userData, setUserData] = useState(null); // { id, nume }

    useEffect(() => {
        AOS.init({duration: 1000, once: true});
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

            {/*/!* --- BUTON FLOTANT CARD DIGITAL (Doar dacă e logat) --- *!/*/}
            {/*{userData && (*/}
            {/*    <>*/}
            {/*        <button*/}
            {/*            onClick={() => setShowMyCard(true)}*/}
            {/*            style={{*/}
            {/*                position: "fixed",*/}
            {/*                bottom: "20px",*/}
            {/*                right: "20px",*/}
            {/*                zIndex: 9999, // Z-index mare să fie peste video/footer*/}
            {/*                background: "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)", // Auriu Hwarang*/}
            {/*                color: "white",*/}
            {/*                border: "none",*/}
            {/*                borderRadius: "50px",*/}
            {/*                padding: "12px 24px",*/}
            {/*                boxShadow: "0 4px 15px rgba(0,0,0,0.6)",*/}
            {/*                display: "flex",*/}
            {/*                alignItems: "center",*/}
            {/*                gap: "10px",*/}
            {/*                cursor: "pointer",*/}
            {/*                fontWeight: "bold",*/}
            {/*                fontSize: "1rem",*/}
            {/*                transition: "transform 0.2s ease"*/}
            {/*            }}*/}
            {/*            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}*/}
            {/*            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}*/}
            {/*        >*/}
            {/*            <i className="fas fa-qrcode" style={{fontSize: "1.2rem"}}></i>*/}
            {/*            <span className="hide-mobile">Cardul Meu</span>*/}
            {/*        </button>*/}

            {/*        /!* MODAL CARD PERSONAL *!/*/}
            {/*        {showMyCard && (*/}
            {/*            <div style={{*/}
            {/*                position: "fixed", top: 0, left: 0, right: 0, bottom: 0,*/}
            {/*                backgroundColor: "rgba(0,0,0,0.9)", // Fundal întunecat*/}
            {/*                backdropFilter: "blur(5px)",*/}
            {/*                display: "flex", justifyContent: "center", alignItems: "center",*/}
            {/*                zIndex: 10000*/}
            {/*            }} onClick={() => setShowMyCard(false)}>*/}

            {/*                <div onClick={e => e.stopPropagation()} style={{animation: "fadeIn 0.3s ease"}}>*/}
            {/*                    <MemberCard*/}
            {/*                        id={userData.id}*/}
            {/*                        nume={userData.nume}*/}
            {/*                        titlu="Membru Hwarang"*/}
            {/*                    />*/}
            {/*                    <div style={{textAlign: "center", marginTop: "15px"}}>*/}
            {/*                        <button*/}
            {/*                            onClick={() => setShowMyCard(false)}*/}
            {/*                            style={{*/}
            {/*                                background: "transparent",*/}
            {/*                                border: "1px solid #666",*/}
            {/*                                color: "#ccc",*/}
            {/*                                padding: "8px 20px",*/}
            {/*                                borderRadius: "20px",*/}
            {/*                                cursor: "pointer"*/}
            {/*                            }}*/}
            {/*                        >*/}
            {/*                            Închide*/}
            {/*                        </button>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        )}*/}
            {/*    </>*/}
            {/*)}*/}

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

            <div style={{width: '100%', overflow: 'hidden', lineHeight: 0}}>
                <img
                    src="images/brush_transition/brush.png"
                    alt="Tranziție Brush"
                    style={{width: '100%', height: 'auto', display: 'block'}}
                />
            </div>

            <section id="de-ce-noi" className="why-us-v2">
                <div
                    className="why-panel"
                    onMouseMove={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
                        e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
                    }}
                >
                    <div className="why-header" data-aos="fade-up">
                        <h2>De ce să ne alegi pe noi?</h2>
                        <p>La ACS HWARANG ACADEMY, beneficiezi de:</p>
                        <div className="why-accent-line" aria-hidden/>
                    </div>

                    <div className="features-grid">
                        <article className="feature-card" data-aos="fade-up" data-aos-delay="50" tabIndex={0}>
                            <div className="icon-wrap"><i className="fas fa-user-ninja"/></div>
                            <h3>Antrenori experimentați</h3>
                            <p>Centură neagră & rezultate internaționale dovedite</p>
                        </article>

                        <article className="feature-card" data-aos="fade-up" data-aos-delay="100" tabIndex={0}>
                            <div className="icon-wrap"><i className="fas fa-users"/></div>
                            <h3>Grupe pentru toate vârstele</h3>
                            <p>De la copii la adulți și sportivi de performanță</p>
                        </article>

                        <article className="feature-card" data-aos="fade-up" data-aos-delay="150" tabIndex={0}>
                            <div className="icon-wrap"><i className="fas fa-dumbbell"/></div>
                            <h3>Antrenamente dinamice</h3>
                            <p>Mediu disciplinat, dar prietenos și motivant</p>
                        </article>

                        <article className="feature-card" data-aos="fade-up" data-aos-delay="200" tabIndex={0}>
                            <div className="icon-wrap"><i className="fas fa-medal"/></div>
                            <h3>Competiții & progres</h3>
                            <p>Participare la concursuri și susținere reală în evoluția ta</p>
                        </article>

                        <article className="feature-card" data-aos="fade-up" data-aos-delay="250" tabIndex={0}>
                            <div className="icon-wrap"><i className="fas fa-map-marker-alt"/></div>
                            <h3>Locație centrală</h3>
                            <p>În Sibiu, ușor accesibilă din orice zonă</p>
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

            <div style={{width: '100%', overflow: 'hidden', lineHeight: 0}}>
                <img
                    src="images/brush_transition/brush_invers.png"
                    alt="Tranziție Brush"
                    style={{width: '100%', height: 'auto', display: 'block'}}
                />
            </div>

            <Footer/>
        </>
    );
};

export default Home;