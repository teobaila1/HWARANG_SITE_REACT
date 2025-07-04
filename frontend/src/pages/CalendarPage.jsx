import React from "react";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Calendar.css";
import Navbar from "../components/Navbar";

const CalendarPage = () => {
    const evenimente = [
        {
            data: "31.01 – 02.02",
            activitate: "Stagiul național regional tehnic pentru sportivi și Taekwon-do Kids",
            locatie: "Baia Mare"
        },
        {
            data: "07.02 – 09.02",
            activitate: "Adunarea Generală Ordinară + Seminarul național pentru antrenori, instructori și arbitri",
            locatie: "Târgu Mureș"
        },
        {data: "14.02 – 16.02", activitate: "Curs internațional pentru instructori (IIC)", locatie: "Wales"},
        {
            data: "06.03 – 09.03",
            activitate: "Campionatul național pentru seniori, juniori I, II și III",
            locatie: "Focșani"
        },
        {
            data: "21.03 – 23.03",
            activitate: "Stagiul național regional tehnic pentru sportivi și Taekwon-do Kids",
            locatie: "Târgu Mureș"
        },
        {
            data: "29.03 – 30.03",
            activitate: "Curs internațional de calificare pentru arbitri (QUIC)",
            locatie: "Newcastle, Anglia"
        },
        {
            data: "06.04 – 13.04",
            activitate: "Pregătirea centralizată a lotului național pentru Campionatul European",
            locatie: "(de stabilit)"
        },
        {
            data: "24.04 – 27.04",
            activitate: "Campionatul European pentru seniori, juniori I și II",
            locatie: "Sarajevo, Bosnia și Herțegovina"
        },
        {
            data: "02.05 – 04.05",
            activitate: "Stagiul național regional tehnic pentru sportivi și Taekwon-do Kids",
            locatie: "Vaslui"
        },
        {data: "30.05 – 31.05", activitate: "Cupa Moldovei pentru juniori I, II, III", locatie: "Vaslui"},
        {data: "27.06 – 28.06", activitate: "Cupa memorială „Gyuri Mazas”", locatie: "Cluj-Napoca"},
        {
            data: "05.09 – 07.09",
            activitate: "Seminarul național pentru antrenori, instructori și arbitri",
            locatie: "București"
        },
        {
            data: "21.09 – 28.09",
            activitate: "Pregătirea centralizată a lotului național pentru Campionatul Mondial",
            locatie: "(de stabilit)"
        },
        {
            data: "07.10 – 12.10",
            activitate: "Campionatul Mondial pentru seniori, juniori I și II",
            locatie: "Poreč, Croația"
        },
        {data: "24.10 – 26.10", activitate: "Cupa Vrancea pentru juniori II și III", locatie: "Focșani"},
        {data: "06.11 – 09.11", activitate: "Cupa României pentru seniori, juniori I, II și III", locatie: "Baia Mare"},
        {data: "14.11 – 16.11", activitate: "Curs internațional pentru instructori (IIC)", locatie: "Trnava, Slovacia"},
        {data: "28.11 – 30.11", activitate: "Jaguar Open Cup", locatie: "Târgu Mureș"},
    ];

    return (
        <>
            <Navbar/>
            <div className="calendar-container">
                <h2 className="calendar-title">Calendar Competiții 2025</h2>
                {/*<table className="calendar-table">*/}
                {/*    <thead>*/}
                {/*    <tr>*/}
                {/*        <th>Data / Perioada</th>*/}
                {/*        <th>Activitate</th>*/}
                {/*        <th>Localitate</th>*/}
                {/*    </tr>*/}
                {/*    </thead>*/}
                {/*    <tbody>*/}
                {/*    {evenimente.map((e, index) => (*/}
                {/*        <tr key={index}>*/}
                {/*            <td>{e.data}</td>*/}
                {/*            <td>{e.activitate}</td>*/}
                {/*            <td>{e.locatie}</td>*/}
                {/*        </tr>*/}
                {/*    ))}*/}
                {/*    </tbody>*/}
                {/*</table>*/}
                <div className="calendar-embed-container">
                    <iframe
                        src="https://calendar.online/98854dafd4cc62b552dd"
                        style={{width: "100%", height: "800px", border: "1px solid red"}}
                        frameBorder="0"
                        scrolling="yes"
                        title="Calendar Online 2025"
                    ></iframe>
                </div>
            </div>

        </>
    );
};

export default CalendarPage;
