import React, { useEffect, useMemo, useState, useCallback } from "react";
import AOS from 'aos'; // <--- AM ADĂUGAT IMPORTUL
import 'aos/dist/aos.css'; // <--- AM ADĂUGAT IMPORTUL CSS
import Navbar from "../../components/Navbar";
import "/../frontend/static/css/Galerie.css";
import Footer from "../../components/Footer";

const ALBUME = [
  {
    id: "poze_copii_random",
    title: "Antrenamente",
    slug: "antrenamente_random",
    cover: "/images/gallery/antrenamente_random/cover.jpg",
    files: [
      "maerean.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg",
      "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg",
    ],
  },
  {
    id: "poze_concursuri",
    title: "Concursuri Naționale",
    slug: "poze_concursuri",
    files: [
      "cover_2.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg",
      "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg",
    ],
  },
  {
    id: "examene_de_centura",
    title: "Examene de centură",
    slug: "examene_de_centura",
    files: [
      "cover_3.jpg", "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg",
      "6.jpg", "7.jpg", "8.jpg", "9.jpg",
    ],
  },
];

const buildSrc = (slug, file) => `/images/gallery/${slug}/${file}`;

const Galerie = () => {
  const [openAlbum, setOpenAlbum] = useState(null);
  const [filter, setFilter] = useState("");

  const albums = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return ALBUME;
    return ALBUME.filter(
      (a) =>
        a.title.toLowerCase().includes(term) ||
        a.slug.toLowerCase().includes(term)
    );
  }, [filter]);

  const openLightbox = (album, index) => setOpenAlbum({ album, index });
  const closeLightbox = () => setOpenAlbum(null);

  const goPrev = useCallback(() => {
    setOpenAlbum((s) => {
      if (!s) return s;
      const n = (s.index - 1 + s.album.files.length) % s.album.files.length;
      return { ...s, index: n };
    });
  }, []);

  const goNext = useCallback(() => {
    setOpenAlbum((s) => {
      if (!s) return s;
      const n = (s.index + 1) % s.album.files.length;
      return { ...s, index: n };
    });
  }, []);

  useEffect(() => {
    // --- FIX PENTRU MOBIL: Dezactivăm animațiile pe ecrane mici ---
    AOS.init({
        duration: 800,
        once: true,
        disable: window.innerWidth < 768 // <--- ASTA REZOLVĂ PROBLEMA VIZIBILITĂȚII
    });

    if (!openAlbum) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openAlbum, goPrev, goNext]);

  return (
    <>
      <Navbar />
      <section className="galerie-page">

        {/* --- SECȚIUNEA PALMARES (UPDATE COMPLET) --- */}
        <div className="hall-of-fame" data-aos="fade-up">

            <div className="hof-header">
                <h2 className="hof-title">
                    <i className="fas fa-trophy"></i> Sala Campionilor
                </h2>
                <p className="hof-subtitle">
                    Performanța se construiește prin muncă și disciplină.
                    Iată câteva dintre momentele care ne definesc utlimul an competițional:
                </p>
            </div>

            <div className="hof-grid">
                {/* CARD 1: MEDALII */}
                <div className="hof-item">
                    <div className="hof-icon-wrapper">
                        <i className="fas fa-medal" style={{color: "#ffd700"}}></i>
                    </div>
                    <span className="hof-year">2026 - Focșani</span>
                    <div className="hof-event">Campionatul Național</div>
                    <div className="hof-result">
                        Rezultate impresionante: <span className="hof-highlight">26 de Medalii</span>, dintre care
                        7 de Aur, 8 de Argint și 11 de Bronz pentru echipa noastră.
                        <span className="hof-highlight">🏆ACS Hwarang Academy Sibiu a obținut locul II clasament general juniori,
                        iar Cristache Daniel a obținut titlul de cel mai bun junior al competiției.</span>
                    </div>
                </div>

                {/* CARD 2: CUPA */}
                <div className="hof-item">
                    <div className="hof-icon-wrapper">
                        <i className="fas fa-crown" style={{color: "#e0e0e0"}}></i>
                    </div>
                    <span className="hof-year">2026 - Baia Mare</span>
                    <div className="hof-event">Cupa României</div>
                    <div className="hof-result">
                        <span style={{color:"#fff", fontWeight:"bold"}}>17 medalii cucerite</span>.
                        O prestație extraordinară a clubului nostru.
                    </div>
                </div>

                {/* CARD 3: CENTURI NEGRE */}
                <div className="hof-item">
                    <div className="hof-icon-wrapper">
                        <i className="fas fa-user-ninja" style={{color: "#d32f2f"}}></i>
                    </div>
                    <span className="hof-year">2026 - Novi Sad, Serbia</span>
                    <div className="hof-event">Campionatul Balcanic</div>
                    <div className="hof-result">
                        <span className="hof-highlight">2 Campioni Balcanici</span>.
                        Cei 9 sportivi au cucerit: 2 Medalii de Aur, 3 de Argint și 2 de Bronz.
                    </div>
                </div>
            </div>

            {/* --- ELEMENTE NOI DE CREDIBILITATE --- */}

            {/* 1. Lista cu Campioni */}
            <div className="champions-list">
                <div className="champions-title">Sportivi de Top (Hall of Fame)</div>
                <div className="champions-names">
                    <div className="champion-tag"><i className="fas fa-star"></i> Florin Bîrluț (2x Campion European - Luptă, 1x Vicecampion Mondial - Tull, multiplu Campion Național și Balcanic, Maestru Emerit al Sportului)</div>
                    <div className="champion-tag"><i className="fas fa-star"></i> Dorian Neagu (Campion Mondial și European - Spargeri Forță, Vicecampion European - Luptă, multiplu Campion Național, Maestru Emerit al Sportului)</div>
                    <div className="champion-tag"><i className="fas fa-star"></i> Alexandru Băilă (Campion Mondial și European - Spargeri Forță, multiplu Campon Național și Balcanic, Maestru Emerit al Sportului)</div>
                    <div className="champion-tag"><i className="fas fa-star"></i> Radu Neagu (Campion European - Luptă, multiplu Campion Național, Maestru Emerit al Sportului)</div>
                    <div className="champion-tag"><i className="fas fa-star"></i> Răzvan Tudor (Campion European - Luptă, multiplu Campion Național)</div>
                    <div className="champion-tag"><i className="fas fa-star"></i> Raul Hurdu (Campion European Echipe - Tehnici Speciale, multiplu Campion Național)</div>
                    <div className="champion-tag"><i className="fas fa-star"></i> Teodor Băilă (Vicecampion European - Tull, multiplu Campion Național și Balcanic)</div>
                    <div className="champion-tag"><i className="fas fa-star"></i> Daniel Cristache (Vicecampion Mondial Echipe - Tull, multiplu Campion Național și Balcanic)</div>
                    <div className="champion-tag"><i className="fas fa-star"></i> Radu Mareș (Vicecampion Mondial Echipe - Tull, multiplu Campion Național și Balcanic)</div>
                </div>
            </div>

            <div style={{display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "flex-end", marginTop: "30px", gap: "20px"}}>

                {/*/!* 2. Badge Oficial *!/*/}
                {/*<div className="official-badge">*/}
                {/*    <i className="fas fa-certificate" style={{fontSize: "2rem", color: "#888"}}></i>*/}
                {/*    <div className="badge-text">*/}
                {/*        <span>Club Sportiv Afiliat</span>*/}
                {/*        <strong>Federația Română de Taekwon-do ITF</strong>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/* 3. CTA */}
                <div className="hof-cta">
                    <a href="/inregistrare" className="btn-join-team">
                        Vrei să fii următorul campion? &nbsp; <i className="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>

        </div>
        {/* ----------------------------------------------- */}

        <div className="galerie-head">
          <h2>Galerie foto</h2>
          <div className="galerie-search">
            <input
              type="text"
              placeholder="Caută în albume…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {albums.length === 0 ? (
          <p className="galerie-empty">Nu s-au găsit albume.</p>
        ) : (
          <div className="albums-grid">
            {albums.map((a) => {
              const cover = a.cover || buildSrc(a.slug, a.files[0]);
              return (
                <article
                  className="album-card"
                  key={a.id}
                  onClick={() => openLightbox(a, 0)}
                >
                  <div className="album-cover">
                    <img src={cover} alt={a.title} loading="lazy" />
                    <div className="album-overlay" />
                    <span className="album-count">{a.files.length} poze</span>
                  </div>
                  <h3 className="album-title">{a.title}</h3>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {openAlbum && (
        <div className="lightbox-backdrop" onClick={closeLightbox}>
          <div className="lightbox" onClick={(e) => e.stopPropagation()}>
            <header className="lightbox-head">
              <h4>
                {openAlbum.album.title} • {openAlbum.index + 1}/
                {openAlbum.album.files.length}
              </h4>
              <button
                className="btn-close"
                onClick={closeLightbox}
                aria-label="Închide"
              >
                ✕
              </button>
            </header>

            <div className="lightbox-body">
              <button className="nav-btn prev" onClick={goPrev} aria-label="Anterior">‹</button>

              {(() => {
                const currentSrc = buildSrc(
                  openAlbum.album.slug,
                  openAlbum.album.files[openAlbum.index]
                );
                const handleImageClick = (e) => {
                  if (e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
                    e.preventDefault();
                    goNext();
                  }
                };
                return (
                  <a href={currentSrc} target="_blank" rel="noopener noreferrer" onClick={handleImageClick}>
                    <img className="lightbox-img" src={currentSrc} alt="" loading="eager" />
                  </a>
                );
              })()}

              <button className="nav-btn next" onClick={goNext} aria-label="Următor">›</button>
            </div>

            <div className="thumbs-row">
              {openAlbum.album.files.map((f, i) => (
                <button
                  key={f}
                  className={`thumb ${i === openAlbum.index ? "active" : ""}`}
                  onClick={() => setOpenAlbum({ album: openAlbum.album, index: i })}
                  aria-label={`Deschide fotografia ${i + 1}`}
                >
                  <img src={buildSrc(openAlbum.album.slug, f)} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Galerie;