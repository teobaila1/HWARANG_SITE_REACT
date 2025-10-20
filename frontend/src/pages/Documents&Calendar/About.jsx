import React from "react";
import Footer from "../../components/Footer";
import "../../../static/css/About.css";
import Navbar from "../../components/Navbar";

const About = () => {
  return (
    <>
        <Navbar/>

      <section className="about-section">
        <h1 className="about-title">ACS Hwarang Academy</h1>
        <div className="about-paragraph">
          <p>
            Clubul Hwarang Sibiu a fost fondat în anul 1997, de către Enache Valentin, iar din anul 2001,
            președintele clubului este Florin Bîrluț, un antrenor de Taekwon-Do cu o vastă experiență.
            De atunci, pentru el, nu a existat competiție națională la care să nu obțină cel puțin o medalie.
            Astăzi, ACS Hwarang Sibiu este recunoscut ca unul dintre cluburile de top din țară în Taekwon-Do ITF,
            având sportivi medaliați pe plan național, european și mondial. În anul 2016 a luat naștere partea de KickBoxing,
            actuala echipă Champions K1 Sibiu, condusă de către președintele și antrenorul Răzvan Tudor.
          </p>

          <p>
            Numele „Hwarang” are origine coreeană, în cultura vechiului regat coreean Silla,
            Hwarang (화랑) însemna literal „tineri înfloritori” și desemna un grup de elită de tineri războinici
            devotați atât pregătirii marțiale, cât și educației morale și artistice.
            Prin alegerea acestui nume, clubul sugerează aspirația de a forma sportivi integri, curajoși și bine pregătiți,
            asemenea spiritului Hwarang din tradiția coreeană.
          </p>
        </div>

        <h1 className="about-title">O singură familie unită</h1>
        <div className="about-paragraph">
          <p>
            Fiecare grupă de vârstă de la Hwarang Sibiu beneficiază de îndrumarea unui antrenor dedicat,
            asigurându-se astfel o pregătire adaptată nivelului și obiectivelor sportivilor.
            Sub conducerea domnului Florin Bîrluț, clubul pune accent pe disciplină, muncă și dezvoltarea pe termen lung,
            filosofie evidențiată de afirmația antrenorului: „Succesul este 5% talent și 95% muncă”.
          </p>

          <p>
            Promovăm performanța la cel mai înalt nivel, pregătind sportivi pentru competiții naționale și internaționale,
            dar ne asigurăm că fiecare antrenament contribuie și la dezvoltarea personală a fiecărui practicant.
            Prin disciplină, respect și atenție la detalii, modelăm nu doar campioni, ci și oameni responsabili,
            determinați și echilibrați.
          </p>

          <p>
            În cadrul clubului nostru, fiecare sportiv este încurajat să își atingă potențialul maxim,
            indiferent dacă își dorește să facă performanță sau doar să se bucure de mișcare.
            Astfel, la ACS Hwarang Sibiu, Taekwon-Do-ul nu este doar un sport, ci o cale de viață.
          </p>
        </div>

        <div className="about-motto">
          <h2>IF YOU WANT TO BE THE BEST, TRAIN WITH THE BEST</h2>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;
