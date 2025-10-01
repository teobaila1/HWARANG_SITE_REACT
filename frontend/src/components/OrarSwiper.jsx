import {Navigation, Pagination} from "swiper/modules";
import {SwiperSlide, Swiper} from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../static/css/Orar.css";

const orarData = [
    {
        zi: "Luni",
        programe: [
            "17:00 - 17:45 | Antrenor: Raul Hurdu & Andrei Dobră | 4-10 ani",
            "17:00 - 17:45 | Antrenor: Alex Băilă & Radu Mareș | +10 ani",
            "19:00 - 20:30 | Antrenor: Răzvan Tudor | KickBox"
        ]
    },
    {
        zi: "Marți",
        programe: [
            "17:00 - 18:00 | Antrenor: Florin Bîrluț | Începători 5-10 ani",
            "18:00 - 19:30 | Antrenor: Teodor Băilă & Daniel Cristache | Avansați +8 ani",
            "19:30 - 21:00 | Antrenor: Florin Bîrluț | Performanță +12 ani"
        ]
    },
    {
        zi: "Miercuri",
        programe: [
            "17:00 - 17:45 | Antrenor: Raul Hurdu & Andrei Dobră | 4-10 ani",
            "17:00 - 17:45 | Antrenor: Alex Băilă & Radu Mareș | +10 ani",
            "19:00 - 20:30 | Antrenor: Răzvan Tudor | KickBox"
        ]
    },
    {
        zi: "Joi",
        programe: [
            "17:00 - 18:00 | Antrenor: Florin Bîrluț | Începători: 5-10 ani",
            "18:00 - 19:30 | Antrenor: Teodor Băilă & Daniel Cristache | Avansați: +8 ani",
            "19:30 - 21:00 | Antrenor: Florin Bîrluț | Performanță: +12 ani"
        ]
    },
    {
        zi: "Vineri",
        programe: [
            "18:00 - 19:30 | Antrenor: Răzvan Tudor | KickBox",
            "19:30 - 21:00 | Antrenor: Florin Bîrluț | Performanță"
        ]
    },
    {
        zi: "Sâmbătă",
        programe: [
            "10:00 - 11:00 | Antrenor: Florin Bîrluț | Tull",

            "11:00 - 12:00 | Antrenor: Florin Bîrluț | Spargeri forță",

            "12:00 - 13:00 | Antrenor: Florin Bîrluț | Tehnici Speciale"
        ]
    }
];

const OrarSwiper = () => {
    return (
            <div className="orar-carousel">
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{clickable: true}}
                    spaceBetween={40}
                    slidesPerView={3}
                    breakpoints={{
                        0: {slidesPerView: 1},
                        768: {slidesPerView: 2},
                        1024: {slidesPerView: 3}
                    }}
                >
                    {orarData.map((zi, index) => (
                        <SwiperSlide key={index}>
                            <div className="orar-card">
                                <h2 className="orar-title">{zi.zi}</h2>
                                {zi.programe.map((linie, i) => (
                                    <p key={i}>{linie}</p>
                                ))}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
    );
};

export default OrarSwiper;