import React, {useEffect, useState} from "react";
import Navbar from "../../components/Navbar";
import {useNavigate} from "react-router-dom";
import "../../../static/css/AntrenorDashboard.css";
import ElevForm from "../ElevForm";
import ConfirmDialog from "../ConfirmDialog";
import {API_BASE} from "../../config";

const AntrenorDashboard = () => {
    // Structura: [{ grupa, parents:[{id,username,email}], copii:[{..., _parent:{...}}] }]
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mesaj, setMesaj] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editElev, setEditElev] = useState(null);
    const [confirm, setConfirm] = useState({open: false, elevId: null, nume: ""});

    // Alegerile din dropdown pentru "părinte existent"
    const [parentChoice, setParentChoice] = useState({}); // { "Grupa 1": parentId, ... }

    // Helper afișare nume părinte
    const parentName = (p) =>
        (p?.display && String(p.display).trim()) || p?.username || "—";

    const navigate = useNavigate();

    useEffect(() => {
        const username = localStorage.getItem("username");
        const rol = localStorage.getItem("rol");
        if (!username || (rol !== "Antrenor" && rol !== "admin")) {
            navigate("/access-denied");
        }
    }, [navigate]);

    // Grupează datele plate primite de la server
    const groupByGrupa = (rows) => {
        const map = new Map();

        for (const row of rows || []) {
            const g = row.grupa || "Fără grupă";
            if (!map.has(g)) map.set(g, {grupa: g, parents: [], copii: [], _pk: new Set()});
            const bucket = map.get(g);

            const p = row.parinte || {};
            // Cheie unică pentru părinți (evităm duplicatele în dropdown)
            const pKey = `${p.id ?? "null"}::${(p.username || "").toLowerCase()}`;
            if ((p.id != null || p.username) && !bucket._pk.has(pKey)) {
                bucket._pk.add(pKey);
                bucket.parents.push(p);
            }

            // Atașăm părintele la fiecare copil pentru a ști cui aparține
            for (const c of (row.copii || [])) {
                bucket.copii.push({...c, _parent: p});
            }
        }

        return Array.from(map.values())
            .map(({_pk, ...rest}) => rest)
            .sort((a, b) => (a.grupa || "").localeCompare(b.grupa || ""));
    };

    const loadData = async () => {
        setLoading(true);
        setMesaj("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/antrenor_dashboard_data`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({username: localStorage.getItem("username")}),
            });
            const result = await res.json();
            if (res.ok && result.status === "success") {
                const grouped = groupByGrupa(result.date || []);
                setData(grouped);

                // Preselectăm primul părinte în dropdown-uri
                const defaults = {};
                grouped.forEach(g => {
                    if (g.parents.length > 0) defaults[g.grupa] = g.parents[0].id;
                });
                setParentChoice(defaults);
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

    const prettyGen = (g) => {
        if (!g) return "N/A";
        const v = String(g).toLowerCase();
        if (v === "m" || v === "masculin") return "Masculin";
        if (v === "f" || v === "feminin") return "Feminin";
        return g;
    };

    // --- ACȚIUNI ---

    // 1. Adaugă elev (părinte existent selectat)
    const handleAddExisting = (grupaName) => {
        const pid = parentChoice[grupaName];
        if (!pid) {
            setMesaj("Selectează un părinte pentru această grupă.");
            return;
        }

        const g = data.find(x => x.grupa === grupaName);
        const p = g?.parents?.find(x => x.id === pid);

        // Setăm datele inițiale. Backend-ul va folosi parinte_id.
        setEditElev({
            parinte_id: pid,
            grupa: grupaName,
            // Afișăm numele ca să știe antrenorul pe cine a selectat
            parent_display: (p?.display && String(p.display).trim()) || p?.username || `Părinte #${pid}`
        });
        setShowForm(true);
    };

    // 2. Adaugă elev (părinte nou - se va crea placeholder)
    const handleAddNewParent = (grupaName) => {
        setEditElev({grupa: grupaName, parinte_id: null, parent_display: ""});
        setShowForm(true);
    };

    // 3. Editează elev existent
    const handleEdit = (copil) => {
        // Calculăm numele părintelui curent
        const numeParinteVizibil = parentName(copil._parent);

        setEditElev({
            ...copil,
            // IMPORTANT: Populăm aceste câmpuri pentru ca ElevForm să le afișeze
            parent_display: numeParinteVizibil,
            parinte_id: copil._parent?.id ?? null
        });
        setShowForm(true);
    };

    // 4. Șterge elev
    const handleDeleteAsk = (copil) => {
        setConfirm({open: true, elevId: copil.id, nume: copil.nume});
    };

    const handleDeleteConfirm = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/elevi/${confirm.elevId}`, {
                method: "DELETE",
                headers: {"Authorization": `Bearer ${token}`}
            });
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

    // Submit formular (Add / Edit)
    const handleSubmitForm = async (payload, isEdit) => {
        try {
            const token = localStorage.getItem("token");
            const url = isEdit ? `${API_BASE}/api/elevi/${payload.id}` : `${API_BASE}/api/elevi`;
            const method = isEdit ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
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


                {/* --- START COD NOU: BUTON SCANARE --- */}
                <div style={{marginBottom: "30px", display: "flex", justifyContent: "center"}}>
                    <button
                        onClick={() => navigate("/scan")}
                        style={{
                            background: "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)", // Auriu specific Hwarang
                            color: "white",
                            border: "none",
                            padding: "15px 40px",
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                            borderRadius: "30px",
                            cursor: "pointer",
                            boxShadow: "0 4px 15px rgba(212, 175, 55, 0.4)",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}
                    >
                        <i className="fa-solid fa-qrcode" style={{fontSize: "1.3rem"}}></i>
                        Scanează Prezența
                    </button>
                </div>
                {/* --- END COD NOU --- */}

                {loading && <p>Se încarcă…</p>}
                {!loading && mesaj && <div className="alert">{mesaj}</div>}

                {!loading && data.map((grupaData, idx) => (
                    <div key={idx} className="grupa-card">
                        <div className="grupa-head">
                            <h3>{grupaData.grupa}</h3>

                            <div className="btn-group">
                                {grupaData.parents.length > 0 && (
                                    <>
                                        {grupaData.parents.length > 1 && (
                                            <select
                                                className="parent-select"
                                                value={parentChoice[grupaData.grupa] ?? ""}
                                                onChange={(e) =>
                                                    setParentChoice(prev => ({
                                                        ...prev,
                                                        [grupaData.grupa]: Number(e.target.value)
                                                    }))
                                                }
                                            >
                                                {grupaData.parents.map(p => (
                                                    <option key={p.id} value={p.id}>
                                                        {parentName(p)}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleAddExisting(grupaData.grupa)}
                                        >
                                            Adaugă elev (părinte existent)
                                        </button>
                                    </>
                                )}

                                <button className="btn" onClick={() => handleAddNewParent(grupaData.grupa)}>
                                    Adaugă elev (părinte nou)
                                </button>
                            </div>
                        </div>

                        <ul className="elevi-list">
                            {grupaData.copii.map((copil) => (
                                <li key={copil.id} className="elev-item">
                                    <div className="elev-info">
                                        <div><span className="elev-label">Nume:</span> <span
                                            className="elev-value">{copil.nume}</span></div>
                                        <div><span className="elev-label">Gen:</span> <span
                                            className="elev-value">{prettyGen(copil.gen)}</span></div>
                                        <div><span className="elev-label">Vârstă:</span> <span
                                            className="elev-value">{copil.varsta} ani</span></div>
                                        <div>
                                            <span className="elev-label">Părinte:</span>{" "}
                                            <span className="elev-value">{parentName(copil._parent)}</span>
                                        </div>
                                        <div><span className="elev-label">Email părinte:</span> <span
                                            className="elev-value">{copil._parent?.email || "—"}</span></div>
                                    </div>
                                    <div className="elev-actions">
                                        <button className="btn btn-sm" onClick={() => handleEdit(copil)}>Editează
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
                        initial={editElev}
                        onClose={() => setShowForm(false)}
                        onSubmit={handleSubmitForm}
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