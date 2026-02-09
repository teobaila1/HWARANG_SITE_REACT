// src/pages/Kickboxing.jsx
import React from "react";
import Navbar from "../components/Navbar";
import "../../static/css/About.css"; // Refolosim stilurile din About
import FooterKickbox from "../components/FooterKickbox";

const Kickboxing = () => {

    return (
        <>
            <Navbar/>

            <section className="about-section">

                {/* --- HERO TITLE --- */}
                <h1 className="about-title">Kickboxing - Champions K1</h1>

                {/* --- HERO IMAGE --- */}
                <picture className="hero-wrap">
                    <img
                        src="/images/people/echipakickbox.jpg"
                        alt="Kickboxing la Champions K1 Sibiu"
                        loading="lazy"
                        className="hero-img"
                    />
                </picture>

                {/* --- INTRO TEXT --- */}
                <div className="about-paragraph">
                    <p>
                        Antrenamentele de <strong>Kickboxing</strong> la <strong>Champions K1 Sibiu</strong> sunt
                        mult mai mult decât simple exerciții fizice. Sunt o combinație explozivă de tehnică,
                        disciplină mentală și condiționare fizică extremă.
                    </p>
                    <p>
                        Sub îndrumarea antrenorului <strong>Răzvan Tudor</strong>, pregătim sportivi pentru
                        competiții de top (Galele Dynamite Fighting Show), dar oferim și un mediu excelent
                        pentru cei care vor doar să se mențină în formă și să învețe autoapărare.
                    </p>
                </div>

                {/* --- 1. FOCUS POINTS (Refolosim .values-grid din About.css) --- */}
                {/* Asta face pagina vizuală și ușor de citit */}
                <h1 className="about-title">Ce vei antrena?</h1>
                <div className="values-grid">
                    <div className="value-card">
                        <i className="fas fa-fist-raised" style={{color: "#ff1a1a"}}></i>
                        <h3>Tehnică Striking</h3>
                        <p>Loviture de braț și picior, deplasare, eschive și combinații fluide.</p>
                    </div>
                    <div className="value-card">
                        <i className="fas fa-heartbeat" style={{color: "#ff1a1a"}}></i>
                        <h3>Condiție Fizică</h3>
                        <p>Cardio intens, circuite de forță și explozie. Vei arde calorii garantat.</p>
                    </div>
                    <div className="value-card">
                        <i className="fas fa-user-shield" style={{color: "#ff1a1a"}}></i>
                        <h3>Sparring Controlat</h3>
                        <p>Aplicarea tehnicilor în luptă, într-un mediu sigur, cu protecții complete.</p>
                    </div>
                </div>

                {/* --- 2. ORAR --- */}
                <h1 className="about-title">Orar Antrenamente</h1>
                <div className="about-paragraph">
                    <ul style={{listStyle: "none", paddingLeft: 0, margin: 0}}>
                        {/* Luni */}
                        <li style={liStyle}>
                            <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
                                <i className="far fa-calendar-alt" style={{color:"#ff1a1a"}}></i>
                                <strong style={dayStyle}>Luni</strong>
                            </div>
                            <div style={timesWrapStyle}>
                                <span style={chipStyle}>19:00 – 20:15</span>
                                <span style={chipStyle}>20:15 – 21:30</span>
                            </div>
                        </li>

                        {/* Miercuri */}
                        <li style={liStyle}>
                            <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
                                <i className="far fa-calendar-alt" style={{color:"#ff1a1a"}}></i>
                                <strong style={dayStyle}>Miercuri</strong>
                            </div>
                            <div style={timesWrapStyle}>
                                <span style={chipStyle}>19:00 – 20:15</span>
                                <span style={chipStyle}>20:15 – 21:30</span>
                            </div>
                        </li>

                        {/* Vineri */}
                        <li style={liStyle}>
                            <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
                                <i className="far fa-calendar-alt" style={{color:"#ff1a1a"}}></i>
                                <strong style={dayStyle}>Vineri</strong>
                            </div>
                            <div style={timesWrapStyle}>
                                <span style={chipStyle}>18:00 – 19:30</span>
                            </div>
                        </li>

                        {/* Duminica */}
                        <li style={liStyle}>
                            <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
                                <i className="far fa-calendar-alt" style={{color:"#ff1a1a"}}></i>
                                <strong style={dayStyle}>Duminică</strong>
                            </div>
                            <div style={timesWrapStyle}>
                                <span style={chipStyle}>14:00 – 15:00</span>
                            </div>
                        </li>

                    </ul>
                </div>

                {/* --- 3. MEMBERSHIP CARD & ECHIPAMENT (Layout Split) --- */}
                <div style={{display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "40px", justifyContent: "center"}}>

                    {/* Abonament & Card */}
                    <div style={{...infoCardStyle, border: "1px solid #ff1a1a", background: "linear-gradient(145deg, #1a1a1a, #0d0d0d)"}}>
                        <h3 style={{color: "#fff", marginBottom: "5px"}}>Membership</h3>
                        <p style={{color:"#888", fontSize:"0.9rem", marginBottom:"20px"}}>Acces complet Champions K1</p>

                        <div style={{fontSize: "2.5rem", fontWeight: "800", color: "#fff", marginBottom: "15px"}}>
                            200 <span style={{fontSize: "1rem", color: "#aaa"}}>RON / lună</span>
                        </div>

                        {/* --- NOU: Secțiune Card Acces --- */}
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "10px",
                            background: "rgba(255, 26, 26, 0.1)",
                            border: "1px solid rgba(255, 26, 26, 0.3)",
                            padding: "8px 16px",
                            borderRadius: "20px",
                            marginBottom: "20px"
                        }}>
                            <i className="fas fa-id-card" style={{color: "#ff1a1a", fontSize: "1.1rem"}}></i>
                            <span style={{color: "#fff", fontWeight: "600", fontSize: "0.9rem"}}>Acces pe bază de Card</span>
                        </div>

                        <p style={{color: "#ccc", fontSize: "0.95rem", marginBottom: "20px"}}>
                            <i className="fas fa-map-marker-alt" style={{color:"#ff1a1a", marginRight:"5px"}}></i>
                            Str. General Magheru nr. 18
                        </p>
                    </div>
                </div>

                <div className="about-motto" style={{marginTop: "60px"}}>
                    <h2>IF YOU WANT TO BE THE BEST, TRAIN WITH THE BEST</h2>
                </div>

            </section>
            <FooterKickbox/>
        </>
    );
};

// —— Styles ——
const liStyle = {
    background: "linear-gradient(180deg, rgba(25,25,30,0.6), rgba(20,20,25,0.8))",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "1rem",
    marginBottom: ".7rem",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
};

const dayStyle = {
    minWidth: "80px",
    fontSize: "1.1rem",
    color: "#fff",
};

const timesWrapStyle = {
    display: "flex",
    gap: ".5rem",
};

const chipStyle = {
    padding: ".3rem .8rem",
    borderRadius: "8px",
    background: "rgba(255, 26, 26, 0.15)",
    border: "1px solid rgba(255, 26, 26, 0.3)",
    color: "#fff",
    fontSize: "0.9rem",
    fontWeight: "bold",
};

const infoCardStyle = {
    flex: "1 1 300px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "25px",
    textAlign: "center",
    maxWidth: "400px"
};

export default Kickboxing;