import React, {useEffect} from "react";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Orar.css";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Divider_Why_us.css";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from "../components/Navbar";
import OrarSwiper from "../components/OrarSwiper";
import Footer from "../components/Footer";


const Home = () => {

    useEffect(() => {
        AOS.init({duration: 1000, once: true}); // 1 secundă + animare o singură dată
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


            <OrarSwiper/>

            {/*<div className="brush-divider"></div>*/}


            {/*<div data-aos="fade-down">*/}
                <section className="dece-section">
                    <h2>De ce să ne alegi pe noi?</h2>
                    <ul>
                        <li>Antrenori experimentați cu centură neagră</li>
                        <li>Cursuri pentru toate vârstele și nivelurile</li>
                        <li>Antrenamente distractive și disciplinate</li>
                        <li>Participare activă la competiții naționale și internaționale</li>
                        <li>Locație accesibilă în inima Sibiului</li>
                    </ul>
                </section>
            {/*</div>*/}

            {/*<div data-aos="flip-up">*/}
                <section className="tarife-section">
                    <h2>Tarife</h2>
                    <div className="tarife-wrapper">
                        <div className="tarif-box"><h3>Copii</h3><p>200 RON / lună</p></div>
                        <div className="tarif-box"><h3>Adulți</h3><p>250 RON / lună</p></div>
                        <div className="tarif-box"><h3>Performanță</h3><p>300 RON / lună</p></div>
                    </div>
                </section>
            {/*</div>*/}

            <Footer/>
        </>
    );
};

export default Home;