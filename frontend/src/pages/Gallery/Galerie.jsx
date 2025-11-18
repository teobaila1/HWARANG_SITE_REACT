import React, { useEffect, useMemo, useState, useCallback } from "react";
import Navbar from "../../components/Navbar";
import "/../frontend/static/css/Galerie.css";
import Footer from "../../components/Footer";

/**
 * ── Cum adaugi un album nou ───────────────────────────────────────────────
 * 1) Creezi un folder cu poze sub: /public/images/gallery/<slug>/
 * 2) Completezi mai jos un obiect în ALBUME, cu title, slug și lista de fișiere.
 * 3) (opțional) setezi "cover" dacă vrei coperta diferită de prima poză.
 */

const ALBUME = [
  {
    id: "poze_copii_random",
    title: "Antrenamente",
    slug: "antrenamente_random",
    cover: "/images/gallery/antrenamente_random/cover.jpg",
    files: [
      "maerean.jpg",
      "2.jpg",
      "3.jpg",
      "4.jpg",
      "5.jpg",
      "6.jpg",
      "7.jpg",
      "8.jpg",
      "9.jpg",
      "10.jpg",
      "11.jpg",
      "12.jpg",
    ],
  },
  {
    id: "poze_concursuri",
    title: "Concursuri Naționale",
    slug: "poze_concursuri",
    files: [
      "cover_2.jpg",
      "2.jpg",
      "3.jpg",
      "4.jpg",
      "5.jpg",
      "6.jpg",
      "7.jpg",
      "8.jpg",
      "9.jpg",
      "10.jpg",
      "11.jpg",
      "12.jpg",
    ],
  },
  {
    id: "examene_de_centura",
    title: "Examene de centura",
    slug: "examene_de_centura",
    files: [
      "cover_3.jpg",
      "1.jpg",
      "2.jpg",
      "3.jpg",
      "4.jpg",
      "5.jpg",
      "6.jpg",
      "7.jpg",
      "8.jpg",
      "9.jpg",
    ],
  },
];

const buildSrc = (slug, file) => `/images/gallery/${slug}/${file}`;

const Galerie = () => {
  const [openAlbum, setOpenAlbum] = useState(null); // {album, index}
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

  // navigare cu taste
  useEffect(() => {
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
              <button
                className="nav-btn prev"
                onClick={goPrev}
                aria-label="Anterior"
              >
                ‹
              </button>

              {(() => {
                const currentSrc = buildSrc(
                  openAlbum.album.slug,
                  openAlbum.album.files[openAlbum.index]
                );

                const handleImageClick = (e) => {
                  // click normal stânga (fără Ctrl/Cmd/Alt/Shift) -> mergi la următoarea
                  if (
                    e.button === 0 &&
                    !e.ctrlKey &&
                    !e.metaKey &&
                    !e.shiftKey &&
                    !e.altKey
                  ) {
                    e.preventDefault();
                    goNext();
                  }
                  // Ctrl+click / click mijloc -> browserul deschide în tab nou
                };

                return (
                  <a
                    href={currentSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleImageClick}
                  >
                    <img
                      className="lightbox-img"
                      src={currentSrc}
                      alt=""
                      loading="eager"
                    />
                  </a>
                );
              })()}

              <button
                className="nav-btn next"
                onClick={goNext}
                aria-label="Următor"
              >
                ›
              </button>
            </div>

            <div className="thumbs-row">
              {openAlbum.album.files.map((f, i) => (
                <button
                  key={f}
                  className={`thumb ${i === openAlbum.index ? "active" : ""}`}
                  onClick={() =>
                    setOpenAlbum({ album: openAlbum.album, index: i })
                  }
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
