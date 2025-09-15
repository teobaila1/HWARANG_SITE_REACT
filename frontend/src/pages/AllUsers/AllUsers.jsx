// src/pages/TotiUtilizatorii.jsx
import React, {useEffect, useMemo, useState} from "react";
import Navbar from "../../components/Navbar";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/TotiUtilizatorii.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const ROLURI = ["admin", "Parinte", "Sportiv", "Antrenor", "AntrenorExtern"];

const TotiUtilizatorii = () => {
  const [users, setUsers] = useState([]);
  const [editari, setEditari] = useState({}); // { [id]: "rol_nou" }
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [mesaj, setMesaj] = useState("");
  const isAdmin = (localStorage.getItem("rol") || "").toLowerCase() === "admin";

  // modal edit user (nume/email)
  const [showEdit, setShowEdit] = useState(false);
  const [editUser, setEditUser] = useState({ id: null, username: "", email: "" });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/users`);
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

  useEffect(() => { loadUsers(); }, []);

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
    setEditari(prev => ({ ...prev, [userId]: rolNou }));
  };

  const handleSaveRol = async (userId) => {
    const rol_nou = editari[userId];
    if (!rol_nou) return;
    const user = users.find(u => u.id === userId);
    const admin_username = localStorage.getItem("username");

    try {
      const res = await fetch(`${API}/api/modifica-rol`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_username,
          target_username: user.username,
          rol_nou,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMesaj("Rol actualizat.");
        // actualizez în listă:
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, rol: rol_nou } : u));
        setEditari(prev => {
          const copy = { ...prev };
          delete copy[userId];
          return copy;
        });
      } else {
        setMesaj(data.error || "Eroare la actualizarea rolului.");
      }
    } catch (e) {
      setMesaj("Eroare de rețea la actualizarea rolului.");
      console.error(e);
    }
  };

  const stergeUtilizator = async (username) => {
    if (!isAdmin) return;
    const admin_username = localStorage.getItem("username");
    if (!window.confirm(`Sigur vrei să ștergi utilizatorul ${username}?`)) return;

    try {
      const res = await fetch(`${API}/api/users/${encodeURIComponent(username)}?admin_username=${encodeURIComponent(admin_username)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.status === "success") {
        setMesaj("Utilizator șters.");
        setUsers(prev => prev.filter(u => u.username !== username));
      } else {
        setMesaj(data.message || data.error || "Eroare la ștergere.");
      }
    } catch (e) {
      setMesaj("Eroare de rețea la ștergere.");
      console.error(e);
    }
  };

  // === Editare nume/email (modal) ===
  const openEdit = (u) => {
    if (!isAdmin) return;
    setEditUser({ id: u.id, username: u.username || "", email: u.email || "" });
    setShowEdit(true);
  };

  const closeEdit = () => setShowEdit(false);

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    const admin_username = localStorage.getItem("username");
    try {
      const res = await fetch(`${API}/api/users/${editUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_username,
          username: editUser.username.trim(),
          email: editUser.email.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setMesaj("Utilizator actualizat.");
        setUsers(prev =>
          prev.map(u => u.id === editUser.id
            ? { ...u, username: editUser.username.trim(), email: editUser.email.trim() }
            : u
          )
        );
        setShowEdit(false);
      } else {
        setMesaj(data.message || data.error || "Eroare la actualizare.");
      }
    } catch (e2) {
      setMesaj("Eroare de rețea la actualizare.");
      console.error(e2);
    }
  };

  // Afișaj "username (Nume Complet)" dacă avem un display_name diferit
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
              placeholder="Caută după ID / nume / email / rol…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {!!searchTerm && (
              <button className="btn-clear" onClick={() => setSearchTerm("")} aria-label="Resetează căutarea">✕</button>
            )}
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
                  <th>Rol</th>
                  <th>Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>
                      <span className="cell-username">{userLabel(u)}</span>
                      {isAdmin && (
                        <button className="link-edit" onClick={() => openEdit(u)} title="Editează nume/email">
                          editează
                        </button>
                      )}
                    </td>
                    <td>{u.email}</td>
                    <td>
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
                          title="Salvează rolul"
                        >
                          Salvează
                        </button>
                      </div>
                    </td>
                    <td className="actions">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => stergeUtilizator(u.username)}
                        disabled={!isAdmin}
                        title="Șterge utilizator"
                      >
                        Șterge
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty">
                      Niciun utilizator găsit pentru criteriul curent.
                    </td>
                  </tr>
                )}
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
                    onChange={(e) => setEditUser(s => ({ ...s, username: e.target.value }))}
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={editUser.email}
                    onChange={(e) => setEditUser(s => ({ ...s, email: e.target.value }))}
                    required
                  />
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
