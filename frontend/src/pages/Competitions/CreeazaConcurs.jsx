import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/FormConcurs.css";


const CreeazaConcurs = () => {
    const [nume, setNume] = useState("");
    const [locatie, setLocatie] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [status, setStatus] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const rol = localStorage.getItem("rol");
        if (rol !== "admin") navigate("/access-denied");
    }, [navigate]);

    const formatPerioada = () => {
        if (!startDate || !endDate) return "";
        const ziStart = String(startDate.getDate()).padStart(2, "0");
        const lunaStart = String(startDate.getMonth() + 1).padStart(2, "0");
        const ziEnd = String(endDate.getDate()).padStart(2, "0");
        const lunaEnd = String(endDate.getMonth() + 1).padStart(2, "0");
        return `${ziStart}.${lunaStart} – ${ziEnd}.${lunaEnd}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const perioada = formatPerioada();
        if (!perioada) {
            setStatus("Selectează perioada!");
            return;
        }

        const data = { nume, perioada, locatie };

        const res = await fetch("http://localhost:5000/adauga_concurs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            setStatus("Concurs adăugat cu succes!");
            setNume(""); setLocatie(""); setStartDate(null); setEndDate(null);
        } else {
            setStatus("Eroare la salvare.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="form-concurs-wrapper">
                <h2>Adaugă un nou concurs</h2>
                <form className="form-concurs" onSubmit={handleSubmit}>
                    <label>Nume concurs:</label>
                    <input value={nume} onChange={(e) => setNume(e.target.value)} required />

                    <label>Perioada desfășurării:</label>
                    <div className="date-range-picker">
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="Data început"
                            dateFormat="dd.MM.yyyy"
                            required
                        />
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            placeholderText="Data final"
                            dateFormat="dd.MM.yyyy"
                            required
                        />
                    </div>

                    <label>Locație:</label>
                    <input value={locatie} onChange={(e) => setLocatie(e.target.value)} required />

                    <button type="submit">Salvează concursul</button>
                    {status && <p className="status-msg">{status}</p>}
                </form>
            </div>
        </>
    );
};

export default CreeazaConcurs;
