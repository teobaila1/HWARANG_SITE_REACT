// src/pages/Kickboxing.jsx
import React from "react";
import Navbar from "../components/Navbar";
import "../../static/css/About.css";
import FooterKickbox from "../components/FooterKickbox";

const Kickboxing = () => {

    return (
        <>
            <Navbar/>

            <section className="about-section">
                <h1 className="about-title">Kickboxing - Antrenamente</h1>

                <picture className="hero-wrap">
                    {/* Dacă ai și webp, îl pui primul */}
                    <img
                        src="/images/people/echipakickbox.jpg"
                        alt="Kickboxing la Champions K1 Sibiu – focus, ritm și tehnică"
                        loading="lazy"
                        className="hero-img"
                    />
                </picture>

                <div className="about-paragraph" style={{display: "grid", gap: ".85rem"}}>
                    <p>
                        Antrenamentele de <strong>Kickboxing</strong> la <strong>Champions K1 Sibiu</strong> sunt
                        orientate pe tehnică, condiționare fizică și sparring, fiind structurate pentru toate
                        nivelurile, de la începători până la sportivi avansați.
                    </p>

                    <p>
                        Sub îndrumarea antrenorului <strong>Răzvan Tudor</strong>, accentul se pune atât pe
                        dezvoltarea calităților fizice și a disciplinei, cât și pe perfecționarea tehnicilor
                        de luptă: gardă, deplasare, combinații eficiente și <em>sparring</em> controlat.
                    </p>

                    <p>
                        Clubul are o componentă puternică de <strong>performanță</strong>, pregătind sportivi
                        pentru competiții naționale și internaționale în cadrul galei
                        <strong> Dynamite Fighting Show</strong> și altor evenimente de renume. Rezultatele
                        obținute confirmă seriozitatea și nivelul înalt al pregătirii.
                    </p>

                    <p>
                        În același timp, antrenamentele sunt accesibile și celor care doresc inițiere sau
                        îmbunătățirea formei fizice, printr-un program complet de forță, mobilitate și
                        rezistență, într-un mediu sigur și prietenos.
                    </p>
                </div>

                <h1 className="about-title">Orar</h1>
                <div className="about-paragraph">
                    <ul style={{listStyle: "none", paddingLeft: 0, margin: 0}}>
                        {/* Luni */}
                        <li style={liStyle}>
                            <strong style={dayStyle}>Luni</strong>
                            <div style={timesWrapStyle}>
                                <span style={chipStyle}>19:00 – 20:15</span>
                                <span style={chipStyle}>20:15 – 21:30</span>
                            </div>
                        </li>

                        {/* Miercuri */}
                        <li style={liStyle}>
                            <strong style={dayStyle}>Miercuri</strong>
                            <div style={timesWrapStyle}>
                                <span style={chipStyle}>19:00 – 20:15</span>
                                <span style={chipStyle}>20:15 – 21:30</span>
                            </div>
                        </li>

                        {/* Vineri */}
                        <li style={liStyle}>
                            <strong style={dayStyle}>Vineri</strong>
                            <div style={timesWrapStyle}>
                                <span style={chipStyle}>18:00 – 19:30</span>
                            </div>
                        </li>
                    </ul>
                </div>

                <h1 className="about-title">Detalii</h1>
                <div className="about-paragraph">
                    <p><strong>Locație:</strong> Str. General Magheru nr. 18</p>
                    <p><strong>Abonament:</strong> 200 RON / lună</p>
                    <p><strong>Antrenor:</strong> Răzvan Tudor</p>
                </div>

                <div className="about-motto">
                    <h2>IF YOU WANT TO BE THE BEST, TRAIN WITH THE BEST</h2>
                </div>

                {/*<h1 className="about-title">Contact</h1>*/}
                {/*<div className="about-paragraph">*/}
                {/*  <p>Pentru întrebări și înscrieri, dă-ne un telefon sau trimite-ne un email.</p>*/}
                {/*  <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>*/}
                {/*    <a*/}
                {/*      href={phone ? `tel:${phone}` : undefined}*/}
                {/*      style={btnStyle}*/}
                {/*      aria-disabled={!phone}*/}
                {/*      onClick={(e) => !phone && e.preventDefault()}*/}
                {/*    >*/}
                {/*      Sună-ne*/}
                {/*    </a>*/}
                {/*    <a*/}
                {/*      href={email ? `mailto:${email}` : undefined}*/}
                {/*      style={btnStyle}*/}
                {/*      aria-disabled={!email}*/}
                {/*      onClick={(e) => !email && e.preventDefault()}*/}
                {/*    >*/}
                {/*      Trimite email*/}
                {/*    </a>*/}
                {/*  </div>*/}

                {/*  {!phone && !email && (*/}
                {/*    <p style={{ opacity: 0.7, marginTop: ".5rem" }}>*/}
                {/*      <em>Tip: setează <code>phone</code> și <code>email</code> în componentă pentru a activa butoanele.</em>*/}
                {/*    </p>*/}
                {/*  )}*/}
                {/*</div>*/}
            </section>
            <FooterKickbox/>
        </>
    );
};

// —— mici stiluri inline ca să păstrăm vibe-ul dark+red din About.css ——
const liStyle = {
    background: "linear-gradient(180deg, rgba(17,17,20,.95), rgba(22,22,27,.95))",
    border: "1px solid rgba(39,39,51,.9)",
    borderRadius: "12px",
    padding: ".9rem 1rem",
    marginBottom: ".7rem",
    boxShadow: "0 10px 26px rgba(0,0,0,.22)",
    display: "flex",
    alignItems: "center",
    gap: ".75rem",
};

const dayStyle = {
    minWidth: "98px",
    fontWeight: 900,
    letterSpacing: ".2px",
    color: "#fff",
};

const timesWrapStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: ".5rem",
};

const chipStyle = {
    display: "inline-flex",
    alignItems: "center",
    padding: ".25rem .7rem",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,.08)",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,.04)",
    fontWeight: 800,
    letterSpacing: ".2px",
    color: "#fff",
    background: "linear-gradient(180deg, rgba(255,26,26,.12), rgba(204,0,0,.12))",
};

const btnStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "42px",
    padding: "0 16px",
    textDecoration: "none",
    fontWeight: 900,
    letterSpacing: ".2px",
    color: "#fff",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,.06)",
    background: "linear-gradient(180deg, #ff1a1a, #cc0000)",
    boxShadow: "0 10px 26px rgba(255,0,0,.22)",
};

export default Kickboxing;
