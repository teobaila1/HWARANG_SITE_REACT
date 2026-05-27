import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import "../../../static/css/InscrieriEveniment.css";

const API_BASE_URL = "https://backend-hwarang-new.onrender.com";

const GRADE_TAEKWONDO = [
    "10 GUP (Albă)", "9 GUP (Alb cu Galbenă)", "8 GUP (Galbenă)", "7 GUP (Galbenă cu Verde)",
    "6 GUP (Verde)", "5 GUP (Verde cu Albastră)", "4 GUP (Albastră)", "3 GUP (Albastră cu Roșie)",
    "2 GUP (Roșie)", "1 GUP (Roșie cu Neagră)",
    "1 DAN (Neagră)", "2 DAN", "3 DAN", "4 DAN", "5 DAN", "6 DAN"
];

const InscriereEveniment = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    const eveniment = location.state?.eveniment;
    const isExamen = eveniment?.titlu?.toLowerCase().includes('examen');

    const [copii, setCopii] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [gradeCopii, setGradeCopii] = useState({});
    
    const [inscrieriManuale, setInscrieriManuale] = useState([]);
    const [numeManual, setNumeManual] = useState("");
    const [prenumeManual, setPrenumeManual] = useState("");
    const [gradCurentManual, setGradCurentManual] = useState("");
    const [gradViitorManual, setGradViitorManual] = useState("");

    useEffect(() => {
        if (!eveniment) {
            navigate("/calendar");
            return;
        }
        fetchCopiiiMei();
    }, [eveniment, navigate]);

    const fetchCopiiiMei = () => {
        const token = localStorage.getItem("token");
        fetch(`${API_BASE_URL}/api/copiii_mei`, { 
            headers: { 'x-access-token': token }
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) setCopii(data);
        })
        .catch(err => console.error("Eroare preluare copii:", err));
    };

    const toggleSelect = (copilId) => {
        if (selectedIds.includes(copilId)) {
            setSelectedIds(prev => prev.filter(id => id !== copilId));
        } else {
            setSelectedIds(prev => [...prev, copilId]);
            setGradeCopii(prev => ({ ...prev, [copilId]: { curent: "", viitor: "" } }));
        }
    };

    const handleGradCopilChange = (copilId, tipGrad, valoare) => {
        setGradeCopii(prev => ({
            ...prev,
            [copilId]: { ...prev[copilId], [tipGrad]: valoare }
        }));
    };

    const adaugaParticipantManual = () => {
        if (!numeManual.trim() || !prenumeManual.trim() || !gradCurentManual) {
            alert("Te rog completează Numele, Prenumele și Gradul Curent!");
            return;
        }
        setInscrieriManuale([...inscrieriManuale, { 
            nume: numeManual, 
            prenume: prenumeManual, 
            grad_curent: gradCurentManual,
            grad_viitor: isExamen ? gradViitorManual : ""
        }]);
        setNumeManual(""); setPrenumeManual("");
        setGradCurentManual(""); setGradViitorManual("");
    };

    const stergeParticipantManual = (index) => {
        const noiInscrieri = [...inscrieriManuale];
        noiInscrieri.splice(index, 1);
        setInscrieriManuale(noiInscrieri);
    };

    const handleSave = () => {
        if (selectedIds.length === 0 && inscrieriManuale.length === 0) {
            alert("Te rog selectează sau adaugă manual cel puțin un participant!");
            return;
        }

        for (let sp_id of selectedIds) {
            if (!gradeCopii[sp_id]?.curent) {
                alert("Te rog selectează Gradul Curent pentru toți sportivii bifați!");
                return;
            }
        }

        const sportiviDeTrimis = selectedIds.map(id => ({
            id: id,
            grad_curent: gradeCopii[id]?.curent || "",
            grad_viitor: isExamen ? (gradeCopii[id]?.viitor || "") : ""
        }));

        const token = localStorage.getItem("token");
        
        fetch(`${API_BASE_URL}/api/calendar/evenimente/${id}/inscriere`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({ 
                sportivi_selectati: sportiviDeTrimis,
                inscrieri_manuale: inscrieriManuale 
            })
        })
        .then(res => {
            if(res.ok) {
                alert("Înscriere realizată cu succes!");
                navigate("/calendar");
            } else {
                alert("A apărut o eroare la salvarea înscrierilor.");
            }
        });
    };

    if (!eveniment) return null;

    const totalParticipanti = selectedIds.length + inscrieriManuale.length;

    return (
        <div className="insc-ev-wrapper">
            <Navbar />
            <div className="insc-ev-container">
                <div className="insc-ev-header">
                    <h1><i className="fas fa-edit"></i> Înscriere: {eveniment.titlu}</h1>
                    <button className="insc-ev-btn-cancel" onClick={() => navigate("/calendar_club")}>
                        <i className="fas fa-arrow-left"></i> Înapoi
                    </button>
                </div>

                {/* --- SECTIUNEA 1: Profil --- */}
                <h3 className="insc-ev-section-title"><i className="fas fa-users"></i> Selectează din profil</h3>
                <div className="insc-ev-table-wrapper">
                    <table className="insc-ev-table">
                        <thead>
                            <tr>
                                <th style={{ width: '60px', textAlign: 'center' }}>Bifează</th>
                                <th>Nume și Prenume Copil</th>
                                <th>{isExamen ? "Setează Gradele" : "Setează Gradul Curent"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {copii.length === 0 ? (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: 'var(--hw-muted)' }}>
                                        <i className="fas fa-user-slash" style={{ marginRight: '8px' }}></i>
                                        Nu ai niciun copil salvat în profil. Adaugă-te manual mai jos.
                                    </td>
                                </tr>
                            ) : (
                                copii.map(c => {
                                    const isSelected = selectedIds.includes(c.id);
                                    return (
                                        <tr key={c.id} onClick={() => !isSelected && toggleSelect(c.id)} style={{ cursor: isSelected ? "default" : "pointer" }}>
                                            <td style={{ textAlign: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    className="insc-ev-checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleSelect(c.id)}
                                                    onClick={(e) => e.stopPropagation()} 
                                                />
                                            </td>
                                            <td style={{ fontWeight: isSelected ? "700" : "500", color: isSelected ? 'var(--hw-text)' : 'var(--hw-muted)' }}>
                                                {c.nume} {c.prenume}
                                            </td>
                                            <td>
                                                {isSelected && (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '300px' }}>
                                                        <select 
                                                            className="insc-ev-input" 
                                                            value={gradeCopii[c.id]?.curent || ""}
                                                            onChange={(e) => handleGradCopilChange(c.id, 'curent', e.target.value)}
                                                        >
                                                            <option value="">-- Alege Grad Curent --</option>
                                                            {GRADE_TAEKWONDO.map(g => <option key={g} value={g}>{g}</option>)}
                                                        </select>

                                                        {isExamen && (
                                                            <select 
                                                                className="insc-ev-input" 
                                                                value={gradeCopii[c.id]?.viitor || ""}
                                                                onChange={(e) => handleGradCopilChange(c.id, 'viitor', e.target.value)}
                                                            >
                                                                <option value="">-- Examen pentru Grad --</option>
                                                                {GRADE_TAEKWONDO.map(g => <option key={g} value={g}>{g}</option>)}
                                                            </select>
                                                        )}
                                                    </div>
                                                )}
                                                {!isSelected && <span style={{ color: 'var(--hw-faint)', fontSize: '0.9rem' }}>Bifează pentru a alege gradul</span>}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- SECTIUNEA 2: Manual --- */}
                <h3 className="insc-ev-section-title"><i className="fas fa-pen"></i> Adaugă manual</h3>
                
                <div className="manual-scroll-wrapper">
                    <div className="manual-form-inner">
                        <input 
                            type="text" placeholder="Nume" className="insc-ev-input" style={{ flex: '1' }}
                            value={numeManual} onChange={e => setNumeManual(e.target.value)}
                        />
                        <input 
                            type="text" placeholder="Prenume" className="insc-ev-input" style={{ flex: '1' }}
                            value={prenumeManual} onChange={e => setPrenumeManual(e.target.value)}
                        />
                        
                        <select 
                            className="insc-ev-input" style={{ flex: '1.5' }}
                            value={gradCurentManual} onChange={e => setGradCurentManual(e.target.value)}
                        >
                            <option value="">-- Grad Curent --</option>
                            {GRADE_TAEKWONDO.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>

                        {isExamen && (
                            <select 
                                className="insc-ev-input" style={{ flex: '1.5' }}
                                value={gradViitorManual} onChange={e => setGradViitorManual(e.target.value)}
                            >
                                <option value="">-- Examen pt. Grad --</option>
                                {GRADE_TAEKWONDO.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        )}
                        
                        <button type="button" className="insc-ev-btn-add" onClick={adaugaParticipantManual}>
                            <i className="fas fa-plus"></i> Adaugă
                        </button>
                    </div>
                </div>

                {inscrieriManuale.length > 0 && (
                    <ul className="manual-list">
                        {inscrieriManuale.map((pers, idx) => (
                            <li key={idx}>
                                <div className="manual-list-text">
                                    <strong>{pers.nume} {pers.prenume}</strong>
                                    <span>
                                        Grad Curent: <b>{pers.grad_curent}</b> 
                                        {isExamen && pers.grad_viitor && ` | Examen pentru: `} 
                                        {isExamen && pers.grad_viitor && <b style={{color: 'var(--hw-red)'}}>{pers.grad_viitor}</b>}
                                    </span>
                                </div>
                                <button type="button" className="btn-remove-manual" onClick={() => stergeParticipantManual(idx)}>
                                    <i className="fas fa-trash-alt"></i> Șterge
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <button className="insc-ev-btn-submit" onClick={handleSave}>
                    <i className="fas fa-paper-plane"></i> Trimite Înscrierea ({totalParticipanti} {totalParticipanti === 1 ? 'participant' : 'participanți'})
                </button>
            </div>
        </div>
    );
};

export default InscriereEveniment;