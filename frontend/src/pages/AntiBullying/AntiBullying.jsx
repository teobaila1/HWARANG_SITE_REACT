import React, { useState } from 'react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../../static/css/AntiBullying.css";

const articles = [
    {
        num: "01",
        title: "Definiția bullying-ului",
        icon: "fas fa-shield-alt",
        content: null,
        list: [
            { icon: "fas fa-fist-raised", label: "Bullying fizic", desc: "Lovituri, împingeri, distrugerea echipamentului sportiv, agresiuni fizice." },
            { icon: "fas fa-comment-slash", label: "Bullying verbal", desc: "Insulte, amenințări, poreclire, comentarii jignitoare." },
            { icon: "fas fa-users-slash", label: "Bullying social", desc: "Excluderea din grup, răspândirea de zvonuri false, izolarea socială." },
            { icon: "fas fa-laptop", label: "Cyberbullying", desc: "Hărțuire prin mesaje online, comentarii negative, conturi false sau conținut umilitor." },
        ],
        intro: "Bullying-ul reprezintă orice formă de comportament agresiv, intenționat și repetat, care are ca scop intimidarea, excluderea, discriminarea, hărțuirea sau umilirea unui membru al clubului. Aceasta poate include:"
    },
    {
        num: "02",
        title: "Principii de bază",
        icon: "fas fa-balance-scale",
        content: null,
        bullets: [
            "Respectul reciproc între toți membrii clubului este fundamental.",
            "Promovarea unui comportament bazat pe fair-play, colaborare, susținere și colegialitate.",
            "Zero toleranță față de orice formă de agresiune – fizică, verbală, socială sau online.",
            "Încurajarea unui mediu de încredere unde toți membrii se simt confortabil să raporteze orice incident.",
            "Asigurarea unui acces egal la resurse, oportunități și tratament pentru toți membrii, fără discriminare.",
        ]
    },
    {
        num: "03",
        title: "Măsuri preventive",
        icon: "fas fa-hands-helping",
        content: null,
        bullets: [
            "Sesiuni educative și workshopuri regulate pentru conștientizarea efectelor bullying-ului.",
            "Implicarea activă a antrenorilor, părinților și sportivilor în menținerea unui climat pozitiv.",
            "Sistem de raportare anonimă și confidențială pentru protejarea victimelor.",
            "Instruirea sportivilor în gestionarea conflictelor și promovarea intervenției pozitive.",
            "Grupuri de suport pentru victime, cu ajutor psihologic și sprijin din partea colegilor.",
            "Comunicare constantă între sportivi, antrenori și părinți privind implementarea regulamentului.",
        ]
    },
    {
        num: "04",
        title: "Procedura de raportare și sancțiuni",
        icon: "fas fa-gavel",
        content: null,
        steps: [
            { label: "Raportarea", desc: "Orice incident trebuie raportat antrenorilor sau conducerii, verbal sau în scris, cât mai curând posibil." },
            { label: "Investigația", desc: "Fiecare caz va fi tratat cu seriozitate, iar o investigație imparțială și confidențială va fi desfășurată." },
            { label: "Confidențialitate", desc: "Identitatea persoanelor implicate va fi protejată. Victimele nu vor fi supuse unor represalii." },
        ],
        sanctions: [
            { level: "1", label: "Avertisment verbal", desc: "Pentru abateri minore, cu discuție despre comportamentul inacceptabil.", color: "yellow" },
            { level: "2", label: "Consiliere obligatorie", desc: "Sesiuni de consiliere psihologică sau educație anti-bullying.", color: "orange" },
            { level: "3", label: "Suspendare temporară", desc: "Interzicerea accesului la antrenamente și competiții pentru o perioadă determinată.", color: "red-soft" },
            { level: "4", label: "Excludere din club", desc: "Pentru abateri grave sau repetate care nu au fost corectate.", color: "red" },
        ]
    },
    {
        num: "05",
        title: "Responsabilitățile fiecărei părți",
        icon: "fas fa-users",
        content: null,
        roles: [
            { icon: "fas fa-running", label: "Sportivii", desc: "Respectă regulile clubului și intervin când observă comportamente de bullying, respectând principiile fair-play." },
            { icon: "fas fa-chalkboard-teacher", label: "Antrenorii", desc: "Creează un mediu sigur, promovează respectul și asigură că regulile sunt aplicate corect." },
            { icon: "fas fa-user-friends", label: "Părinții", desc: "Monitorizează comportamentul copiilor și participă activ la prevenirea bullying-ului prin educație și comunicare." },
            { icon: "fas fa-building", label: "Clubul", desc: "Oferă resurse și formare continuă pentru a preveni și a răspunde eficient la orice incident." },
        ]
    },
    {
        num: "06",
        title: "Evaluare și îmbunătățire continuă",
        icon: "fas fa-sync-alt",
        bullets: [
            "Revizuirea periodică a regulamentului și a măsurilor preventive pentru relevanță și eficiență.",
            "Evaluarea programelor educaționale și a intervențiilor pentru îmbunătățirea continuă a răspunsurilor clubului.",
        ]
    },
];

const AntiBullying = () => {
    const [openArt, setOpenArt] = useState(null);

    return (
        <div className="ab-wrapper">
            <Navbar />

            {/* Hero */}
            <div className="ab-hero">
                <div className="ab-hero-badge">
                    <i className="fas fa-shield-alt"></i> Regulament Oficial
                </div>
                <h1 className="ab-hero-title">Politica Anti-Bullying</h1>
                <p className="ab-hero-sub">Asociația Club Sportiv Hwarang Academy Sibiu</p>
                <p className="ab-hero-desc">
                    Pentru a asigura un mediu sigur, respectuos și incluziv, care să permită
                    dezvoltarea personală și sportivă a fiecărui membru, Asociația Club Sportiv Hwarang Academy Sibiu adoptă și pune în aplicare prezentul regulament.
                </p>
                <div className="ab-hero-pillars">
                    <div className="ab-pillar"><i className="fas fa-heart"></i> Respect</div>
                    <div className="ab-pillar"><i className="fas fa-hand-paper"></i> Zero toleranță</div>
                    <div className="ab-pillar"><i className="fas fa-lock"></i> Confidențialitate</div>
                    <div className="ab-pillar"><i className="fas fa-people-carry"></i> Comunitate</div>
                </div>
            </div>

            {/* Articles */}
            <div className="ab-container">
                {articles.map((art, i) => (
                    <div key={i} className="ab-article">
                        <div
                            className={`ab-article-header ${openArt === i ? 'open' : ''}`}
                            onClick={() => setOpenArt(openArt === i ? null : i)}
                        >
                            <div className="ab-article-left">
                                <span className="ab-art-num">Art. {art.num}</span>
                                <div className="ab-art-icon">
                                    <i className={art.icon}></i>
                                </div>
                                <h2 className="ab-art-title">{art.title}</h2>
                            </div>
                            <i className={`fas fa-chevron-down ab-chevron ${openArt === i ? 'rotated' : ''}`}></i>
                        </div>

                        {openArt === i && (
                            <div className="ab-article-body">
                                {/* Intro text */}
                                {art.intro && <p className="ab-intro">{art.intro}</p>}

                                {/* List cu iconuri (Art 1) */}
                                {art.list && (
                                    <div className="ab-type-grid">
                                        {art.list.map((item, j) => (
                                            <div key={j} className="ab-type-card">
                                                <div className="ab-type-icon"><i className={item.icon}></i></div>
                                                <div>
                                                    <div className="ab-type-label">{item.label}</div>
                                                    <div className="ab-type-desc">{item.desc}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Bullets */}
                                {art.bullets && (
                                    <ul className="ab-bullets">
                                        {art.bullets.map((b, j) => (
                                            <li key={j}><i className="fas fa-check-circle"></i><span>{b}</span></li>
                                        ))}
                                    </ul>
                                )}

                                {/* Steps (Art 4) */}
                                {art.steps && (
                                    <div className="ab-steps">
                                        {art.steps.map((s, j) => (
                                            <div key={j} className="ab-step">
                                                <div className="ab-step-num">{j + 1}</div>
                                                <div>
                                                    <div className="ab-step-label">{s.label}</div>
                                                    <div className="ab-step-desc">{s.desc}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Sanctions (Art 4) */}
                                {art.sanctions && (
                                    <div className="ab-sanctions">
                                        <p className="ab-sanctions-title">Sancțiuni progresive:</p>
                                        {art.sanctions.map((s, j) => (
                                            <div key={j} className={`ab-sanction ab-sanction--${s.color}`}>
                                                <div className="ab-sanction-level">Nivelul {s.level}</div>
                                                <div>
                                                    <div className="ab-sanction-label">{s.label}</div>
                                                    <div className="ab-sanction-desc">{s.desc}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Roles (Art 5) */}
                                {art.roles && (
                                    <div className="ab-roles">
                                        {art.roles.map((r, j) => (
                                            <div key={j} className="ab-role">
                                                <div className="ab-role-icon"><i className={r.icon}></i></div>
                                                <div>
                                                    <div className="ab-role-label">{r.label}</div>
                                                    <div className="ab-role-desc">{r.desc}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {/* Footer card */}
                <div className="ab-report-card">
                    <div className="ab-report-icon"><i className="fas fa-exclamation-triangle"></i></div>
                    <div>
                        <div className="ab-report-title">Ai asistat sau ai fost victima unui incident?</div>
                        <div className="ab-report-desc">Raportează imediat antrenorilor sau conducerii clubului. Confidențialitatea ta este garantată.</div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AntiBullying;