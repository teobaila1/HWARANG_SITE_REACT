import React, {useEffect, useState} from "react";
import Navbar from "../../components/Navbar";
import {useNavigate} from "react-router-dom";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/AntrenorDashboard.css";
import ElevForm from "../ElevForm";
import ConfirmDialog from "../ConfirmDialog";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AntrenorDashboard = () => {
    const [data, setData] = useState([]);         // [{ grupa, parinte:{id,username,email}, copii:[{id,nume,varsta,gen,grupa}] }]
    const [loading, setLoading] = useState(true);
    const [mesaj, setMesaj] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editElev, setEditElev] = useState(null); // null = add; object = edit (conține id/parinte_id etc.)
    const [confirm, setConfirm] = useState({open: false, elevId: null, nume: ""});

    const navigate = useNavigate();

    useEffect(() => {
        const username = localStorage.getItem("username");
        const rol = localStorage.getItem("rol");
        if (!username || rol !== "Antrenor") {
            navigate("/access-denied");
        }
    }, [navigate]);

    const loadData = async () => {
        setLoading(true);
        setMesaj("");
        try {
            const res = await fetch(`${API}/api/antrenor_dashboard_data`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username: localStorage.getItem("username")}),
            });
            const result = await res.json();
            if (res.ok && result.status === "success") {
                setData(result.date || []);
            } else {
                setMesaj(result.message || "Eroare la încărcarea datelor.");
            }
        } catch (e) {
            console.error(e);
            setMesaj("Eroare de rețea. Încearcă din nou.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // helper mic: afișează genul ca text frumos
    const prettyGen = (g) => {
        if (!g) return "N/A";
        const v = String(g).toLowerCase();
        if (v === "m" || v === "masculin") return "Masculin";
        if (v === "f" || v === "feminin") return "Feminin";
        return g;
    };

    // ADD: deschide formularul cu parinte_id + grupa presetate (pe cardul acelei grupe)
    const handleAdd = (grupaData) => {
        if (!grupaData?.parinte?.id) {
            setMesaj("Nu am găsit ID-ul părintelui în datele grupei.");
            return;
        }
        setEditElev({parinte_id: grupaData.parinte.id, grupa: grupaData.grupa}); // pentru Add
        setShowForm(true);
    };

    const handleAddWithNewParent = (grupaData) => {
        setEditElev({grupa: grupaData.grupa}); // fără parinte_id -> formularul cere Nume părinte
        setShowForm(true);
    };

    // EDIT
    const handleEdit = (copil, grupaData) => {
        setEditElev({...copil, parinte_id: grupaData.parinte.id}); // copil are deja id
        setShowForm(true);
    };

    // DELETE (confirm)
    const handleDeleteAsk = (copil) => {
        setConfirm({open: true, elevId: copil.id, nume: copil.nume});
    };

    const handleDeleteConfirm = async () => {
        try {
            const res = await fetch(`${API}/api/elevi/${confirm.elevId}`, {method: "DELETE"});
            const dataRes = await res.json().catch(() => ({}));
            if (res.ok) {
                setMesaj("Elev șters.");
                await loadData();
            } else {
                setMesaj(dataRes.message || "Nu s-a putut șterge elevul.");
            }
        } catch {
            setMesaj("Eroare de rețea la ștergere.");
        } finally {
            setConfirm({open: false, elevId: null, nume: ""});
        }
    };

    // Submit din formular (add/edit)
    const handleSubmitForm = async (payload, isEdit) => {
        try {
            const url = isEdit ? `${API}/api/elevi/${payload.id}` : `${API}/api/elevi`;
            const method = isEdit ? "PATCH" : "POST";
            const res = await fetch(url, {
                method,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });
            const dataRes = await res.json().catch(() => ({}));
            if (res.ok) {
                setMesaj(isEdit ? "Elev actualizat." : "Elev adăugat.");
                setShowForm(false);
                await loadData();
            } else {
                setMesaj(dataRes.message || "Operația a eșuat.");
            }
        } catch (e) {
            console.error(e);
            setMesaj("Eroare de rețea.");
        }
    };

    return (
        <>
            <Navbar/>
            <div className="dashboard">
                <div className="dashboard-header">
                    <h2>Grupele și elevii tăi</h2>
                </div>

                {loading && <p>Se încarcă…</p>}
                {!loading && mesaj && <div className="alert">{mesaj}</div>}

                {!loading && data.map((grupaData, idx) => (
                    <div key={idx} className="grupa-card">
                        <div className="grupa-head">
                            <h3>{grupaData.grupa}</h3>
                            <div className="btn-group">
                                <button className="btn btn-primary" onClick={() => handleAdd(grupaData)}>
                                    Adaugă elev (părinte existent)
                                </button>
                                <button className="btn" onClick={() => handleAddWithNewParent(grupaData)}>
                                    Adaugă elev (părinte nou)
                                </button>
                            </div>
                        </div>

                        <ul className="elevi-list">
                            {grupaData.copii.map((copil, i) => (
                                <li key={copil.id || i} className="elev-item">
                                    <div className="elev-info">
                                        <div><span className="elev-label">Nume:</span> <span
                                            className="elev-value">{copil.nume}</span></div>
                                        <div><span className="elev-label">Gen:</span> <span
                                            className="elev-value">{prettyGen(copil.gen)}</span></div>
                                        <div><span className="elev-label">Vârstă:</span> <span
                                            className="elev-value">{copil.varsta} ani</span></div>
                                        <div><span className="elev-label">Părinte:</span> <span
                                            className="elev-value">{grupaData.parinte.username}</span></div>
                                        <div><span className="elev-label">Email părinte:</span> <span
                                            className="elev-value">{grupaData.parinte.email}</span></div>
                                    </div>
                                    <div className="elev-actions">
                                        <button className="btn btn-sm"
                                                onClick={() => handleEdit(copil, grupaData)}>Editează
                                        </button>
                                        <button className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteAsk(copil)}>Șterge
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {showForm && (
                    <ElevForm
                        initial={editElev}            // pt Add: {parinte_id, grupa}; pt Edit: {id, nume, varsta, gen, grupa, parinte_id}
                        onClose={() => setShowForm(false)}
                        onSubmit={handleSubmitForm}   // primește (payload, isEdit)
                    />
                )}

                {confirm.open && (
                    <ConfirmDialog
                        title="Confirmă ștergerea"
                        message={`Sigur vrei să ștergi elevul „${confirm.nume}”?`}
                        onCancel={() => setConfirm({open: false, elevId: null, nume: ""})}
                        onConfirm={handleDeleteConfirm}
                    />
                )}
            </div>
        </>
    );
};

export default AntrenorDashboard;
