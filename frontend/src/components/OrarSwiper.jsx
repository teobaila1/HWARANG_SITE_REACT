import React from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../static/css/Orar.css";

const scheduleData = [
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
];

const OrarSwiper = () => {
    return (
        <section className="orar-section">
            <h2 className="section-title-orar">Program Antrenamente</h2>
            <div className="orar-carousel-wrapper">
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true, dynamicBullets: true }}
                    loop={true} /* <--- AICI ESTE MODIFICAREA PENTRU LOOP INFINIT */
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 1, spaceBetween: 20 },
                        768: { slidesPerView: 2, spaceBetween: 30 },
                        1024: { slidesPerView: 3, spaceBetween: 40 },
                    }}
                    className="orar-swiper"
                >
                    {scheduleData.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div className="orar-card">
                                <h3 className="orar-day">{item.day}</h3>
                                <ul className="orar-list">
                                    {item.events.map((event, idx) => (
                                        <li key={idx}>
                                            {/* Împărțim textul la '|' pentru a-l stila frumos */}
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