import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../../../static/css/AdminTotiCopiiiSiParintii.css";
import {API_BASE} from "../../config";

const AdminTotiCopiiiSiParintii = () => {
  const [data, setData] = useState([]);
  const [mesaj, setMesaj] = useState("");
  const [loading, setLoading] = useState(true);

  // Modale
  const [editChild, setEditChild] = useState(null);
  const [editParent, setEditParent] = useState(null);

  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setMesaj("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/toti_copiii`, {
          headers: {
              "Authorization": `Bearer ${token}`
          }
      });
      const result = await res.json();
      if (result.status === "success") {
        setData(result.date || []);
      } else {
        setMesaj(result.message || "Eroare la încărcarea datelor.");
      }
    } catch {
      setMesaj("Eroare de rețea.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const rol = localStorage.getItem("rol");
    if (rol !== "admin") {
      navigate("/access-denied");
      return;
    }
    load();
  }, [navigate]);

  const parentLabel = (p) => {
    if (!p) return "—";
    const u = (p.username || "").trim();
    const d = (p.display || p.nume_complet || "").trim();
    if (!d || d.toLowerCase() === u.toLowerCase()) return u || "—";
    return `${u} (${d})`;
  };
  const initialFrom = (p) => {
    const t = ((p?.display || p?.username) || "P").trim();
    return (t[0] || "P").toUpperCase();
  };

  // --- ACȚIUNI COPIL ---
  const openEditChild = (parentUsername, child) => {
    setEditChild({
      parentUsername,
      child: {
        id: child.id,
        nume: child.nume || "",
        data_nasterii: child.data_nasterii || "",
        gen: child.gen || "",
        grupa: child.grupa || "",
      },
    });
  };
  const cancelEditChild = () => setEditChild(null);

  const saveEditChild = async () => {
    if (!editChild) return;
    const admin_username = localStorage.getItem("username") || "";
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_BASE}/api/admin/copii/${editChild.child.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          admin_username,
          parent_username: editChild.parentUsername,
          nume: editChild.child.nume.trim(),
          data_nasterii: editChild.child.data_nasterii,
          grupa: editChild.child.grupa.trim(),
          gen: editChild.child.gen || null,
        }),
      });
      const js = await res.json().catch(() => ({}));
      if (res.ok) {
        setMesaj("Copil actualizat.");
        setEditChild(null);
        await load();
      } else {
        setMesaj(js.message || "Actualizarea a eșuat.");
      }
    } catch {
      setMesaj("Eroare de rețea la actualizare.");
    }
  };

  const deleteChild = async (parentUsername, child) => {
    const admin_username = localStorage.getItem("username") || "";
    if (!window.confirm(`Ștergi copilul „${child.nume}”?`)) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_BASE}/api/admin/copii/${child.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ admin_username, parent_username: parentUsername }),
      });
      const js = await res.json().catch(() => ({}));
      if (res.ok) {
        setMesaj("Copil șters.");
        await load();
      } else {
        setMesaj(js.message || "Ștergerea a eșuat.");
      }
    } catch {
      setMesaj("Eroare de rețea la ștergere.");
    }
  };

  // --- ACȚIUNI PĂRINTE ---
  const openEditParent = (username, email, fullName) =>
    setEditParent({ username, email: email || "", nume_complet: fullName || "" });

  const cancelEditParent = () => setEditParent(null);

  const saveEditParent = async () => {
    if (!editParent) return;
    const admin_username = localStorage.getItem("username") || "";
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${API_BASE}/api/admin/parinte/${encodeURIComponent(editParent.username)}`,
        {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            admin_username,
            new_username: editParent.username.trim(),
            email: (editParent.email || "").trim() || null,
            nume_complet: (editParent.nume_complet || "").trim() || null,
          }),
        }
      );
      const js = await res.json().catch(() => ({}));
      if (res.ok) {
        setMesaj("Părinte actualizat.");
        setEditParent(null);
        await load();
      } else {
        setMesaj(js.message || "Actualizarea părintelui a eșuat.");
      }
    } catch {
      setMesaj("Eroare de rețea la actualizarea părintelui.");
    }
  };

  const deleteParent = async (username) => {
    const admin_username = localStorage.getItem("username") || "";
    if (!window.confirm(`Ștergi părintele „${username}” (cu toți copiii lui)?`)) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${API_BASE}/api/admin/parinte/${encodeURIComponent(username)}`,
        {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ admin_username }),
        }
      );
      const js = await res.json().catch(() => ({}));
      if (res.ok) {
        setMesaj("Părinte șters.");
        await load();
      } else {
        setMesaj(js.message || "Ștergerea părintelui a eșuat.");
      }
    } catch {
      setMesaj("Eroare de rețea la ștergerea părintelui.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="atcp-page">
        <div className="atcp-inner">
          <h2 className="atcp-title">Toți copiii înregistrați ai părinților</h2>

          {mesaj && <div className="atcp-alert">{mesaj}</div>}
          {loading && <p className="atcp-empty">Se încarcă…</p>}

          {!loading &&
            (data.length === 0 ? (
              <p className="atcp-empty">Nu există date disponibile.</p>
            ) : (
              <div className="parent-grid">
                {data.map((entry, index) => (
                  <div className="parent-card" key={index}>

                    {/* Header Părinte */}
                    <div className="parent-header">
                      <div className="parent-avatar">{initialFrom(entry.parinte)}</div>
                      <div className="parent-info">
                        <div className="parent-name">{parentLabel(entry.parinte)}</div>
                        <div className="parent-email">{entry.parinte?.email || "—"}</div>
                      </div>

                      <span className="kids-count-badge">{entry.copii?.length || 0} copii</span>

                      <div className="actions-group">
                        <button
                          className="btn-icon"
                          onClick={() => openEditParent(entry.parinte.username, entry.parinte.email, entry.parinte.nume_complet)}
                          title="Editează părinte"
                        >
                          <i className="fas fa-pen"></i>
                        </button>
                        <button
                          className="btn-icon delete"
                          onClick={() => deleteParent(entry.parinte.username)}
                          title="Șterge părinte"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>

                    {/* Listă Copii */}
                    <ul className="kids-list">
                      {entry.copii.map((copil, i) => (
                        <li className="kid-item" key={copil.id || i}>
                          <div className="kid-name">
                            {copil.nume}
                          </div>

                          <div className="kid-detail">
                            {copil.gen ? <span className="kid-badge">{copil.gen}</span> : "—"}
                          </div>

                          <div className="kid-detail">
                            <strong>Născut:</strong> {copil.data_nasterii || "—"}
                          </div>

                          <div className="kid-detail">
                            {copil.grupa ? <span className="kid-badge">{copil.grupa}</span> : "—"}
                          </div>

                          <div className="kid-actions actions-group">
                            <button
                              className="btn-icon"
                              onClick={() => openEditChild(entry.parinte.username, copil)}
                              title="Editează copil"
                            >
                              <i className="fas fa-pen"></i>
                            </button>
                            <button
                              className="btn-icon delete"
                              onClick={() => deleteChild(entry.parinte.username, copil)}
                              title="Șterge copil"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}

          {/* Modal edit copil */}
          {editChild && (
            <div className="modal-backdrop" onClick={cancelEditChild}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Editează copil</h3>
                <div className="form-group">
                  <label>Nume</label>
                  <input
                    value={editChild.child.nume}
                    onChange={(e) =>
                      setEditChild((st) => ({
                        ...st,
                        child: { ...st.child, nume: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Gen</label>
                  <select
                    value={editChild.child.gen || ""}
                    onChange={(e) =>
                      setEditChild((st) => ({
                        ...st,
                        child: { ...st.child, gen: e.target.value },
                      }))
                    }
                  >
                    <option value="">— Selectează —</option>
                    <option value="Masculin">Masculin</option>
                    <option value="Feminin">Feminin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Data Nașterii</label>
                  <input
                    type="date"
                    value={editChild.child.data_nasterii || ""}
                    onChange={(e) =>
                      setEditChild((st) => ({
                        ...st,
                        child: { ...st.child, data_nasterii: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Grupa</label>
                  <input
                    value={editChild.child.grupa}
                    onChange={(e) =>
                      setEditChild((st) => ({
                        ...st,
                        child: { ...st.child, grupa: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="form-actions">
                  <button className="modal-btn cancel" onClick={cancelEditChild}>Renunță</button>
                  <button className="modal-btn save" onClick={saveEditChild}>Salvează</button>
                </div>
              </div>
            </div>
          )}

          {/* Modal edit părinte */}
          {editParent && (
            <div className="modal-backdrop" onClick={cancelEditParent}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Editează părinte</h3>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    value={editParent.username}
                    onChange={(e) =>
                      setEditParent((st) => ({ ...st, username: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editParent.email || ""}
                    onChange={(e) =>
                      setEditParent((st) => ({ ...st, email: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Nume complet (opțional)</label>
                  <input
                    value={editParent.nume_complet || ""}
                    onChange={(e) =>
                      setEditParent((st) => ({ ...st, nume_complet: e.target.value }))
                    }
                  />
                </div>

                <div className="form-actions">
                  <button className="modal-btn cancel" onClick={cancelEditParent}>Renunță</button>
                  <button className="modal-btn save" onClick={saveEditParent}>Salvează</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminTotiCopiiiSiParintii;