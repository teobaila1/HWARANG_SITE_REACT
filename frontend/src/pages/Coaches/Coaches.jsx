import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../../static/css/Coaches.css";
import CoachSwiper from "../../components/CoachSwiper";

const Coaches = () => {
  return (
    <>
      <Navbar />
      <section className="coaches-container">
        <h2 className="coaches-title">Antrenorii noștri</h2>
        <CoachSwiper />
        <div className="about-motto">
          <h2>IF YOU WANT TO BE THE BEST, TRAIN WITH THE BEST</h2>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Coaches;
