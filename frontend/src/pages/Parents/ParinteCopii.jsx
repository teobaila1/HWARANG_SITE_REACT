import React, {useEffect, useState} from "react";
import Navbar from "../../components/Navbar";
import {useNavigate} from "react-router-dom";
import "../../../static/css/ParinteCopii.css";
import {API_BASE} from "../../config";

const ParinteCopii = () => {
    const [copii, setCopii] = useState([]);
    const [nume, setNume] = useState("");
    const [varsta, setVarsta] = useState("");
    const [grupa, setGrupa] = useState("");
    const [gen, setGen] = useState("");
    const navigate = useNavigate();

    const fetchCopii = async () => {
        const res = await fetch(`${API_BASE}/api/copiii_mei`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: localStorage.getItem("username")}),
        });

        const result = await res.json();
        if (result.status === "success") {
            setCopii(result.copii);
        }
    };

    useEffect(() => {
        fetchCopii();
    }, []);

    useEffect(() => {
        const rol = localStorage.getItem("rol");
        if (rol !== "Parinte" && rol !== "admin") {
            navigate("/access-denied");
        }
    }, []);

    const handleAddCopil = async (e) => {
        e.preventDefault();

        const payload = {
            username: localStorage.getItem("username"),
            nume,
            varsta,
            grupa,
            gen,  // ← Adăugat aici
        };

        const res = await fetch(`${API_BASE}/api/adauga_copil`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (result.status === "success") {
            setNume("");
            setVarsta("");
            setGrupa("");
            setGen("");
            fetchCopii(); // reîncarcă lista
        } else {
            alert("Eroare la adăugarea copilului.");
        }
    };

    return (
        <>
            <Navbar/>
            <div className="copii-parinte">
                <h2>Copiii mei înregistrați</h2>

                {copii.length === 0 ? (
                    <p>Nu ai copii înregistrați.</p>
                ) : (
                    <ul>
                        {copii.map((copil, index) => (
                            <li key={index} className="kid-item">
                                <div className="kid-row">
                                    <span className="kid-label">Nume:</span>
                                    <span className="kid-value">{copil.nume}</span>
                                </div>
                                <div className="kid-row">
                                    <span className="kid-label">Gen:</span>
                                    <span className="kid-chip">{copil.gen ?? "N/A"}</span>
                                </div>
                                <div className="kid-row">
                                    <span className="kid-label">Vârstă:</span>
                                    <span className="kid-value">{copil.varsta} ani</span>
                                </div>
                                <div className="kid-row">
                                    <span className="kid-label">Grupa:</span>
                                    <span className="kid-value">{copil.grupa}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <hr/>
                <h3>Adaugă un copil</h3>
                <form onSubmit={handleAddCopil} className="formular-copil">
                    <input
                        type="text"
                        placeholder="Nume copil"
                        value={nume}
                        onChange={(e) => setNume(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Vârstă"
                        value={varsta}
                        onChange={(e) => setVarsta(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Grupa"
                        value={grupa}
                        onChange={(e) => setGrupa(e.target.value)}
                        required
                    />
                    <select value={gen} onChange={(e) => setGen(e.target.value)} required>
                        <option value="">Selectează genul</option>
                        <option value="Masculin">Masculin</option>
                        <option value="Feminin">Feminin</option>
                    </select>

                    <button type="submit">Adaugă copil</button>
                </form>
            </div>
        </>
    );
};

export default ParinteCopii;
