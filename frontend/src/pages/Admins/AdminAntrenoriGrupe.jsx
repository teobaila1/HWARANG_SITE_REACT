// frontend/pages/Admins/AdminAntrenoriGrupe.jsx
import React, {useEffect, useState} from "react";
import Navbar from "../../components/Navbar";
import {useNavigate} from "react-router-dom";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/AdminAntrenoriGrupe.css";

// reutilizăm aceleași componente ca în dashboard-ul antrenorului
import ElevForm from "../ElevForm";
import ConfirmDialog from "../ConfirmDialog";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminAntrenoriGrupe = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editElev, setEditElev] = useState(null);
    const [confirm, setConfirm] = useState({open: false, id: null, nume: ""});

    const navigate = useNavigate();

    useEffect(() => {
        const rol = localStorage.getItem("rol");
        if (rol !== "admin") {
            navigate("/access-denied");
            return;
        }
        loadData();
    }, [navigate]);

    const loadData = async () => {
        setLoading(true);
        setMsg("");
        try {
            const res = await fetch(`${API}/api/toate_grupele_antrenori`);
            const json = await res.json();
            if (res.ok && json.status === "success") {
                setData(json.data || []);
            } else {
                setMsg(json.message || "Eroare la încărcarea datelor.");
            }
        } catch (e) {
            setMsg("Eroare de rețea.");
        } finally {
            setLoading(false);
        }
    };

    const initialFromName = (name = "") =>
        (name.trim()[0] || "A").toUpperCase();

    // ---- editare
    const handleEdit = (copil, grupaName) => {
        // elevul din acest endpoint are deja id/nume/varsta/gen; forțăm grupa curentă
        setEditElev({...copil, grupa: grupaName});
        setShowForm(true);
    };

    const handleSubmitForm = async (payload /*, isEdit*/) => {
        try {
            const res = await fetch(`${API}/api/elevi/${payload.id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });
            const js = await res.json().catch(() => ({}));
            if (res.ok) {
                setMsg("Elev actualizat.");
                setShowForm(false);
                await loadData();
            } else {
                setMsg(js.message || "Actualizarea a eșuat.");
            }
        } catch {
            setMsg("Eroare de rețea la actualizare.");
        }
    };

    // ---- ștergere
    const askDelete = (copil) =>
        setConfirm({open: true, id: copil.id, nume: copil.nume});

    const confirmDelete = async () => {
        try {
            const res = await fetch(`${API}/api/elevi/${confirm.id}`, {
                method: "DELETE",
            });
            const js = await res.json().catch(() => ({}));
            if (res.ok) {
                setMsg("Elev șters.");
                await loadData();
            } else {
                setMsg(js.message || "Nu s-a putut șterge elevul.");
            }
        } catch {
            setMsg("Eroare de rețea la ștergere.");
        } finally {
            setConfirm({open: false, id: null, nume: ""});
        }
    };


    // helper pentru afișaj "username (Nume Complet)"
    const coachLabel = (row) => {
        const u = (row.antrenor || "").trim();
        const d = (row.antrenor_display || "").trim();
        if (!d || d.toLowerCase() === u.toLowerCase()) return u || "—";
        return `${u} (${d})`;
    };

    return (
        <>
            <Navbar/>
            <div className="aag-page">
                <div className="aag-inner">
                    <h2 className="aag-title">Grupele tuturor antrenorilor</h2>

                    {loading && <p>Se încarcă…</p>}
                    {!loading && msg && <div className="aag-alert">{msg}</div>}

                    {data.map((antrenorData, index) => (
                        <section key={index} className="coach-section">
                            <div className="coach-head">
                                <div className="coach-avatar">
                                    {initialFromName(antrenorData.antrenor)}
                                </div>
                                <div className="coach-meta">
                                    <h3 className="coach-name">{coachLabel(antrenorData)}</h3>
                                    <div className="coach-sub">
                                        Grupe: <strong>{antrenorData.grupe?.length || 0}</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="groups-grid">
                                {antrenorData.grupe.map((grupaData, idx) => (
                                    <div key={idx} className="group-card">
                                        <div className="group-head">
                                            <h4 className="group-name">{grupaData.grupa}</h4>
                                            <span className="chip">
                        {grupaData.copii?.length || 0} sportivi
                      </span>
                                        </div>

                                        <ul className="athlete-list">
                                            {grupaData.copii.map((copil, i) => (
                                                <li key={i} className="athlete-item">
                                                    <div className="athlete-name">
                                                        <span className="label">Nume:</span>
                                                        <strong>{copil.nume}</strong>
                                                    </div>
                                                    <div className="athlete-field">
                                                        <span className="label">Gen:</span>
                                                        <span>{copil.gen ?? "N/A"}</span>
                                                    </div>
                                                    <div className="athlete-field">
                                                        <span className="label">Vârstă:</span>
                                                        <span>{copil.varsta} ani</span>
                                                    </div>
                                                    <div className="athlete-field">
                                                        <span className="label">Părinte:</span>
                                                        <span>{grupaData.parinte?.username}</span>
                                                    </div>
                                                    <div className="athlete-field">
                                                        <span className="label">Email părinte:</span>
                                                        <span className="email">
                              {grupaData.parinte?.email}
                            </span>
                                                    </div>

                                                    <div className="athlete-actions">
                                                        <button
                                                            className="btn btn-sm"
                                                            disabled={!copil.id}
                                                            onClick={() =>
                                                                handleEdit(copil, grupaData.grupa)
                                                            }
                                                        >
                                                            Editează
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            disabled={!copil.id}
                                                            onClick={() => askDelete(copil)}
                                                        >
                                                            Șterge
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>

            {showForm && (
                <ElevForm
                    initial={editElev}         // { id, nume, varsta, gen, grupa }
                    onSubmit={handleSubmitForm} // PATCH /api/elevi/:id
                    onClose={() => setShowForm(false)}
                />
            )}

            {confirm.open && (
                <ConfirmDialog
                    title="Confirmă ștergerea"
                    message={`Sigur vrei să ștergi elevul „${confirm.nume}”?`}
                    onCancel={() => setConfirm({open: false, id: null, nume: ""})}
                    onConfirm={confirmDelete}
                />
            )}
        </>
    );
};

export default AdminAntrenoriGrupe;
