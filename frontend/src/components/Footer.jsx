import React from "react";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Footer.css";
import {Link} from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer" id="footer">
            <div className="map-container">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2546.268237685355!2d24.1545849!3d45.7972688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474c6785886ab2b7%3A0x344dabc416bd5c78!2sACS%20Hwarang%20Academy%20Sibiu!5e1!3m2!1sen!2sro!4v1742390268590!5m2!1sen!2sro"
                    loading="lazy"
                    allowFullScreen
                    title="Harta Hwarang"
                ></iframe>
            </div>

            <div className="footer-info">
                <p>Strada General Magheru<br/>Nr. 18<br/>Sibiu, România</p>
                <p>Contact: <strong>0770 633 848</strong></p>

                <h4 className="red-title">Urmărește-ne</h4>
                <div className="social-icons">
                    <a href="https://www.facebook.com/hwarang.sibiu" target="_blank" rel="noreferrer">
                        <img src="/images/facebook_dark.jpg" alt="Facebook"/>
                    </a>
                    <a href="https://www.instagram.com/a.c.s._hwarang_academy_sibiu/" target="_blank" rel="noreferrer">
                        <img src="/images/insta_dark.jpg" alt="Instagram"/>
                    </a>
                    <a href="https://www.tiktok.com/@a.c.s._hwarang_academy" target="_blank" rel="noreferrer">
                        <img src="/images/tiktok.png" alt="TikTok"/>
                    </a>
                </div>
            </div>

            <div className="frtkd-container">
                <Link to="https://www.facebook.com/FRTaekwondoITF">
                    <img src="/images/frtkd_poza.png" alt="FRTKD" className="frtkd-logo"/>
                </Link>
                <div className="frtkd-text">
                    <p className="frtkd-title">Federația Română de<br/>Taekwon-Do I.T.F.</p>
                </div>
            </div>

            <p className="copyright">
                © {new Date().getFullYear()} ACS HWARANG ACADEMY - Toate drepturile rezervate.
            </p>
        </footer>
    );
};

export default Footer;
