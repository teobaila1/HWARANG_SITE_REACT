import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../../../static/css/ParinteCopii.css";
import { API_BASE } from "../../config";
import MemberCard from "../../components/MemberCard"; // <--- IMPORT NOU

const ParinteCopii = () => {
    const [copii, setCopii] = useState([]);

    // Stare formular
    const [numeFamilie, setNumeFamilie] = useState("");
    const [prenume, setPrenume] = useState("");
    const [dataNasterii, setDataNasterii] = useState("");
    const [grupa, setGrupa] = useState("");
    const [gen, setGen] = useState("");

    // --- STARE PENTRU MODAL CARD ---
    const [selectedChild, setSelectedChild] = useState(null); // Copilul selectat pentru QR

    const navigate = useNavigate();

    useEffect(() => {
        const rol = localStorage.getItem("rol");
        if (!rol) {
            navigate("/autentificare");
        }
        fetchCopii();
    }, []);

    const calculeazaVarsta = (dataString) => {
        if (!dataString) return "";
        const today = new Date();
        const birthDate = new Date(dataString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const fetchCopii = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE}/api/copiii_mei`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const result = await res.json();
            if (result && Array.isArray(result)) {
                setCopii(result);
            } else if (result.status === "success") {
                setCopii(result.copii || []);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddCopil = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const numeComplet = `${numeFamilie.trim()} ${prenume.trim()}`;

        const res = await fetch(`${API_BASE}/api/copiii_mei`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                nume: numeComplet,
                data_nasterii: dataNasterii,
                grupa: grupa,
                gen: gen
            }),
        });

        const result = await res.json();
        if (res.ok) {
            fetchCopii();
            setNumeFamilie("");
            setPrenume("");
            setDataNasterii("");
            setGrupa("");
            setGen("");
        } else {
            alert(result.message || "Eroare la adăugare copil.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="copii-parinte">
                <h2>Copiii mei înregistrați</h2>

                {copii.length === 0 ? (
                    <p>Nu ai copii înregistrați.</p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {copii.map((copil, index) => (
                            <li key={copil.id || index} className="kid-item" style={{ position: "relative" }}>

                                {/*/!* Butonul QR CODE în dreapta sus a cardului copilului *!/*/}
                                {/*<button*/}
                                {/*    onClick={() => setSelectedChild(copil)}*/}
                                {/*    style={{*/}
                                {/*        position: "absolute",*/}
                                {/*        top: "10px",*/}
                                {/*        right: "10px",*/}
                                {/*        background: "transparent",*/}
                                {/*        border: "1px solid #D4AF37",*/}
                                {/*        color: "#D4AF37",*/}
                                {/*        padding: "5px 10px",*/}
                                {/*        borderRadius: "5px",*/}
                                {/*        cursor: "pointer",*/}
                                {/*        fontSize: "0.8rem",*/}
                                {/*        display: "flex",*/}
                                {/*        alignItems: "center",*/}
                                {/*        gap: "5px"*/}
                                {/*    }}*/}
                                {/*>*/}
                                {/*    <i className="fas fa-qrcode"></i> Card Digital*/}
                                {/*</button>*/}

                                <div className="kid-row">
                                    <span className="kid-label">Nume:</span>
                                    <span className="kid-value">{copil.nume}</span>
                                </div>
                                <div className="kid-row">
                                    <span className="kid-label">Vârstă:</span>
                                    <span className="kid-value">
                                        {copil.data_nasterii && `${calculeazaVarsta(copil.data_nasterii)} ani`}
                                    </span>
                                </div>
                                <div className="kid-row">
                                    <span className="kid-label">Grupa:</span>
                                    <span className="kid-value">{copil.grupa}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/* --- MODAL PENTRU CARD --- */}
                {selectedChild && (
                    <div style={{
                        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.85)",
                        display: "flex", justifyContent: "center", alignItems: "center",
                        zIndex: 1000
                    }} onClick={() => setSelectedChild(null)}>

                        <div onClick={(e) => e.stopPropagation()} style={{ position: "relative" }}>
                            {/* Componenta Card */}
                            <MemberCard
                                id={selectedChild.id}
                                nume={selectedChild.nume}
                                titlu={selectedChild.grupa || "Junior Hwarang"}
                            />

                            <button onClick={() => setSelectedChild(null)} style={{
                                marginTop: "20px", width: "100%", padding: "10px",
                                background: "#333", color: "white", border: "none", borderRadius: "5px"
                            }}>
                                Închide
                            </button>
                        </div>
                    </div>
                )}

                <hr />
                <h3>Adaugă un copil</h3>
                <form onSubmit={handleAddCopil} className="formular-copil">
                    {/* ... (restul formularului tău rămâne neschimbat) ... */}
                    <input type="text" placeholder="Nume de familie" value={numeFamilie} onChange={e => setNumeFamilie(e.target.value)} required />
                    <input type="text" placeholder="Prenume" value={prenume} onChange={e => setPrenume(e.target.value)} required />
                    <div style={{display: "flex", flexDirection: "column", textAlign: "left"}}>
                        <label style={{color: "#ccc", fontSize: "0.9rem", marginBottom: "5px", paddingLeft: "5px"}}>Data Nașterii:</label>
                        <input type="date" value={dataNasterii} onChange={e => setDataNasterii(e.target.value)} required style={{fontFamily: "inherit", width: "100%"}} />
                    </div>
                    <input type="text" placeholder="Grupa" value={grupa} onChange={e => setGrupa(e.target.value)} required />
                    <select value={gen} onChange={e => setGen(e.target.value)} required>
                        <option value="">Gen</option>
                        <option value="Masculin">Masculin</option>
                        <option value="Feminin">Feminin</option>
                    </select>
                    <button type="submit" className="btn-add">Adaugă copil</button>
                </form>
            </div>
        </>
    );
};

export default ParinteCopii;