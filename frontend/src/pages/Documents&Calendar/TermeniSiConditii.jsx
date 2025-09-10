import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/TermeniSiConditii.css";

const TermeniSiConditii = () => {
    return (
        <>
            <Navbar/>
            <div className="termeni-container">
                <h1 className="termeni-title">Termeni și Condiții de Utilizare</h1>
                <p className="termeni-update">Actualizat la 1 Iulie 2025</p>

                <section>
                    <h2>1. Introducere</h2>
                    <p>
                        Prin accesarea și utilizarea acestui site, sunteți de acord cu termenii și condițiile stabilite
                        de <strong>ACS Hwarang Academy</strong>. Utilizarea continuă a platformei implică acceptul
                        implicit al acestora.
                    </p>
                </section>

                <section>
                    <h2>2. Despre noi</h2>
                    <p>
                        ACS Hwarang Academy este un club sportiv dedicat promovării artelor marțiale tradiționale, în
                        special <strong>Taekwon-Do ITF</strong>, și dezvoltării armonioase a tinerilor prin disciplină,
                        respect și performanță.
                    </p>
                </section>

                <section>
                    <h2>3. Accesul la site</h2>
                    <p>
                        Accesul la platformă este disponibil tuturor utilizatorilor interesați. Ne rezervăm dreptul de a
                        restricționa accesul în caz de abateri sau mentenanță.
                    </p>
                </section>

                <section>
                    <h2>4. Proprietate intelectuală</h2>
                    <p>
                        Toate materialele de pe acest site sunt protejate prin drepturi de autor. Reproducerea fără
                        acordul scris al clubului este interzisă.
                    </p>
                </section>

                <section>
                    <h2>5. Utilizarea informațiilor</h2>
                    <p>
                        Informațiile oferite au scop informativ. Ne străduim să fie corecte și actuale, dar nu garantăm
                        lipsa completă a erorilor.
                    </p>
                </section>

                <section>
                    <h2>6. Confidențialitatea datelor</h2>
                    <p>
                        Respectăm intimitatea utilizatorilor. Datele colectate sunt folosite exclusiv în scopuri
                        organizatorice, în conformitate cu regulamentul GDPR.
                    </p>
                </section>

                <section>
                    <h2>7. Comunicări și notificări</h2>
                    <p>
                        Prin completarea formularelor, acceptați să primiți comunicări privind activitatea clubului.
                    </p>
                </section>

                <section>
                    <h2>8. Răspundere</h2>
                    <p>
                        Nu suntem responsabili pentru erori tehnice sau daune rezultate din utilizarea necorespunzătoare
                        a site-ului.
                    </p>
                </section>

                <section>
                    <h2>9. Linkuri externe</h2>
                    <p>
                        Site-ul poate include trimiteri către site-uri externe. Nu ne asumăm responsabilitatea pentru
                        conținutul acestora.
                    </p>
                </section>

                <section>
                    <h2>10. Modificări ale termenilor</h2>
                    <p>
                        Termenii pot fi actualizați periodic. Orice modificare va fi afișată pe această pagină.
                    </p>
                </section>

                <section>
                    <h2>11. Contact</h2>
                    <p>
                        Pentru întrebări sau sesizări:
                        <br/>Email: secretariat
                        <br/>Telefon: 0770 633 848
                        <br/>Adresă: ACS Hwarang Academy Sibiu
                    </p>
                </section>

                <p className="termeni-footer">Vă mulțumim pentru încrederea acordată și pentru că faceți parte din comunitatea ACS Hwarang Academy!</p>
            </div>
            <Footer/>
        </>
    );
};

export default TermeniSiConditii;
