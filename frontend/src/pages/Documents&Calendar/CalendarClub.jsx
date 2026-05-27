import React, { useState, useEffect } from 'react';
import Navbar from "../../components/Navbar";
import "../../../static/css/CalendarClub.css";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://backend-hwarang-new.onrender.com";
const API_URL = `${API_BASE_URL}/api/calendar/evenimente`;

const CalendarClub = () => {
    const [events, setEvents] = useState([]);
    const [rol, setRol] = useState("");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [newEvent, setNewEvent] = useState({
        titlu: "",
        start: "",
        end: "",
        locatie: "",
        descriere: "",
        tip: "Competitie"
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRol = localStorage.getItem("rol");
        if (!token) {
            navigate("/autentificare");
        } else {
            setRol(userRol);
            fetchEvents();
        }
    }, [navigate]);

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showModal]);

    const fetchEvents = () => {
        const token = localStorage.getItem("token");
        fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        })
            .then(res => {
                if (res.status === 401) return [];
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return res.json();
                }
                return [];
            })
            .then(data => {
                if (Array.isArray(data)) {
                    const evenimenteSortate = data.sort((a, b) => new Date(a.start) - new Date(b.start));
                    setEvents(evenimenteSortate);
                }
            })
            .catch(err => console.error("Eroare calendar:", err));
    };

    const formatForInput = (isoDateString) => {
        if (!isoDateString) return "";
        const d = new Date(isoDateString);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    };

    const getCurrentLocalTime = () => {
        const d = new Date();
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    };

    const formatShortDate = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}.${month}`;
    };

    const getDisplayDate = (start, end) => {
        const s = formatShortDate(start);
        const e = formatShortDate(end);
        if (!e || s === e) return s;
        return `${s}-${e}`;
    };

    const openAddModal = () => {
        setIsEditing(false);
        setEditId(null);
        setNewEvent({ titlu: "", start: "", end: "", locatie: "", descriere: "", tip: "Competitie" });
        setShowModal(true);
    };

    const openEditModal = (ev) => {
        setIsEditing(true);
        setEditId(ev.id);
        setNewEvent({
            titlu: ev.titlu,
            start: formatForInput(ev.start),
            end: formatForInput(ev.end),
            locatie: ev.locatie || "",
            descriere: ev.descriere || "",
            tip: ev.tip || "Competitie"
        });
        setShowModal(true);
    };

   const handleSave = (e) => {
        e.preventDefault();

        if (newEvent.end) {
            const startDate = new Date(newEvent.start);
            const endDate = new Date(newEvent.end);

            if (endDate < startDate) {
                alert("Eroare: Data de sfârșit nu poate fi mai mică decât data de start!");
                return;
            }
        }

        const token = localStorage.getItem("token");
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${API_URL}/${editId}` : API_URL;

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify(newEvent)
        })
            .then(res => {
                if (res.ok) {
                    setShowModal(false);
                    fetchEvents();
                } else {
                    alert("Eroare la salvare");
                }
            })
            .catch(err => console.error("Eroare salvare:", err));
    };

    const handleDelete = (id) => {
        if (!window.confirm("Sigur dorești să ștergi acest eveniment?")) return;

        const token = localStorage.getItem("token");
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        })
            .then(res => {
                if (res.ok) {
                    fetchEvents();
                } else {
                    alert("Eroare la ștergere");
                }
            })
            .catch(err => console.error("Eroare ștergere:", err));
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
                                {(rol === "Parinte" || rol === "Sportiv") && <th>Acțiuni</th>}
                                {(rol === "admin" || rol === "Antrenor") && <th className="cal-club-col-action">Acțiuni</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {events.length === 0 ? (
                                <tr>
                                    <td colSpan={rol === "Parinte" || rol === "Sportiv" ? 5 : 6} className="cal-club-empty-state">
                                        <i className="fas fa-inbox" style={{ fontSize: '2rem', marginBottom: '12px', display: 'block', opacity: '0.5' }}></i>
                                        Niciun eveniment programat momentan.
                                    </td>
                                </tr>
                            ) : (
                                events.map((evento, idx) => (
                                    <tr key={evento.id}>
                                        <td className="cal-club-col-index">{idx + 1}</td>
                                        <td className="cal-club-col-date">{getDisplayDate(evento.start, evento.end)}</td>
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
                                                {(rol === "Parinte" || rol === "Sportiv") && (
                                                    <button className="cal-club-btn-enroll" onClick={() => navigate(`/inscriere_eveniment/${evento.id}`, { state: { eveniment: evento } })}>
                                                        <i className="fas fa-user-plus"></i> Înscrisi
                                                    </button>
                                                )}
                                                {(rol === "admin" || rol === "Antrenor") && (
                                                    <>
                                                        <button className="cal-club-btn-enroll" onClick={() => navigate(`/inscriere_eveniment/${evento.id}`, { state: { eveniment: evento } })}>
                                                            <i className="fas fa-list"></i> Vezi Participanți
                                                        </button>
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

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
                                <input
                                    type="text"
                                    className="cal-club-input"
                                    value={newEvent.titlu}
                                    onChange={e => setNewEvent({ ...newEvent, titlu: e.target.value })}
                                    placeholder="Ex: Cupa Hwarang 2026"
                                    required
                                />
                            </div>

                            <div className="cal-club-date-row">
                                <div className="cal-club-form-group">
                                    <label className="cal-club-label">Data Start *</label>
                                    <input
                                        type="datetime-local"
                                        className="cal-club-input"
                                        value={newEvent.start}
                                        onChange={e => setNewEvent({ ...newEvent, start: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="cal-club-form-group">
                                    <label className="cal-club-label">Data Sfârșit</label>
                                    <input
                                        type="datetime-local"
                                        className="cal-club-input"
                                        value={newEvent.end}
                                        onChange={e => setNewEvent({ ...newEvent, end: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="cal-club-form-group">
                                <label className="cal-club-label">Locație</label>
                                <input
                                    type="text"
                                    className="cal-club-input"
                                    value={newEvent.locatie}
                                    onChange={e => setNewEvent({ ...newEvent, locatie: e.target.value })}
                                    placeholder="Ex: Sala de antrenament, Sibiu"
                                />
                            </div>

                            <div className="cal-club-form-group">
                                <label className="cal-club-label">Tip Eveniment</label>
                                <select
                                    className="cal-club-input"
                                    value={newEvent.tip}
                                    onChange={e => setNewEvent({ ...newEvent, tip: e.target.value })}
                                >
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
                                <textarea
                                    className="cal-club-input"
                                    value={newEvent.descriere}
                                    onChange={e => setNewEvent({ ...newEvent, descriere: e.target.value })}
                                    placeholder="Detalii despre eveniment..."
                                />
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