import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../../static/css/Coaches.css";
import CoachSwiper from "../../components/CoachSwiper";

const Coaches = () => {
  return (
    <>
      <Navbar />
      <section className="coaches-container">

        {/* --- 1. INTRO --- */}
        <div className="coaches-header">
            <h2 className="coaches-title">Echipa Tehnică</h2>
            <p className="coaches-subtitle">
                Mentorii care transformă pasiunea în performanță.
                Cu o experiență vastă și dedicare totală, antrenorii noștri sunt ghizii tăi
                pe drumul către centura neagră.
            </p>
        </div>

        {/* --- 2. CARUSEL ANTRENORI --- */}
        <div className="carousel-wrapper">
             <CoachSwiper />
        </div>

        {/* --- 3. FILOSOFIA DE ANTRENAMENT (NOU - ÎN LOC DE STATISTICI) --- */}
        <div className="philosophy-section">
            <h3 className="philosophy-title">Abordarea Noastră</h3>

            <div className="philosophy-grid">
                {/* Card 1 */}
                <div className="philosophy-card">
                    <i className="fas fa-bullseye"></i>
                    <h4>Atenție Individuală</h4>
                    <p>
                        Nu credem în tipare standard. Fiecare sportiv este unic, iar antrenorii noștri
                        adaptează metodele pentru a maximiza potențialul fiecărui copil sau adult.
                    </p>
                </div>

                {/* Card 2 */}
                <div className="philosophy-card">
                    <i className="fas fa-shield-alt"></i>
                    <h4>Siguranță & Pedagogie</h4>
                    <p>
                        Punem accent pe o execuție corectă pentru a preveni accidentările.
                        Folosim metode pedagogice moderne, bazate pe încurajare și disciplină pozitivă.
                    </p>
                </div>

                {/* Card 3 */}
                <div className="philosophy-card">
                    <i className="fas fa-brain"></i>
                    <h4>Mentalitate de Campion</h4>
                    <p>
                        Antrenăm nu doar corpul, ci și mintea. Învățăm sportivii să gestioneze emoțiile,
                        să accepte înfrângerile și să rămână modești în victorie.
                    </p>
                </div>
            </div>
        </div>

        {/* --- 4. MOTTO --- */}
        <div className="about-motto">
          <h2>IF YOU WANT TO BE THE BEST, TRAIN WITH THE BEST</h2>
        </div>

      </section>
      <Footer />
    </>
  );
};

export default Coaches;