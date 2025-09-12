import React, {useEffect, useState} from "react";
import Navbar from "../../components/Navbar";
import {useNavigate} from "react-router-dom";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/AdminTotiCopiiiSiParintii.css";

const API = "http://localhost:5000";

const AdminTotiCopiiiSiParintii = () => {
  const [data, setData] = useState([]);
  const [mesaj, setMesaj] = useState("");
  const [loading, setLoading] = useState(true);

  // modale
  const [editChild, setEditChild] = useState(null);   // { parentUsername, child:{id,nume,varsta,gen,grupa} }
  const [editParent, setEditParent] = useState(null); // { username, email }

  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setMesaj("");
    try {
      const res = await fetch(`${API}/api/toti_copiii`);
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

  const initialFrom = (s = "") => (s.trim()[0] || "P").toUpperCase();

  // --- acțiuni copil ---
  const openEditChild = (parentUsername, child) => {
    setEditChild({
      parentUsername,
      child: {
        id: child.id,
        nume: child.nume || "",
        varsta: child.varsta ?? "",
        gen: child.gen || "",
        grupa: child.grupa || ""
      }
    });
  };
  const cancelEditChild = () => setEditChild(null);

  const saveEditChild = async () => {
    if (!editChild) return;
    const admin_username = localStorage.getItem("username") || "";

    try {
      const res = await fetch(`${API}/api/admin/copii/${editChild.child.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_username,
          parent_username: editChild.parentUsername,
          nume: editChild.child.nume.trim(),
          varsta: Number(editChild.child.varsta),
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

    try {
      const res = await fetch(`${API}/api/admin/copii/${child.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
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

  // --- acțiuni părinte ---
  const openEditParent = (username, email) => setEditParent({ username, email: email || "" });
  const cancelEditParent = () => setEditParent(null);

  const saveEditParent = async () => {
    if (!editParent) return;
    const admin_username = localStorage.getItem("username") || "";

    try {
      const res = await fetch(`${API}/api/admin/parinte/${encodeURIComponent(editParent.username)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_username,
          new_username: editParent.username.trim(), // poți lăsa la fel sau modifica în UI
          email: editParent.email.trim() || null
        }),
      });
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

    try {
      const res = await fetch(`${API}/api/admin/parinte/${encodeURIComponent(username)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_username }),
      });
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
      <Navbar/>
      <div className="atcp-page">
        <div className="atcp-inner">
          <h2 className="atcp-title">Toți copiii înregistrați ai părinților</h2>

          {mesaj && <div className="atcp-alert">{mesaj}</div>}
          {loading && <p className="atcp-empty">Se încarcă…</p>}

          {!loading && (data.length === 0 ? (
            <p className="atcp-empty">Nu există date disponibile.</p>
          ) : (
            <div className="parent-grid">
              {data.map((entry, index) => (
                <section className="parent-card" key={index}>
                  <header className="parent-head">
                    <div className="avatar">{initialFrom(entry.parinte?.username)}</div>
                    <div className="parent-meta">
                      <h4 className="parent-name">{entry.parinte?.username}</h4>
                      <div className="parent-email">{entry.parinte?.email || "—"}</div>
                    </div>
                    <span className="kids-badge">{entry.copii?.length || 0} copii</span>

                    <div className="parent-actions">
                      <button className="btn btn-sm" onClick={() => openEditParent(entry.parinte.username, entry.parinte.email)}>Editează părinte</button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteParent(entry.parinte.username)}>Șterge părinte</button>
                    </div>
                  </header>

                  <ul className="kids-list">
                    {entry.copii.map((copil, i) => (
                      <li className="kid-item" key={copil.id || i}>
                        <div className="kid-row">
                          <span className="label">Nume:</span>
                          <strong>{copil.nume}</strong>
                        </div>
                        <div className="kid-row">
                          <span className="label">Gen:</span>
                          <span>{copil.gen ?? "N/A"}</span>
                        </div>
                        <div className="kid-row">
                          <span className="label">Vârstă:</span>
                          <span>{copil.varsta} ani</span>
                        </div>
                        {copil.grupa && (
                          <div className="kid-row">
                            <span className="label">Grupa:</span>
                            <span>{copil.grupa}</span>
                          </div>
                        )}

                        <div className="kid-actions">
                          <button className="btn btn-sm" onClick={() => openEditChild(entry.parinte.username, copil)}>Editează</button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteChild(entry.parinte.username, copil)}>Șterge</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ))}

          {/* Modal edit copil */}
          {editChild && (
            <div className="modal-backdrop" onClick={cancelEditChild}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Editează copil</h3>
                <div className="form-grid">
                  <label>
                    Nume
                    <input
                      value={editChild.child.nume}
                      onChange={(e) => setEditChild(st => ({...st, child:{...st.child, nume: e.target.value}}))}
                    />
                  </label>
                  <label>
                    Gen
                    <select
                      value={editChild.child.gen || ""}
                      onChange={(e) => setEditChild(st => ({...st, child:{...st.child, gen: e.target.value}}))}
                    >
                      <option value="">—</option>
                      <option value="M">M</option>
                      <option value="F">F</option>
                    </select>
                  </label>
                  <label>
                    Vârstă
                    <input
                      type="number"
                      min="3"
                      max="18"
                      value={editChild.child.varsta}
                      onChange={(e) => setEditChild(st => ({...st, child:{...st.child, varsta: e.target.value}}))}
                    />
                  </label>
                  <label>
                    Grupa
                    <input
                      value={editChild.child.grupa}
                      onChange={(e) => setEditChild(st => ({...st, child:{...st.child, grupa: e.target.value}}))}
                    />
                  </label>
                </div>

                <div className="form-actions">
                  <button className="btn" onClick={cancelEditChild}>Renunță</button>
                  <button className="btn btn-primary" onClick={saveEditChild}>Salvează</button>
                </div>
              </div>
            </div>
          )}

          {/* Modal edit părinte */}
          {editParent && (
            <div className="modal-backdrop" onClick={cancelEditParent}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Editează părinte</h3>
                <div className="form-grid">
                  <label>
                    Username
                    <input
                      value={editParent.username}
                      onChange={(e) => setEditParent(st => ({...st, username: e.target.value}))}
                    />
                  </label>
                  <label>
                    Email
                    <input
                      type="email"
                      value={editParent.email || ""}
                      onChange={(e) => setEditParent(st => ({...st, email: e.target.value}))}
                    />
                  </label>
                </div>

                <div className="form-actions">
                  <button className="btn" onClick={cancelEditParent}>Renunță</button>
                  <button className="btn btn-primary" onClick={saveEditParent}>Salvează</button>
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
