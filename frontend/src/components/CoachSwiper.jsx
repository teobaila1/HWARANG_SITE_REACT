// src/components/CoachSwiper.jsx
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Coaches.css";

const coachData = [
  {
    nume: "Florin Bîrluț",
    descriere: "Președintele clubului, antrenor principal cu experiență națională și internațională în Taekwon-Do ITF",
    imagine: "/images/florin.jpg",
  },
  {
    nume: "Răzvan Tudor",
    descriere: "Antrenor Kickboxing, instructor certificat și multiplu campion național",
    imagine: "/images/coach2.jpg",
  },
  {
    nume: "Alex Băilă",
    descriere: "Antrenor/Sportiv",
    imagine: "/images/coach3.jpg",
  },
  {
    nume: "Teodor Băilă",
    descriere: "Antrenor/Sportiv",
    imagine: "/images/coach3.jpg",
  },
  {
    nume: "Raul Hurdu",
    descriere: "Antrenor/Sportiv",
    imagine: "/images/coach3.jpg",
  },
  {
    nume: "Daniel Cristache",
    descriere: "Antrenor/Sportiv",
    imagine: "/images/coach4.jpg",
  },
];

const CoachSwiper = () => {
  return (
    <div className="coach-carousel">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={40}
        slidesPerView={3}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {coachData.map((coach, index) => (
          <SwiperSlide key={index}>
            <div className="coach-card">
              <img src={coach.imagine} alt={coach.nume} />
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
