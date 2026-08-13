import React, { useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../static/css/Orar.css";

// Grupăm orarele pe locații
const schedules = {
    "Sibiu": [
        {
            day: "Luni",
            events: [
                "17:00 - 17:45 | Antrenor: Raul Hurdu & Andrei Dobră | 4-10 ani",
                "17:45 - 18:30 | Antrenor: Alex Băilă & Radu Mareș | +10 ani",
                "19:00 - 20:30 | Antrenor: Răzvan Tudor | KickBox"
            ]
        },
        {
            day: "Marți",
            events: [
                "17:00 - 18:00 | Antrenor: Florin Bîrluț | Începători: 5-10 ani",
                "18:00 - 19:30 | Antrenor: Teodor Băilă & Daniel Cristache | Avansați: +8 ani",
                "19:30 - 21:00 | Antrenor: Florin Bîrluț | Performanță: +12 ani"
            ]
        },
        {
            day: "Miercuri",
            events: [
                "17:00 - 17:45 | Antrenor: Raul Hurdu & Andrei Dobră | 4-10 ani",
                "17:45 - 18:30 | Antrenor: Alex Băilă & Radu Mareș | +10 ani",
                "19:00 - 20:30 | Antrenor: Răzvan Tudor | KickBox"
            ]
        },
        {
            day: "Joi",
            events: [
                "17:00 - 18:00 | Antrenor: Florin Bîrluț | Începători: 5-10 ani",
                "18:00 - 19:30 | Antrenor: Teodor Băilă & Daniel Cristache | Avansați: +8 ani",
                "19:30 - 21:00 | Antrenor: Florin Bîrluț | Performanță: +12 ani"
            ]
        },
        {
            day: "Vineri",
            events: [
                "18:00 - 19:30 | Antrenor: Răzvan Tudor | KickBox",
                "19:30 - 21:00 | Antrenor: Florin Bîrluț | Performanță"
            ]
        }
    ],
    "Cristian": [
        {
            day: "Marți",
            events: [
                "17:30 - 18:30 | Antrenor: Laurențiu Tatu | Grupa Mică",
                "18:30 - 19:30 | Antrenor: Laurențiu Tatu | Grupa Mare"
            ]
        },
        {
            day: "Joi",
            events: [
                "17:30 - 18:30 | Antrenor: Laurențiu Tatu | Grupa Mică",
                "18:30 - 19:30 | Antrenor: Laurențiu Tatu | Grupa Mare"
            ]
        }
    ],
    "Cisnădie": [
        {
            day: "Marți",
            events: [
                "17:30 - 18:30 | Antrenor: Alex Băilă | Grupa 1"
            ]
        },
        {
            day: "Joi",
            events: [
                "17:30 - 18:30 | Antrenor: Alex Băilă | Grupa 1"
            ]
        }
    ]
};

const OrarSwiper = () => {
    // Starea care urmărește locația selectată (implicit Sibiu)
    const [activeLocation, setActiveLocation] = useState("Sibiu");

    return (
        <section className="orar-section">
            <h2 className="section-title-orar">Program Antrenamente</h2>

            {/* --- BANNER NOUTATE V2 --- */}
            <div className="new-locations-banner" data-aos="fade-down">
                <div className="banner-content">
                    <p>
                        <strong>GRUPE NOI DESCHISE ÎN </strong> <span className="highlight-loc">CRISTIAN</span> & <span className="highlight-loc">CISNĂDIE</span>!
                        
                    </p>
                </div>
            </div>

            {/* TAB-URI PENTRU LOCAȚII */}
            <div className="location-tabs" data-aos="fade-up" data-aos-delay="100">
                {Object.keys(schedules).map((loc) => (
                    <button
                        key={loc}
                        className={`loc-tab ${activeLocation === loc ? "active" : ""}`}
                        onClick={() => setActiveLocation(loc)}
                    >
                        {loc}
                        {/* Afișăm badge-ul de "NOU" doar pentru Cristian și Cisnădie */}
                        {(loc === "Cristian" || loc === "Cisnădie") && (
                            <span className="new-badge">NOU</span>
                        )}
                    </button>
                ))}
            </div>

            <div className="orar-carousel-wrapper" data-aos="fade-up" data-aos-delay="200">
                <Swiper
                    key={activeLocation} 
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true, dynamicBullets: true }}
                    loop={false} 
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 1, spaceBetween: 20 },
                        768: { slidesPerView: 2, spaceBetween: 30 },
                        1024: { slidesPerView: 3, spaceBetween: 40 },
                    }}
                    className="orar-swiper"
                >
                    {schedules[activeLocation].map((item, index) => (
                        <SwiperSlide key={index}>
                            <div className="orar-card">
                                <h3 className="orar-day">{item.day}</h3>
                                <ul className="orar-list">
                                    {item.events.map((event, idx) => (
                                        <li key={idx}>
                                            {event.split('|').map((part, i) => (
                                                <span key={i} className={`orar-part part-${i}`}>
                                                    {part.trim()}
                                                </span>
                                            ))}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default OrarSwiper;