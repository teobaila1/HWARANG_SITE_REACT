import React, {useEffect, useState} from "react";
import Navbar from "../../components/Navbar";
import {useNavigate} from "react-router-dom";
import "../../../static/css/ParinteCopii.css";
import {API_BASE} from "../../config";
import MemberCard from "../../components/MemberCard";

const ParinteCopii = () => {
    const [copii, setCopii] = useState([]);
    const [showForm, setShowForm] = useState(false);

    // Stare formular
    const [numeFamilie, setNumeFamilie] = useState("");
    const [prenume, setPrenume] = useState("");
    const [dataNasterii, setDataNasterii] = useState("");
    const [grupa, setGrupa] = useState("");
    const [gen, setGen] = useState("");

    const [selectedChild, setSelectedChild] = useState(null);
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
            setShowForm(false);
        } else {
            alert(result.message || "Eroare la adăugare copil.");
        }
    };

    const getAvatarIcon = (sex) => {
        if (sex === "Feminin") return <i className="fas fa-venus" style={{color: "#ff69b4"}}></i>;
        return <i className="fas fa-mars" style={{color: "#4169e1"}}></i>;
    };

    return (
        <>
            <Navbar/>
            <div className="copii-parinte">
                <h2>Copiii mei</h2>

                {copii.length > 0 && (
                    /* --- SCHIMBARE AICI: Aliniere Stânga --- */
                    <div style={{marginBottom: '40px', textAlign: 'left'}}>
                        <button
                            onClick={() => navigate('/prezenta/familie')}
                            className="btn-action-primary"
                        >
                            <i className="fa-solid fa-calendar-days"></i>
                            Vezi Istoric Prezențe
                        </button>
                    </div>
                )}

                {copii.length === 0 ? (
                    <p className="empty-state" style={{color: '#888', marginBottom: '30px', textAlign: 'left'}}>
                        Nu ai niciun copil înregistrat. Folosește butonul de mai jos.
                    </p>
                ) : (
                    <ul className="kids-grid">
                        {copii.map((copil, index) => (
                            <li key={copil.id || index} className="kid-card">

                                <div className="kid-header">
                                    <div className="kid-avatar-circle">
                                        {getAvatarIcon(copil.gen)}
                                    </div>
                                    <div className="kid-info-main">
                                        <h3>{copil.nume}</h3>
                                        <div className="kid-status active">
                                            <span className="status-dot"></span>
                                            Abonament Activ
                                        </div>
                                    </div>
                                </div>

                                <div className="kid-details">
                                    <div className="detail-item">
                                        <span className="detail-label">Vârstă</span>
                                        <span className="detail-value">
                                            <i className="fas fa-birthday-cake"></i>
                                            {copil.data_nasterii ? `${calculeazaVarsta(copil.data_nasterii)} ani` : "-"}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Grupa</span>
                                        <span className="detail-value">
                                            <i className="fas fa-users"></i>
                                            {copil.grupa || "N/A"}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    className="btn-qr-mini"
                                    onClick={() => setSelectedChild(copil)}
                                >
                                    <i className="fas fa-qrcode"></i> Card Acces Digital
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {selectedChild && (
                    <div className="modal-overlay" onClick={() => setSelectedChild(null)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <MemberCard
                                id={selectedChild.id}
                                nume={selectedChild.nume}
                                titlu={selectedChild.grupa || "Junior Hwarang"}
                            />
                            <button className="btn-close-modal" onClick={() => setSelectedChild(null)}>
                                Închide
                            </button>
                        </div>
                    </div>
                )}

                <hr className="divider-subtle"/>

                <div className="add-child-section">
                    {!showForm ? (
                        <button className="btn-toggle-form" onClick={() => setShowForm(true)}>
                            <i className="fas fa-plus-circle"></i>
                            <span>Înregistrează un copil nou</span>
                        </button>
                    ) : (
                        <div className="form-wrapper-animated">
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '20px'
                            }}>
                                <h3 style={{margin: 0, color: '#fff'}}>Date Copil</h3>

                                {/* Aici aplicăm clasa unică */}
                                <button className="action-close-x" onClick={() => setShowForm(false)}>
                                    <i className="fas fa-times"></i> Anulează
                                </button>

                            </div>

                            <form onSubmit={handleAddCopil} className="formular-copil">
                                <div className="input-group">
                                    <input type="text" placeholder="Nume de familie" value={numeFamilie}
                                           onChange={e => setNumeFamilie(e.target.value)} required/>
                                </div>
                                <div className="input-group">
                                    <input type="text" placeholder="Prenume" value={prenume}
                                           onChange={e => setPrenume(e.target.value)}
                                           required/>
                                </div>
                                <div className="input-group-date">
                                    <label>Data Nașterii:</label>
                                    <input type="date" value={dataNasterii}
                                           onChange={e => setDataNasterii(e.target.value)} required/>
                                </div>
                                <div className="input-group">
                                    <input type="text" placeholder="Grupa (ex: 1, 2)" value={grupa}
                                           onChange={e => setGrupa(e.target.value)}
                                           required/>
                                </div>
                                <div className="input-group" style={{gridColumn: '1 / -1'}}>
                                    <select value={gen} onChange={e => setGen(e.target.value)} required>
                                        <option value="">Selectează Genul</option>
                                        <option value="Masculin">Masculin</option>
                                        <option value="Feminin">Feminin</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn-add">
                                    <i className="fas fa-check"></i> Salvează Copil
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ParinteCopii;