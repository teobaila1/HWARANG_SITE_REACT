import React, { useState, useEffect } from 'react';
import Navbar from "../../components/Navbar";
import "../../../static/css/CalendarClub.css";
import { useNavigate } from "react-router-dom";

// IMPORTANT: Păstrează link-ul tău corect de Render aici!
const API_BASE_URL = "https://backend-hwarang-new.onrender.com";
const API_URL = `${API_BASE_URL}/api/calendar/evenimente`;

const CalendarClub = () => {
    const [events, setEvents] = useState([]);
    const [rol, setRol] = useState("");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    // Stări pentru editare
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

    // Protecție: Redirecționare dacă nu este logat și inițializare date
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
                if (res.status === 401) {
                    console.error("Token invalid sau expirat.");
                    return [];
                }
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return res.json();
                } else {
                    return [];
                }
            })
            .then(data => {
                if (Array.isArray(data)) setEvents(data);
            })
            .catch(err => console.error("Eroare calendar:", err));
    };

    // Funcție pentru a transforma link-urile din text în elemente clickable
    const renderDescription = (text) => {
        if (!text) return "";
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.split(urlRegex).map((part, index) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="description-link"
                    >
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    // Formatează data pentru input-ul datetime-local
    const formatForInput = (isoDateString) => {
        if (!isoDateString) return "";
        const d = new Date(isoDateString);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
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
                    res.json().then(err => alert("Eroare: " + err.message)).catch(() => alert("Eroare server."));
                }
            });
    };

    const handleDelete = (id) => {
        if (!window.confirm("Sigur ștergi acest eveniment?")) return;
        const token = localStorage.getItem("token");

        fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: { 'x-access-token': token }
        })
            .then(res => {
                if (res.ok) fetchEvents();
                else alert("Eroare la ștergere!");
            });
    };

    const formatDate = (dateString) => {
        if (!dateString) return { day: "", time: "" };
        const date = new Date(dateString);
        return {
            day: date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }),
            time: date.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
        };
    };

    const isAdmin = rol === "admin";

    return (
        <div className="calendar-page-wrapper">
            <Navbar />

            <div className="calendar-container">
                <div className="calendar-header">
                    <h1>Calendar Evenimente</h1>
                    {isAdmin && (
                        <button className="btn-add-event" onClick={openAddModal}>
                            + Adaugă Eveniment
                        </button>
                    )}
                </div>

                <div className="events-grid">
                    {events.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem' }}>
                            Nu sunt evenimente programate momentan.
                        </p>
                    ) : (
                        events.map(ev => {
                            const dateObj = formatDate(ev.start);
                            return (
                                <div key={ev.id} className={`event-card type-${ev.tip}`}>
                                    <div className="event-badge">{ev.tip}</div>

                                    <div className="event-date">
                                        <span className="date-big">📅 {dateObj.day}</span>
                                        <span className="date-time">🕒 {dateObj.time}</span>
                                    </div>

                                    <h2 className="event-title">{ev.titlu}</h2>

                                    {ev.locatie && (
                                        <div className="event-location">
                                            📍 {ev.locatie}
                                        </div>
                                    )}

                                    <div className="event-desc">
                                        {renderDescription(ev.descriere)}
                                    </div>

                                    {isAdmin && (
                                        <div className="action-buttons">
                                            <button
                                                className="btn-icon"
                                                onClick={() => openEditModal(ev)}
                                                title="Editează"
                                            >
                                                ✏️ Editează
                                            </button>
                                            <button
                                                className="btn-icon delete-color"
                                                onClick={() => handleDelete(ev.id)}
                                                title="Șterge"
                                            >
                                                🗑️ Șterge
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 style={{ color: '#D32F2F', textAlign: 'center', marginBottom: '20px' }}>
                            {isEditing ? "Editează Eveniment" : "Adaugă Eveniment"}
                        </h2>

                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Titlu Eveniment</label>
                                <input type="text" required placeholder="Ex: Cupa Hwarang"
                                    value={newEvent.titlu}
                                    onChange={e => setNewEvent({ ...newEvent, titlu: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Tip Eveniment</label>
                                <select value={newEvent.tip}
                                    onChange={e => setNewEvent({ ...newEvent, tip: e.target.value })}>
                                    <option value="Competitie">Competiție</option>
                                    <option value="Examen">Examen Centură</option>
                                    <option value="Cantonament">Cantonament</option>
                                    <option value="General">General</option>
                                </select>
                            </div>

                            <div className="date-row">
                                <div className="form-group">
                                    <label>Start</label>
                                    <input type="datetime-local" required
                                        value={newEvent.start}
                                        onChange={e => setNewEvent({ ...newEvent, start: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Sfârșit</label>
                                    <input type="datetime-local"
                                        value={newEvent.end}
                                        onChange={e => setNewEvent({ ...newEvent, end: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Locație</label>
                                <input type="text" placeholder="Ex: Sala Transilvania"
                                    value={newEvent.locatie}
                                    onChange={e => setNewEvent({ ...newEvent, locatie: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Descriere / Detalii</label>
                                <textarea rows="3" placeholder="Detalii suplimentare..."
                                    value={newEvent.descriere}
                                    onChange={e => setNewEvent({ ...newEvent, descriere: e.target.value })}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel"
                                    onClick={() => setShowModal(false)}>Anulează
                                </button>
                                <button type="submit" className="btn-save">
                                    {isEditing ? "Actualizează" : "Salvează"}
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