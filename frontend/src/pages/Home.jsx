import React, {useEffect} from "react";
import "../../static/css/Orar.css";
import "../../static/css/Divider_Why_us.css";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from "../components/Navbar";
import OrarSwiper from "../components/OrarSwiper";
import Footer from "../components/Footer";
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
                    <source src="/static/videos/hwarang.mp4" type="video/mp4"/>
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
            <section className="why-us-section">
                <h2 className="why-us-title">De ce să ne alegi pe noi?</h2>
                <h3 className="justification">La ACS HWARANG ACADEMY, beneficiezi de:</h3>
                <div className="why-us-items">
                    <div className="why-us-card">
                        <i className="fas fa-user-ninja"></i>
                        <p>Antrenori experimentați, cu centură neagră și rezultate internaționale</p>
                    </div>
                    <div className="why-us-card">
                        <i className="fas fa-users"></i>
                        <p>Grupe pentru toate vârstele, de la copii la adulți și sportivi de performanță</p>
                    </div>
                    <div className="why-us-card">
                        <i className="fas fa-dumbbell"></i>
                        <p>Antrenamente dinamice, într-un mediu disciplinat, dar prietenos</p>
                    </div>
                    <div className="why-us-card">
                        <i className="fas fa-medal"></i>
                        <p>Participare activă la competiții naționale, internaționale și susținere reală în evoluția
                            ta</p>
                    </div>
                    <div className="why-us-card">
                        <i className="fas fa-map-marker-alt"></i>
                        <p>Locație centrală în Sibiu, ușor accesibilă</p>
                    </div>
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
                    src="images//brush_transition/brush_invers.png"
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