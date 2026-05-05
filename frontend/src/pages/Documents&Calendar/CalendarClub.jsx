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
                if (Array.isArray(data)) setEvents(data);
            })
            .catch(err => console.error("Eroare calendar:", err));
    };

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
        }).then(res => {
            if (res.ok) fetchEvents();
            else alert("Eroare la ștergere!");
        });
    };

    const formatDateRO = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    // Funcția care decide UNDE trimite utilizatorul la click
    const handleInscriereClick = (ev) => {
        if (ev.tip === "Competitie") {
            // Este concurs! Îl trimitem la pagina cu acordeoane.
            navigate("/concursuri");
        } else {
            // Este examen, cantonament sau stagiu. 
            // Îi afișăm un mesaj frumos până implementăm formularele noi.
            alert(`Înscrierile online pentru ${ev.tip} vor fi disponibile în curând!`);
        }
    };

    const isAdmin = rol === "admin";

    return (
        <div className="calendar-page-wrapper">
            <Navbar />

            <div className="calendar-container">
                <div className="calendar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Calendar Evenimente</h1>
                    {isAdmin && (
                        <button className="btn-add-event" onClick={openAddModal} style={{ padding: '10px 15px', backgroundColor: '#d32f2f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            + Adaugă Eveniment
                        </button>
                    )}
                </div>

                <div className="table-responsive" style={{ overflowX: 'auto' }}>
                    <table className="documents-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Dată</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Eveniment</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Locație</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Tip</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Acțiune</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                        Nu sunt evenimente programate momentan.
                                    </td>
                                </tr>
                            ) : (
                                events.map(ev => (
                                    <tr key={ev.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '12px' }}>
                                            <strong>{formatDateRO(ev.start)}</strong>
                                            {ev.end && ev.end !== ev.start && ` - ${formatDateRO(ev.end)}`}
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <strong style={{ fontSize: '1.1rem' }}>{ev.titlu}</strong>
                                            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>{ev.descriere}</div>
                                        </td>
                                        <td style={{ padding: '12px' }}>{ev.locatie || "-"}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <span style={{
                                                backgroundColor: ev.tip === 'Competitie' ? '#d32f2f' : '#2196F3',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                fontSize: '0.85rem'
                                            }}>
                                                {ev.tip}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <button 
                                                onClick={() => handleInscriereClick(ev)}
                                                style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', marginRight: isAdmin ? '10px' : '0' }}
                                            >
                                                Înscrie-te
                                            </button>

                                            {isAdmin && (
                                                <div style={{ display: 'inline-flex', gap: '5px', marginTop: '5px' }}>
                                                    <button onClick={() => openEditModal(ev)} style={{ background: '#f1c40f', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>✏️</button>
                                                    <button onClick={() => handleDelete(ev.id)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>🗑️</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* MODALUL DE ADAUGARE RAMANE LA FEL, DOAR AM AJUSTAT CSS-UL INTERN */}
                {showModal && (
                    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                        <div className="modal-content" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '90%', maxWidth: '500px' }}>
                            <h2 style={{ color: '#D32F2F', textAlign: 'center', marginBottom: '20px' }}>
                                {isEditing ? "Editează Eveniment" : "Adaugă Eveniment"}
                            </h2>

                            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Titlu Eveniment</label>
                                    <input type="text" required value={newEvent.titlu} onChange={e => setNewEvent({ ...newEvent, titlu: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tip Eveniment</label>
                                    <select value={newEvent.tip} onChange={e => setNewEvent({ ...newEvent, tip: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                                        <option value="Competitie">Competiție</option>
                                        <option value="Examen">Examen Centură</option>
                                        <option value="Stagiu">Stagiu / Seminar</option>
                                        <option value="Cantonament">Cantonament</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Start</label>
                                        <input type="datetime-local" required value={newEvent.start} onChange={e => setNewEvent({ ...newEvent, start: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Sfârșit</label>
                                        <input type="datetime-local" value={newEvent.end} onChange={e => setNewEvent({ ...newEvent, end: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Locație</label>
                                    <input type="text" value={newEvent.locatie} onChange={e => setNewEvent({ ...newEvent, locatie: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descriere</label>
                                    <textarea rows="3" value={newEvent.descriere} onChange={e => setNewEvent({ ...newEvent, descriere: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                    <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 15px', backgroundColor: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Anulează</button>
                                    <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{isEditing ? "Actualizează" : "Salvează"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarClub;