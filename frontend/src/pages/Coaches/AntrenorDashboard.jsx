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

    // Statistici calculate
    const [stats, setStats] = useState({ totalElevi: 0, totalGrupe: 0 });

    // Alegerile din dropdown pentru "părinte existent"
    const [parentChoice, setParentChoice] = useState({});

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

    const groupByGrupa = (rows) => {
        const map = new Map();
        let countElevi = 0;

        for (const row of rows || []) {
            const g = row.grupa || "Fără grupă";
            if (!map.has(g)) map.set(g, {
                grupa: g,
                grupa_id: row.grupa_id,
                parents: [], copii: [], _pk: new Set()
            });
            const bucket = map.get(g);

            const p = row.parinte || {};
            const pKey = `${p.id ?? "null"}::${(p.username || "").toLowerCase()}`;
            if ((p.id != null || p.username) && !bucket._pk.has(pKey)) {
                bucket._pk.add(pKey);
                bucket.parents.push(p);
            }

            for (const c of (row.copii || [])) {
                bucket.copii.push({...c, _parent: p});
                countElevi++;
            }
        }

        const groups = Array.from(map.values())
            .map(({_pk, ...rest}) => rest)
            .sort((a, b) => (a.grupa || "").localeCompare(b.grupa || ""));

        setStats({ totalElevi: countElevi, totalGrupe: groups.length });
        return groups;
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
        if (v === "m" || v === "masculin") return "M";
        if (v === "f" || v === "feminin") return "F";
        return g;
    };

    // --- ACTIONS ---
    const handleAddExisting = (grupaName) => {
        const pid = parentChoice[grupaName];
        if (!pid) {
            setMesaj("Selectează un părinte pentru această grupă.");
            return;
        }
        const g = data.find(x => x.grupa === grupaName);
        const p = g?.parents?.find(x => x.id === pid);
        setEditElev({
            parinte_id: pid,
            grupa: grupaName,
            parent_display: (p?.display && String(p.display).trim()) || p?.username || `Părinte #${pid}`
        });
        setShowForm(true);
    };

    const handleAddNewParent = (grupaName) => {
        setEditElev({grupa: grupaName, parinte_id: null, parent_display: ""});
        setShowForm(true);
    };

    const handleEdit = (copil) => {
        const numeParinteVizibil = parentName(copil._parent);
        setEditElev({
            ...copil,
            parent_display: numeParinteVizibil,
            parinte_id: copil._parent?.id ?? null
        });
        setShowForm(true);
    };

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
            if (res.ok) {
                setMesaj("Elev șters.");
                await loadData();
            } else {
                setMesaj("Nu s-a putut șterge elevul.");
            }
        } catch {
            setMesaj("Eroare de rețea la ștergere.");
        } finally {
            setConfirm({open: false, elevId: null, nume: ""});
        }
    };

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
            if (res.ok) {
                setMesaj(isEdit ? "Elev actualizat." : "Elev adăugat.");
                setShowForm(false);
                await loadData();
            } else {
                const dataRes = await res.json().catch(() => ({}));
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
            <div className="ant-dashboard">

                {/* --- HEADER + STATS --- */}
                <div className="ant-header-wrapper">
                    <div className="ant-header-content">
                        <h1>PANOU ANTRENOR</h1>
                        <p>Gestionează grupele și prezența sportivilor.</p>
                    </div>

                    <div className="ant-stats-row">
                        <div className="ant-stat-card">
                            <span className="stat-val">{stats.totalElevi}</span>
                            <span className="stat-label">SPORTIVI TOTAL</span>
                        </div>
                        <div className="ant-stat-card">
                            <span className="stat-val">{stats.totalGrupe}</span>
                            <span className="stat-label">GRUPE ACTIVE</span>
                        </div>
                        <button className="btn-scan-qr" onClick={() => navigate("/scan")}>
                            SCANEAZĂ QR
                        </button>
                    </div>
                </div>

                {loading && <div className="loading-spinner">Se încarcă datele...</div>}
                {!loading && mesaj && <div className="ant-alert">{mesaj}</div>}

                {/* --- GRUPE CONTAINER --- */}
                {!loading && (
                    <div className="ant-groups-container">
                        {data.map((grupaData, idx) => (
                            <div key={idx} className="ant-group-card">

                                {/* HEADER GRUPĂ */}
                                <div className="ant-group-header">
                                    <div className="group-title-area">
                                        <h3>{grupaData.grupa}</h3>
                                        <span className="student-count">{grupaData.copii.length} elevi</span>
                                    </div>

                                    <div className="group-actions-area">
                                        <button
                                            className="btn-attendance"
                                            onClick={() => navigate(`/prezenta/grupa/${grupaData.grupa_id}`)}
                                        >
                                            Vezi Prezențe
                                        </button>

                                        <div className="add-student-area">
                                            {grupaData.parents.length > 0 && (
                                                <select
                                                    className="ant-select"
                                                    value={parentChoice[grupaData.grupa] ?? ""}
                                                    onChange={(e) => setParentChoice(prev => ({ ...prev, [grupaData.grupa]: Number(e.target.value) }))}
                                                >
                                                    {grupaData.parents.map(p => (
                                                        <option key={p.id} value={p.id}>{parentName(p)}</option>
                                                    ))}
                                                </select>
                                            )}

                                            <div className="add-buttons">
                                                {grupaData.parents.length > 0 && (
                                                    <button className="btn-add existing" onClick={() => handleAddExisting(grupaData.grupa)}>
                                                        + Părinte Existent
                                                    </button>
                                                )}
                                                <button className="btn-add new" onClick={() => handleAddNewParent(grupaData.grupa)}>
                                                    + Părinte Nou
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* GRID ELEVI */}
                                {grupaData.copii.length === 0 ? (
                                    <p className="no-students">Nu sunt elevi în această grupă.</p>
                                ) : (
                                    <div className="ant-students-grid">
                                        {grupaData.copii.map((copil) => (
                                            <div key={copil.id} className="ant-student-card">
                                                <div className="student-main">
                                                    <div className="student-avatar">{copil.nume.charAt(0)}</div>
                                                    <div className="student-details">
                                                        <span className="student-name">{copil.nume}</span>
                                                        <span className="student-meta">{prettyGen(copil.gen)} • {copil.varsta} ani</span>
                                                    </div>
                                                </div>

                                                <div className="student-parent-info">
                                                    <small>Părinte:</small>
                                                    <span>{parentName(copil._parent)}</span>
                                                </div>

                                                <div className="student-actions">
                                                    <button className="btn-icon edit" onClick={() => handleEdit(copil)}>
                                                        Editează
                                                    </button>
                                                    <button className="btn-icon delete" onClick={() => handleDeleteAsk(copil)}>
                                                        Șterge
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

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