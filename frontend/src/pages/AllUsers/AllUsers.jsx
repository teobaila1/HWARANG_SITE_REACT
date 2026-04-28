import React, {useEffect, useMemo, useState} from "react";
import Navbar from "../../components/Navbar";
import "../../../static/css/TotiUtilizatorii.css";
import {API_BASE} from "../../config";

const ROLURI = ["admin", "Parinte", "Sportiv", "Antrenor", "AntrenorExtern"];

const TotiUtilizatorii = () => {
    const [users, setUsers] = useState([]);
    const [editari, setEditari] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [mesaj, setMesaj] = useState("");
    const isAdmin = (localStorage.getItem("rol") || "").toLowerCase() === "admin";

    // State pentru modal editare
    const [showEdit, setShowEdit] = useState(false);
    const [editUser, setEditUser] = useState({id: null, username: "", email: "", grupe: ""});

    const loadUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/users`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
            setMesaj("");
        } catch (e) {
            setMesaj("Eroare la preluarea utilizatorilor.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return users;
        return users.filter(u =>
            (u.username || "").toLowerCase().includes(term) ||
            (u.email || "").toLowerCase().includes(term) ||
            (u.rol || "").toLowerCase().includes(term) ||
            String(u.id).includes(term)
        );
    }, [users, searchTerm]);

    const handleRolChange = (userId, rolNou) => {
        setEditari(prev => ({...prev, [userId]: rolNou}));
    };

    const handleSaveRol = async (userId) => {
        const rol_nou = editari[userId];
        if (!rol_nou) return;
        const user = users.find(u => u.id === userId);
        const admin_username = localStorage.getItem("username");
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${API_BASE}/api/modifica-rol`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    admin_username,
                    target_username: user.username,
                    rol_nou,
                }),
            });
            const data = await res.json();
            if (data.status === "success") {
                setMesaj("Rol actualizat.");
                setUsers(prev => prev.map(u => u.id === userId ? {...u, rol: rol_nou} : u));
                setEditari(prev => {
                    const copy = {...prev};
                    delete copy[userId];
                    return copy;
                });
            } else {
                setMesaj(data.error || "Eroare la actualizarea rolului.");
            }
        } catch (e) {
            setMesaj("Eroare de rețea.");
            console.error(e);
        }
    };

    const stergeUtilizator = async (username) => {
        if (!isAdmin) return;
        if (!window.confirm(`Sigur vrei să ștergi utilizatorul ${username}?`)) return;
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(username)}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === "success") {
                setMesaj("Utilizator șters.");
                setUsers(prev => prev.filter(u => u.username !== username));
            } else {
                setMesaj(data.message || "Eroare la ștergere.");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const openEdit = (u) => {
        if (!isAdmin) return;
        setEditUser({
            id: u.id,
            username: u.username || "",
            email: u.email || "",
            grupe: u.grupe || ""
        });
        setShowEdit(true);
    };

    const closeEdit = () => setShowEdit(false);

    const saveEdit = async (e) => {
        e.preventDefault();
        if (!isAdmin) return;

        const admin_username = localStorage.getItem("username");
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${API_BASE}/api/users/${editUser.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    admin_username,
                    username: editUser.username.trim(),
                    email: editUser.email.trim(),
                    grupe: editUser.grupe
                }),
            });
            const data = await res.json();
            if (res.ok && data.status === "success") {
                setMesaj("Utilizator actualizat.");
                setUsers(prev =>
                    prev.map(u => u.id === editUser.id
                        ? {...u, username: editUser.username.trim(), email: editUser.email.trim(), grupe: editUser.grupe}
                        : u
                    )
                );
                setShowEdit(false);
            } else {
                setMesaj(data.message || "Eroare la actualizare.");
            }
        } catch (e2) {
            console.error(e2);
            setMesaj("Eroare de rețea.");
        }
    };

    const getInitials = (name) => {
        return (name && name.trim().length > 0) ? name.trim()[0].toUpperCase() : "U";
    };

    const userLabel = (u) => {
        const uName = (u.username || "").trim();
        const disp = (u.display_name || u.nume_complet || "").trim();
        if (!disp || disp.toLowerCase() === uName.toLowerCase()) return uName || "—";
        return `${uName} (${disp})`;
    };

    return (
        <>
            <Navbar/>
            <div className="au-page">
                <div className="au-inner">

                    {/* Header */}
                    <div className="au-header">
                        <h2 className="au-title">Toți Utilizatorii</h2>
                        <div className="search-wrap">
                            <input
                                className="search-input"
                                type="text"
                                placeholder="Caută utilizator..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading && <p style={{textAlign:"center", color:"#888"}}>Se încarcă...</p>}
                    {!loading && mesaj && <div className="au-alert">{mesaj}</div>}

                    {/* Lista Utilizatori */}
                    {!loading && (
                        <div className="users-list">
                            {filteredUsers.map((u) => (
                                <div key={u.id} className="user-row">

                                    {/* 1. Avatar */}
                                    <div className="row-avatar">
                                        {getInitials(u.username)}
                                    </div>

                                    {/* 2. Nume & ID */}
                                    <div className="col-info">
                                        <div className="user-name" title={userLabel(u)}>{userLabel(u)}</div>
                                        <div className="user-id">ID: {u.id}</div>
                                    </div>

                                    {/* 3. Email & Grupe */}
                                    <div className="col-info">
                                        <div className="user-email">{u.email}</div>
                                        <div className="user-groups" title={u.grupe}>
                                            {u.grupe || "Fără grupă"}
                                        </div>
                                    </div>

                                    {/* 4. Selector Rol */}
                                    <div className="col-info">
                                        <div className="role-wrapper">
                                            <select
                                                value={editari[u.id] ?? (u.rol || "").trim()}
                                                onChange={(e) => handleRolChange(u.id, e.target.value)}
                                                className="role-select"
                                                disabled={!isAdmin}
                                            >
                                                {ROLURI.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                            <button
                                                className="btn-save-role"
                                                disabled={!isAdmin || !editari[u.id] || editari[u.id] === (u.rol || "").trim()}
                                                onClick={() => handleSaveRol(u.id)}
                                            >
                                                OK
                                            </button>
                                        </div>
                                    </div>

                                    {/* 5. Acțiuni */}
                                    <div className="row-actions">
                                        {isAdmin && (
                                            <>
                                                <button className="btn-icon" onClick={() => openEdit(u)} title="Editează detalii">
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button className="btn-icon delete" onClick={() => stergeUtilizator(u.username)} title="Șterge">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Editare */}
            {showEdit && (
                <div className="modal-backdrop" onClick={closeEdit}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Editează utilizator</h3>
                        <form onSubmit={saveEdit}>
                            <div className="form-group">
                                <label>Nume utilizator</label>
                                <input
                                    value={editUser.username}
                                    onChange={(e) => setEditUser(s => ({...s, username: e.target.value}))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={editUser.email}
                                    onChange={(e) => setEditUser(s => ({...s, email: e.target.value}))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Grupe (separate prin virgulă)</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Grupa 1, Grupa Avansati"
                                    value={editUser.grupe}
                                    onChange={(e) => setEditUser(s => ({...s, grupe: e.target.value}))}
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="modal-btn cancel" onClick={closeEdit}>Renunță</button>
                                <button type="submit" className="modal-btn save">Salvează</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default TotiUtilizatorii;