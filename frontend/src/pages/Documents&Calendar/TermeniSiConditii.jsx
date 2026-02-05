import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../../static/css/TermeniSiConditii.css";

const TermeniSiConditii = () => {
    // Scroll la începutul paginii când se încarcă componenta
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Navbar/>
            <main className="termeni-page">
                <div className="termeni-container">
                    {/*<header className="termeni-header">*/}
                    {/*    /!*<h1 className="termeni-title">Termeni și Condiții</h1>*!/*/}
                    {/*    /!*<p className="termeni-update">Ultima actualizare: 1 Ianuarie 2026</p>*!/*/}
                    {/*    /!*<div className="termeni-divider"></div>*!/*/}
                    {/*</header>*/}

                    <div className="termeni-content">
                        <section className="termeni-section">
                            <p className="termeni-update">Ultima actualizare: 1 Ianuarie 2026</p>
                            <h2>1. Introducere</h2>
                            <p>
                                Vă mulțumim că ați accesat site-ul <strong>ACS Hwarang Academy Sibiu</strong>.
                                Prin accesarea și utilizarea acestui site, sunteți de acord cu termenii și condițiile descrise mai jos.
                                Utilizarea continuă a platformei implică acceptul necondiționat al acestora.
                            </p>
                        </section>

                        <section className="termeni-section">
                            <h2>2. Despre noi</h2>
                            <p>
                                <strong>ACS Hwarang Academy</strong> este o asociație sportivă dedicată promovării artelor marțiale tradiționale,
                                având ca disciplină principală <strong>Taekwon-Do ITF</strong>. Misiunea noastră este dezvoltarea armonioasă a tinerilor
                                și adulților prin disciplină, respect, integritate și performanță sportivă.
                            </p>
                        </section>

                        <section className="termeni-section">
                            <h2>3. Accesul și Utilizarea Site-ului</h2>
                            <p>
                                Accesul la platformă este gratuit și disponibil tuturor utilizatorilor interesați de activitatea clubului.
                                Ne rezervăm dreptul de a restricționa accesul anumitor utilizatori sau IP-uri în cazul în care detectăm
                                activități suspecte, tentative de fraudă sau limbaj neadecvat.
                            </p>
                        </section>

                        <section className="termeni-section">
                            <h2>4. Proprietate Intelectuală</h2>
                            <p>
                                Întregul conținut al acestui site incluzând, dar fără a se limita la: imagini, texte, elemente grafice,
                                logo-uri, clipuri video și structură este proprietatea <strong>ACS Hwarang Academy</strong> și este
                                protejat de Legea dreptului de autor. Reproducerea, distribuirea sau utilizarea acestor materiale fără acordul
                                scris al clubului este strict interzisă.
                            </p>
                        </section>

                        <section className="termeni-section">
                            <h2>5. Limitarea Răspunderii</h2>
                            <p>
                                Informațiile prezentate pe site au caracter informativ. Deși depunem toate eforturile pentru a menține
                                informațiile (orar, tarife, evenimente) actualizate, nu garantăm lipsa completă a erorilor.
                                Clubul nu poate fi tras la răspundere pentru eventuale prejudicii rezultate din utilizarea informațiilor de pe site.
                            </p>
                        </section>

                        <section className="termeni-section">
                            <h2>6. Confidențialitatea Datelor (GDPR)</h2>
                            <p>
                                Respectăm confidențialitatea datelor dumneavoastră. Orice informație colectată prin formularele de înscriere
                                sau contact (Nume, Telefon, Email, Data Nașterii) este utilizată <strong>strict în scopuri organizatorice</strong>
                                (legitimarea sportivilor, comunicări interne, înscrieri la competiții) și nu va fi înstrăinată către terți în scopuri comerciale.
                            </p>
                        </section>

                        <section className="termeni-section">
                            <h2>7. Link-uri Externe</h2>
                            <p>
                                Site-ul poate conține link-uri către site-uri partenere (ex: Federația Română de Taekwon-Do ITF, sponsori).
                                Nu suntem responsabili pentru politica de confidențialitate sau conținutul acestor site-uri externe.
                            </p>
                        </section>

                        <section className="termeni-section">
                            <h2>8. Modificări ale Termenilor</h2>
                            <p>
                                Ne rezervăm dreptul de a actualiza periodic acești termeni și condiții fără o notificare prealabilă.
                                Vă recomandăm să verificați această pagină periodic pentru a fi la curent cu orice modificări.
                            </p>
                        </section>

                        <section className="contact-card">
                            <h2>9. Contact</h2>
                            <p>Pentru orice întrebări, nelămuriri sau solicitări, ne puteți contacta:</p>
                            <ul>
                                <li>
                                    <span className="label">Email:</span>
                                    <span className="value">secretary@hwarang.com</span> {/* Am pus un email generic, poti modifica */}
                                </li>
                                <li>
                                    <span className="label">Telefon:</span>
                                    <span className="value">0770 633 848</span>
                                </li>
                                <li>
                                    <span className="label">Adresă:</span>
                                    <span className="value">Strada General Magheru Nr. 18, Sibiu</span>
                                </li>
                            </ul>
                        </section>

                        <p className="termeni-footer-text">
                            Vă mulțumim pentru încredere și vă așteptăm la antrenamente!
                            <br/>
                            <strong>Echipa Hwarang Academy</strong>
                        </p>
                    </div>
                </div>
            </main>
            <Footer/>
        </>
    );
};

export default TermeniSiConditii;