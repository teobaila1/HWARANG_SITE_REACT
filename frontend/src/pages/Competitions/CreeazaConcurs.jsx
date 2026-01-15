import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../static/css/FormConcurs.css";
import { API_BASE } from "../../config";

const CreeazaConcurs = () => {
    const [nume, setNume] = useState("");
    const [locatie, setLocatie] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [cereInaltime, setCereInaltime] = useState(false);
    const [status, setStatus] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const rol = localStorage.getItem("rol");
        if (rol !== "admin") navigate("/access-denied");
    }, [navigate]);

    // --- MODIFICARE AICI: Adăugăm anul ---
    const formatPerioada = () => {
        if (!startDate || !endDate) return "";

        const ziStart = String(startDate.getDate()).padStart(2, "0");
        const lunaStart = String(startDate.getMonth() + 1).padStart(2, "0");
        const anStart = startDate.getFullYear();

        const ziEnd = String(endDate.getDate()).padStart(2, "0");
        const lunaEnd = String(endDate.getMonth() + 1).padStart(2, "0");
        const anEnd = endDate.getFullYear();

        // Dacă începe și se termină în același an, punem anul doar la final
        if (anStart === anEnd) {
            return `${ziStart}.${lunaStart} – ${ziEnd}.${lunaEnd}.${anEnd}`;
        }

        // Dacă trece în anul următor (ex: revelion), punem anul la ambele
        return `${ziStart}.${lunaStart}.${anStart} – ${ziEnd}.${lunaEnd}.${anEnd}`;
    };
    // -------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();
        const perioada = formatPerioada();
        if (!perioada) {
            setStatus("Selectează perioada!");
            return;
        }

        const data = { nume, perioada, locatie, cere_inaltime: cereInaltime };
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE}/api/adauga_concurs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            setStatus("Concurs adăugat cu succes!");
            setNume(""); setLocatie(""); setStartDate(null); setEndDate(null); setCereInaltime(false);
        } else {
            setStatus("Eroare la salvare.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="admin-create-scope page-container">
                <div className="create-card">
                    <h2>Adaugă un nou concurs</h2>
                    <form onSubmit={handleSubmit}>

                        <label>Nume concurs</label>
                        <input
                            type="text"
                            value={nume}
                            onChange={(e) => setNume(e.target.value)}
                            placeholder="Ex: Cupa României"
                            required
                        />

                        <label>Perioada desfășurării</label>
                        <div className="date-grid">
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

                        <label>Locație</label>
                        <input
                            type="text"
                            value={locatie}
                            onChange={(e) => setLocatie(e.target.value)}
                            placeholder="Ex: Sala Polivalentă, Sibiu"
                            required
                        />

                        <label className="checkbox-wrapper">
                            <input
                                type="checkbox"
                                checked={cereInaltime}
                                onChange={(e) => setCereInaltime(e.target.checked)}
                            />
                            <span className="custom-check-box"></span>
                            <span className="checkbox-text">
                                Acest concurs necesită înălțimea sportivilor?
                            </span>
                        </label>

                        <button type="submit" className="btn-save">Salvează concursul</button>

                        {status && (
                            <p className={`status-msg ${status.includes("succes") ? "success" : "error"}`}>
                                {status}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreeazaConcurs;