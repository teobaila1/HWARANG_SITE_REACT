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

    // State pentru modal editare (inclusiv grupe)
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

    // === Deschidere Modal ===
    const openEdit = (u) => {
        if (!isAdmin) return;
        setEditUser({
            id: u.id,
            username: u.username || "",
            email: u.email || "",
            grupe: u.grupe || "" // Pre-populăm grupele existente
        });
        setShowEdit(true);
    };

    const closeEdit = () => setShowEdit(false);

    // === SALVARE DATE (AICI ERA PROBLEMA) ===
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
                    grupe: editUser.grupe // <--- ACUM TRIMITEM GRUPELE!
                }),
            });
            const data = await res.json();
            if (res.ok && data.status === "success") {
                setMesaj("Utilizator actualizat.");
                // Actualizăm local lista ca să vedem modificarea instant
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

    const userLabel = (u) => {
        const uName = (u.username || "").trim();
        const disp = (u.display_name || u.nume_complet || "").trim();
        if (!disp || disp.toLowerCase() === uName.toLowerCase()) return uName || "—";
        return `${uName} (${disp})`;
    };

    return (
        <>
            <Navbar/>
            <section className="allusers">
                <div className="allusers-head">
                    <h2>Toți utilizatorii</h2>
                    <div className="search-wrap">
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Caută..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading && <div className="alert">Se încarcă…</div>}
                {!loading && mesaj && <div className="alert">{mesaj}</div>}

                {!loading && (
                    <div className="table-wrap">
                        <table className="users-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nume</th>
                                <th>Email</th>
                                <th>Grupe</th>
                                <th>Rol</th>
                                <th>Acțiuni</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers.map((u) => (
                                <tr key={u.id}>
                                    <td data-label="ID">{u.id}</td>

                                    <td data-label="Nume">
                                        <span className="cell-username">{userLabel(u)}</span>
                                        {isAdmin && (
                                            <button className="link-edit" onClick={() => openEdit(u)}
                                                    title="Editează detalii">
                                                editează
                                            </button>
                                        )}
                                    </td>

                                    <td data-label="Email">{u.email}</td>

                                    <td data-label="Grupe">
                                        {u.grupe ? u.grupe : <span style={{color:"#888"}}>-</span>}
                                    </td>

                                    <td data-label="Rol">
                                        <div className="rol-edit">
                                            <select
                                                value={editari[u.id] ?? (u.rol || "").trim()}
                                                onChange={(e) => handleRolChange(u.id, e.target.value)}
                                                className="rol-select"
                                                disabled={!isAdmin}
                                            >
                                                {ROLURI.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                            <button
                                                className="btn btn-sm"
                                                disabled={!isAdmin || !editari[u.id] || editari[u.id] === (u.rol || "").trim()}
                                                onClick={() => handleSaveRol(u.id)}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </td>

                                    <td data-label="Acțiuni" className="actions">
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => stergeUtilizator(u.username)}
                                            disabled={!isAdmin}
                                        >
                                            Șterge
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ===== Modal edit user ===== */}
                {showEdit && (
                    <div className="modal-backdrop" onClick={closeEdit}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <h3>Editează utilizator</h3>
                            <form onSubmit={saveEdit} className="form-grid">
                                <label>
                                    Nume utilizator
                                    <input
                                        value={editUser.username}
                                        onChange={(e) => setEditUser(s => ({...s, username: e.target.value}))}
                                        required
                                    />
                                </label>
                                <label>
                                    Email
                                    <input
                                        type="email"
                                        value={editUser.email}
                                        onChange={(e) => setEditUser(s => ({...s, email: e.target.value}))}
                                        required
                                    />
                                </label>

                                <label>
                                    Grupe (separate prin virgulă)
                                    <input
                                        type="text"
                                        placeholder="Ex: Grupa 1, Grupa Avansati"
                                        value={editUser.grupe}
                                        onChange={(e) => setEditUser(s => ({...s, grupe: e.target.value}))}
                                    />
                                    <small style={{color:"#888"}}>
                                        Completează aici pentru ca acest admin să apară și ca Antrenor.
                                    </small>
                                </label>

                                <div className="form-actions">
                                    <button type="button" className="btn" onClick={closeEdit}>Renunță</button>
                                    <button type="submit" className="btn btn-primary">Salvează</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
};

export default TotiUtilizatorii;