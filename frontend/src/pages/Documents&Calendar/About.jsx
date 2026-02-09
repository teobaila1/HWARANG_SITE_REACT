import React from "react";
import Footer from "../../components/Footer";
import "../../../static/css/About.css";
import Navbar from "../../components/Navbar";

const About = () => {
  return (
    <>
      <Navbar/>

      <section className="about-section">

        {/* --- 1. ISTORIC --- */}
        <h1 className="about-title">ACS Hwarang Academy</h1>
        <div className="about-paragraph">
          <p>
            Clubul Hwarang Sibiu a fost fondat în anul 1997, de către Enache Valentin, iar din anul 2001,
            președintele clubului este <strong>Florin Bîrluț</strong>.
            De atunci, pentru el, nu a existat competiție națională la care să nu obțină cel puțin o medalie.
            Astăzi, suntem recunoscuți ca unul dintre cluburile de top din țară.
          </p>
          <p>
            În anul 2016 a luat naștere și secția de KickBoxing, actuala echipă Champions K1 Sibiu,
            condusă de antrenorul <strong>Răzvan Tudor</strong>.
          </p>
        </div>

        {/* --- 2. IMAGINE DE GRUP --- */}
        <div className="hero-wrap" style={{maxWidth: "900px", margin: "40px auto"}}>
             <img src="/images/grup.jpg" alt="Familia Hwarang" className="hero-img" />
        </div>

        {/* --- 3. VALORILE NOASTRE --- */}
        <h1 className="about-title">Valorile Noastre</h1>
        <div className="values-grid">
            <div className="value-card">
                <i className="fas fa-hand-rock"></i>
                <h3>Respect</h3>
                <p>Învățăm să ne respectăm partenerii, antrenorii și pe noi înșine.</p>
            </div>
            <div className="value-card">
                <i className="fas fa-balance-scale"></i>
                <h3>Integritate</h3>
                <p>Suntem onești și corecți, atât în dojang cât și în viața de zi cu zi.</p>
            </div>
            <div className="value-card">
                <i className="fas fa-fire"></i>
                <h3>Perseverență</h3>
                <p>Nu renunțăm niciodată, indiferent cât de greu este obstacolul.</p>
            </div>
            <div className="value-card">
                <i className="fas fa-brain"></i>
                <h3>Autocontrol</h3>
                <p>Ne gestionăm emoțiile și reacțiile pentru a fi mai puternici.</p>
            </div>
            {/* --- SPIRIT DE LUPTĂ NEÎNFRICAT (ADĂUGAT) --- */}
            <div className="value-card">
                <i className="fas fa-dragon"></i>
                <h3>Spirit Neînfricat</h3>
                <p>Avem curajul să ne susținem principiile și să luptăm, indiferent de provocări.</p>
            </div>
        </div>

        {/* --- 4. TEXT FILOSOFIE --- */}
        <div className="about-paragraph">
          <p>
            Numele „Hwarang” are origine coreeană și însemna literal „tineri înfloritori”.
            Prin alegerea acestui nume, clubul sugerează aspirația de a forma sportivi integri, curajoși și bine pregătiți.
          </p>
          <p>
            La ACS Hwarang Sibiu, Taekwon-Do-ul nu este doar un sport, ci o cale de viață.
            Modelăm nu doar campioni, ci și oameni responsabili, determinați și echilibrați.
          </p>
        </div>

        {/* --- 5. LINK CĂTRE ANTRENORI --- */}
        <div className="coaches-teaser-box">
            <h3>Cine stă în spatele performanței?</h3>
            <p>Echipa noastră tehnică are o experiență cumulată de peste 30 de ani.</p>
            <a href="/antrenori" className="btn-outline-red">
                Cunoaște Antrenorii <i className="fas fa-arrow-right"></i>
            </a>
        </div>

        {/* --- 6. MOTTO --- */}
        <div className="about-motto" style={{marginTop: "50px"}}>
          <h2>IF YOU WANT TO BE THE BEST, TRAIN WITH THE BEST</h2>
        </div>

      </section>

      <Footer />
    </>
  );
};

export default About;