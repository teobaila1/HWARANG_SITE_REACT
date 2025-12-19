// src/components/CoachSwiper.jsx
import {Navigation, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../static/css/Coaches.css";

const coachData = [
    {
        nume: "Florin Bîrluț",
        descriere: "Președintele clubului, antrenor principal, multiplu campion național, european și mondial",
        imagine: "/images/people/florin.jpg",
    },
    {
        nume: "Răzvan Tudor",
        descriere: "Antrenor Kickboxing, instructor certificat, multiplu campion european și național",
        imagine: "/images/people/razvan_golden_boy.jpg",
    },
    {
        nume: "Alexandru Băilă",
        descriere: "Instructor, sportiv, multiplu campion național, balcanic, medaliat la campionatele europene și mondiale",
        imagine: "/images/people/alex_poza_edit.jpg",
    },
    {
        nume: "Teodor Băilă",
        descriere: "Instructor, sportiv, multiplu campion național, balcanic, medaliat la campionatele europene",
        imagine: "/images/people/teo_baila.jpg",
    },
    {
        nume: "Raul Hurdu",
        descriere: "Instructor, sportiv, multiplu campion național, campion european la proba de Tehnici Speciale echipe",
        imagine: "/images/people/raul_hurdu_senior.jpg",
    },
    {
        nume: "Andrei Dobră",
        descriere: "Instructor/Sportiv",
        imagine: "/images/people/dobrel1.jpg",
    },
    {
        nume: "Daniel Cristache",
        descriere: "Instructor/Sportiv",
        imagine: "/images/people/dani.jpg",
    },
    {
        nume: "Radu Mareș",
        descriere: "Instructor/Sportiv",
        imagine: "/images/people/radu.jpg",
    },
    {
        nume: "Laurențiu Tatu",
        descriere: "Instructor",
        imagine: "/images/people/lau2.jpg",
    },
];

const CoachSwiper = () => {
    return (
        <div className="coach-carousel">
            <Swiper
                modules={[Navigation, Pagination]}
                navigation={true}
                pagination={{clickable: true, dynamicBullets: true}}
                grabCursor={true}
                loop={true}
                centeredSlides={true} /* Esențial pentru mobil */
                breakpoints={{
                    // Mobil: Arată 1 card și un pic din următorul (1.15)
                    0: {
                        slidesPerView: 1.15,
                        spaceBetween: 15,
                    },
                    // Tabletă
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                        centeredSlides: false, // Pe tabletă nu mai centrăm forțat
                    },
                    // Desktop
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 40,
                        centeredSlides: false,
                    },
                }}
            >
                {coachData.map((coach, index) => (
                    <SwiperSlide key={index}>
                        <div className="coach-card">
                            <div className="img-wrapper">
                                <img src={coach.imagine} alt={coach.nume} loading="lazy"/>
                            </div>
                            <h3>{coach.nume}</h3>
                            <p>{coach.descriere}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default CoachSwiper;