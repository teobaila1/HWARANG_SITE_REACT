import React, {useEffect} from "react";
import "../../static/css/Orar.css";
import "../../static/css/Divider_Why_us.css";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from "../components/Navbar";
import OrarSwiper from "../components/OrarSwiper";
import Footer from "../components/Footer";
import "../../static/css/FooterHome.css";
import {toast} from "react-toastify";


const Home = () => {

    useEffect(() => {
        AOS.init({duration: 1000, once: true}); // 1 secundă + animare o singură dată
        window.history.pushState(null, "", window.location.href);
        const handlePop = () => {
            window.history.pushState(null, "", window.location.href);
        };
        window.addEventListener("popstate", handlePop);
        return () => window.removeEventListener("popstate", handlePop);
    }, []);

    return (
        <>
            <Navbar/>

            <div className="video-container">
                <video autoPlay muted loop id="bg-video">
                    <source src="/video/hwarang.mp4" type="video/mp4"/>
                </video>
                <div className="video-overlay"/>
                <div className="video-spacer"/>
                {/* ADĂUGAT pentru a da spațiu dedesubt */}
            </div>

            <div className="fade-transition"></div>

            <div data-aos="fade-up">
                <OrarSwiper/>
            </div>
            {/*<div className="brush-divider"></div>*/}

            {/* Tranziție cu imagine */}
            <div style={{width: '100%', overflow: 'hidden', lineHeight: 0}}>
                <img
                    src="images/brush_transition/brush.png"
                    alt="Tranziție Brush"
                    style={{width: '100%', height: 'auto', display: 'block'}}
                />
            </div>


            {/*<div data-aos="fade-down">*/}
            {/* WHY US — v2 */}
            {/* WHY US — v2 (blend cu fundalul paginii) */}
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
                            <p>Centură neagră & rezultate internaționale dovedite.</p>
                        </article>

                        <article className="feature-card" data-aos="fade-up" data-aos-delay="100" tabIndex={0}>
                            <div className="icon-wrap"><i className="fas fa-users"/></div>
                            <h3>Grupe pentru toate vârstele</h3>
                            <p>De la copii la adulți și sportivi de performanță.</p>
                        </article>

                        <article className="feature-card" data-aos="fade-up" data-aos-delay="150" tabIndex={0}>
                            <div className="icon-wrap"><i className="fas fa-dumbbell"/></div>
                            <h3>Antrenamente dinamice</h3>
                            <p>Mediu disciplinat, dar prietenos și motivant.</p>
                        </article>

                        <article className="feature-card" data-aos="fade-up" data-aos-delay="200" tabIndex={0}>
                            <div className="icon-wrap"><i className="fas fa-medal"/></div>
                            <h3>Competiții & progres</h3>
                            <p>Participare la concursuri și susținere reală în evoluția ta.</p>
                        </article>

                        <article className="feature-card" data-aos="fade-up" data-aos-delay="250" tabIndex={0}>
                            <div className="icon-wrap"><i className="fas fa-map-marker-alt"/></div>
                            <h3>Locație centrală</h3>
                            <p>În Sibiu, ușor accesibilă din orice zonă.</p>
                        </article>
                    </div>

                    <ul className="quick-stats" data-aos="zoom-in" data-aos-delay="250">
                        <li><span>15+</span> ani experiență</li>
                        <li><span>120+</span> sportivi activi</li>
                        <li><span>40+</span> medalii/an</li>
                    </ul>

                    <div className="spotlight" aria-hidden/>
                    <div className="grid-overlay" aria-hidden/>
                </div>
            </section>

            {/*</div>*/}

            {/*/!*<div data-aos="flip-up">*!/*/}
            {/*<section className="tarife-section">*/}
            {/*    <h2 className="tarife-title">Tarife</h2>*/}
            {/*    <div className="tarife-cards">*/}
            {/*        <div className="tarif-card">*/}
            {/*            <i className="fas fa-child"></i>*/}
            {/*            <h3>Copii</h3>*/}
            {/*            <p>200 RON / lună</p>*/}
            {/*        </div>*/}
            {/*        <div className="tarif-card">*/}
            {/*            <i className="fas fa-user"></i>*/}
            {/*            <h3>Adulți</h3>*/}
            {/*            <p>200 RON / lună</p>*/}
            {/*        </div>*/}
            {/*        <div className="tarif-card">*/}
            {/*            <i className="fas fa-trophy"></i>*/}
            {/*            <h3>Performanță</h3>*/}
            {/*            <p>200 RON / lună</p>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}
            {/*/!*</div>*!/*/}

            <div style={{width: '100%', overflow: 'hidden', lineHeight: 0}}>
                <img
                    src="images/brush_transition/brush_invers.png"
                    alt="Tranziție Brush"
                    style={{width: '100%', height: 'auto', display: 'block'}}
                />
            </div>

            {/*import {toast} from "react-toastify";*/}

            {/*<button onClick={() => toast("Ping!")}>Test toast</button>*/}

            <Footer/>
        </>
    );
};

export default Home;