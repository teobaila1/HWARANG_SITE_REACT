import React, { useState, useEffect } from 'react';
import Navbar from "../../components/Navbar";
import "../../../static/css/CalendarClub.css";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://backend-hwarang-new.onrender.com";
const API_URL = `${API_BASE_URL}/api/calendar/evenimente`;

// Verifică dacă un eveniment a trecut (end sau start < acum)
const esteExpirat = (ev) => {
    const ref = ev.end || ev.start;
    if (!ref) return false;
    return new Date(ref) < new Date();
};

const CalendarClub = () => {
    const [events, setEvents]       = useState([]);
    const [rol, setRol]             = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId]       = useState(null);

    // Stare concursuri (pentru tip=Competitie)
    const [concursuri, setConcursuri] = useState([]);

    const [newEvent, setNewEvent] = useState({
        titlu: "", start: "", end: "", locatie: "", descriere: "", tip: "Competitie"
    });

    const navigate = useNavigate();

    useEffect(() => {
        const token   = localStorage.getItem("token");
        const userRol = localStorage.getItem("rol");
        if (!token) { navigate("/autentificare"); return; }
        setRol(userRol);
        fetchEvents();
        fetchConcursuri();
    }, [navigate]);

    useEffect(() => {
        document.body.style.overflow = showModal ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [showModal]);

    const fetchEvents = () => {
        const token = localStorage.getItem("token");
        fetch(API_URL, {
            headers: { 'Content-Type': 'application/json', 'x-access-token': token }
        })
        .then(res => {
            if (res.status === 401) return [];
            if (res.headers.get("content-type")?.includes("application/json")) return res.json();
            return [];
        })
        .then(data => {
            if (Array.isArray(data)) {
                setEvents(data.sort((a, b) => new Date(a.start) - new Date(b.start)));
            }
        })
        .catch(err => console.error("Eroare calendar:", err));
    };

    // Fetch lista de concursuri ca să știm starea lor (inscrieri_deschise)
    const fetchConcursuri = () => {
        fetch(`${API_BASE_URL}/api/concursuri`)
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setConcursuri(data); })
        .catch(err => console.error("Eroare concursuri:", err));
    };

    // Găsește concursul corespunzător unui eveniment după titlu
    const getConcursPentruEveniment = (eveniment) => {
        if (!eveniment.tip || eveniment.tip.toLowerCase() !== "competitie") return null;
        return concursuri.find(c =>
            c.nume?.toLowerCase().trim() === eveniment.titlu?.toLowerCase().trim()
        ) || null;
    };

    // ---- formatări dată ----
    const formatForInput = (iso) => {
        if (!iso) return "";
        const d = new Date(iso);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    };

    const formatShortDate = (iso) => {
        if (!iso) return "";
        const d = new Date(iso);
        return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}`;
    };

    const getDisplayDate = (start, end) => {
        const s = formatShortDate(start);
        const e = formatShortDate(end);
        return (!e || s === e) ? s : `${s}-${e}`;
    };

    // ---- modal ----
    const openAddModal = () => {
        setIsEditing(false); setEditId(null);
        setNewEvent({ titlu:"", start:"", end:"", locatie:"", descriere:"", tip:"Competitie" });
        setShowModal(true);
    };

    const openEditModal = (ev) => {
        setIsEditing(true); setEditId(ev.id);
        setNewEvent({
            titlu: ev.titlu,
            start: formatForInput(ev.start),
            end:   formatForInput(ev.end),
            locatie:   ev.locatie   || "",
            descriere: ev.descriere || "",
            tip:       ev.tip       || "Competitie"
        });
        setShowModal(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (newEvent.end && new Date(newEvent.end) < new Date(newEvent.start)) {
            alert("Eroare: Data de sfârșit nu poate fi mai mică decât data de start!");
            return;
        }
        const token  = localStorage.getItem("token");
        const method = isEditing ? 'PUT' : 'POST';
        const url    = isEditing ? `${API_URL}/${editId}` : API_URL;

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'x-access-token': token },
            body: JSON.stringify(newEvent)
        })
        .then(res => {
            if (res.ok) { setShowModal(false); fetchEvents(); }
            else alert("Eroare la salvare");
        })
        .catch(err => console.error("Eroare salvare:", err));
    };

    const handleDelete = (id) => {
        if (!window.confirm("Sigur dorești să ștergi acest eveniment?")) return;
        const token = localStorage.getItem("token");
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'x-access-token': token }
        })
        .then(res => { if (res.ok) fetchEvents(); else alert("Eroare la ștergere"); })
        .catch(err => console.error("Eroare ștergere:", err));
    };

    // ---- Handler buton "Înscrie-te" pentru Parinte/Sportiv ----
    const handleInscriere = (evento) => {
        const expirat = esteExpirat(evento);
        const concurs = getConcursPentruEveniment(evento);
        const isCompetitie = evento.tip?.toLowerCase() === "competitie";

        if (expirat) return; // nu ar trebui să fie accesibil, dar safety check

        if (isCompetitie && concurs !== null) {
            // E competitie și există în lista de concursuri
            if (concurs.inscrieri_deschise) {
                // Redirecționează spre pagina concursuri cu formularul deschis
                navigate("/concursuri", { state: { deschideConcurs: concurs.nume } });
            } else {
                alert(`Înscrierile pentru „${concurs.nume}" sunt închise momentan.`);
            }
        } else {
            // Nu e competitie sau nu s-a găsit în concursuri → formularul obișnuit
            navigate(`/inscriere_eveniment/${evento.id}`, { state: { eveniment: evento } });
        }
    };

    return (
        <div className="cal-club-wrapper">
            <Navbar />
            <div className="cal-club-container">
                <div className="cal-club-header">
                    <h1><i className="fas fa-calendar-alt"></i> Calendar Club</h1>
                    {(rol === "admin" || rol === "Antrenor") && (
                        <button className="cal-club-btn-add" onClick={openAddModal}>
                            <i className="fas fa-plus"></i> Adaugă Eveniment
                        </button>
                    )}
                </div>

                <div className="cal-club-table-responsive">
                    <table className="cal-club-table">
                        <thead>
                            <tr>
                                <th className="cal-club-col-index">#</th>
                                <th className="cal-club-col-date">Data</th>
                                <th>Eveniment</th>
                                <th className="cal-club-col-location">Locație</th>
                                <th className="cal-club-col-action">Acțiuni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="cal-club-empty-state">
                                        <i className="fas fa-inbox" style={{ fontSize:'2rem', marginBottom:'12px', display:'block', opacity:'0.5' }}></i>
                                        Niciun eveniment programat momentan.
                                    </td>
                                </tr>
                            ) : (
                                events.map((evento, idx) => {
                                    const expirat    = esteExpirat(evento);
                                    const concurs    = getConcursPentruEveniment(evento);
                                    const isCompetitie = evento.tip?.toLowerCase() === "competitie";

                                    return (
                                        <tr key={evento.id} className={expirat ? "cal-club-row-expirat" : ""}>
                                            <td className="cal-club-col-index">{idx + 1}</td>
                                            <td className="cal-club-col-date">
                                                {getDisplayDate(evento.start, evento.end)}
                                                {expirat && <span className="cal-club-badge-expirat">Trecut</span>}
                                            </td>
                                            <td>
                                                <div className="cal-club-event-title">
                                                    <span>{evento.titlu}</span>
                                                    <span className="cal-club-badge">{evento.tip || "Eveniment"}</span>
                                                </div>
                                                {evento.descriere && <div className="cal-club-desc">{evento.descriere}</div>}
                                            </td>
                                            <td className="cal-club-col-location">{evento.locatie || "—"}</td>
                                            <td>
                                                <div className="cal-club-actions">

                                                    {/* ---- PARINTE / SPORTIV ---- */}
                                                    {(rol === "Parinte" || rol === "Sportiv") && !expirat && (
                                                        <>
                                                            {/* Înscrie-te — activ sau închis */}
                                                            {isCompetitie && concurs && !concurs.inscrieri_deschise ? (
                                                                <button className="cal-club-btn-enroll cal-club-btn-closed" disabled>
                                                                    <i className="fas fa-lock"></i> Înscrieri închise
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className="cal-club-btn-enroll cal-club-btn-inscrie"
                                                                    onClick={() => handleInscriere(evento)}
                                                                >
                                                                    <i className="fas fa-user-plus"></i> Înscrie-te
                                                                </button>
                                                            )}
                                                        </>
                                                    )}

                                                    {/* ---- ADMIN / ANTRENOR ---- */}
                                                    {(rol === "admin" || rol === "Antrenor") && (
                                                        <>
                                                            <button
                                                                className="cal-club-btn-enroll"
                                                                onClick={() => navigate(`/eveniment/${evento.id}/inscrieri`, { state: { eveniment: evento } })}
                                                            >
                                                                <i className="fas fa-list"></i> Vezi Participanți
                                                            </button>

                                                            {/* Buton inscriere manual doar pentru evenimente neexpirate */}
                                                            {!expirat && (
                                                                <button
                                                                    className="cal-club-btn-enroll cal-club-btn-inscrie"
                                                                    onClick={() => {
                                                                        if (isCompetitie && concurs) {
                                                                            if (concurs.inscrieri_deschise) {
                                                                                navigate("/concursuri", { state: { deschideConcurs: concurs.nume } });
                                                                            } else {
                                                                                alert(`Înscrierile pentru „${concurs.nume}" sunt închise momentan.`);
                                                                            }
                                                                        } else {
                                                                            navigate(`/inscriere_eveniment/${evento.id}`, { state: { eveniment: evento } });
                                                                        }
                                                                    }}
                                                                >
                                                                    <i className="fas fa-user-plus"></i> Adaugă Sportivi
                                                                </button>
                                                            )}

                                                            <button className="cal-club-btn-icon cal-club-btn-edit" onClick={() => openEditModal(evento)} title="Editează">
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button className="cal-club-btn-icon cal-club-btn-delete" onClick={() => handleDelete(evento.id)} title="Șterge">
                                                                <i className="fas fa-trash-alt"></i>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ---- MODAL ---- */}
            {showModal && (
                <div className="cal-club-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="cal-club-modal-content" onClick={e => e.stopPropagation()}>
                        <h2 className="cal-club-modal-title">
                            <i className={isEditing ? "fas fa-edit" : "fas fa-calendar-plus"}></i>
                            {isEditing ? "Editează Eveniment" : "Adaugă Eveniment"}
                        </h2>
                        <form onSubmit={handleSave}>
                            <div className="cal-club-form-group">
                                <label className="cal-club-label">Titlu *</label>
                                <input type="text" className="cal-club-input" value={newEvent.titlu}
                                    onChange={e => setNewEvent({...newEvent, titlu: e.target.value})}
                                    placeholder="Ex: Cupa Hwarang 2026" required />
                            </div>
                            <div className="cal-club-date-row">
                                <div className="cal-club-form-group">
                                    <label className="cal-club-label">Data Start *</label>
                                    <input type="datetime-local" className="cal-club-input" value={newEvent.start}
                                        onChange={e => setNewEvent({...newEvent, start: e.target.value})} required />
                                </div>
                                <div className="cal-club-form-group">
                                    <label className="cal-club-label">Data Sfârșit</label>
                                    <input type="datetime-local" className="cal-club-input" value={newEvent.end}
                                        onChange={e => setNewEvent({...newEvent, end: e.target.value})} />
                                </div>
                            </div>
                            <div className="cal-club-form-group">
                                <label className="cal-club-label">Locație</label>
                                <input type="text" className="cal-club-input" value={newEvent.locatie}
                                    onChange={e => setNewEvent({...newEvent, locatie: e.target.value})}
                                    placeholder="Ex: Sala de antrenament, Sibiu" />
                            </div>
                            <div className="cal-club-form-group">
                                <label className="cal-club-label">Tip Eveniment</label>
                                <select className="cal-club-input" value={newEvent.tip}
                                    onChange={e => setNewEvent({...newEvent, tip: e.target.value})}>
                                    <option value="Competitie">Competiție</option>
                                    <option value="Examen">Examen</option>
                                    <option value="Stagiu">Stagiu</option>
                                    <option value="Adunare">Adunare</option>
                                    <option value="Demonstratie">Demonstrație</option>
                                    <option value="Antrenament">Antrenament</option>
                                    <option value="Altele">Altele</option>
                                </select>
                            </div>
                            <div className="cal-club-form-group">
                                <label className="cal-club-label">Descriere</label>
                                <textarea className="cal-club-input" value={newEvent.descriere}
                                    onChange={e => setNewEvent({...newEvent, descriere: e.target.value})}
                                    placeholder="Detalii despre eveniment..." />
                            </div>
                            <div className="cal-club-modal-actions">
                                <button type="button" className="cal-club-btn-cancel" onClick={() => setShowModal(false)}>
                                    Anulează
                                </button>
                                <button type="submit" className="cal-club-btn-save">
                                    {isEditing ? "Salvează Modificări" : "Adaugă Eveniment"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarClub;