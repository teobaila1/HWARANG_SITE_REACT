import React, {useEffect, useState} from "react";
import Navbar from "../../components/Navbar";
import {useNavigate} from "react-router-dom";
import "../../../static/css/AdminAntrenoriGrupe.css";

import ElevForm from "../ElevForm";
import ConfirmDialog from "../ConfirmDialog";
import {API_BASE} from "../../config";

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

  const toArray = (x) => {
    if (Array.isArray(x)) return x;
    if (x && typeof x === "object") return Object.values(x);
    return [];
  };

  const normalize = (rows) =>
    toArray(rows).map((r) => ({
      antrenor: r.antrenor ?? r.username ?? "",
      antrenor_display: r.antrenor_display ?? r.display ?? r.nume_complet ?? r.username ?? "",
      grupe: Array.isArray(r.grupe) ? r.grupe : [],
    }));

  const loadData = async () => {
    setLoading(true);
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/toate_grupele_antrenori`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const json = await res.json();
      const raw = json?.data ?? json?.date ?? json?.results ?? json ?? [];
      const normalized = normalize(raw);
      setData(normalized);
    } catch (e) {
      setMsg("Eroare de rețea.");
    } finally {
      setLoading(false);
    }
  };

  const initialFromName = (name) =>
    ((name && name.trim && name.trim()[0]) || "A").toUpperCase();

  const coachLabel = (row) => {
    const u = (row.antrenor || "").trim();
    const d = (row.antrenor_display || "").trim();
    if (!d || d.toLowerCase() === u.toLowerCase()) return u || "—";
    return `${u} (${d})`;
  };

  // Helper pentru Gen
  const prettyGen = (g) => {
      if (!g) return null;
      const v = String(g).toLowerCase();
      if (v.startsWith("m")) return "M";
      if (v.startsWith("f")) return "F";
      return null;
  };

  const handleEdit = (copil, grupaName) => {
    let parentName = "";
    if (copil._parent) {
        parentName = copil._parent.display || copil._parent.nume_complet || copil._parent.username || "";
    }

    setEditElev({
        ...copil,
        grupa: grupaName,
        parent_display: parentName,
        parinte_id: copil._parent?.id
    });
    setShowForm(true);
  };

  const handleSubmitForm = async (payload) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/elevi/${payload.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
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

  const askDelete = (copil) =>
    setConfirm({open: true, id: copil.id, nume: copil.nume});

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/elevi/${confirm.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
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

  return (
    <>
      <Navbar />
      <div className="aag-page">
        <div className="aag-inner">
          <h2 className="aag-title">Administrare Grupe Antrenori</h2>

          {loading && <p style={{color:'#888', textAlign:'center'}}>Se încarcă datele...</p>}
          {!loading && msg && <div style={{background:'#333', padding:'10px', color:'#fff', marginBottom:'20px', borderRadius:'8px'}}>{msg}</div>}

          {data.map((coach, index) => (
            <div key={`${coach.antrenor}-${index}`} className="coach-section">
              <div className="coach-head">
                <div className="coach-avatar">{initialFromName(coach.antrenor_display || coach.antrenor)}</div>
                <div className="coach-meta">
                  <h3 className="coach-name">{coachLabel(coach)}</h3>
                  <div className="coach-sub">
                    Antrenor • <strong>{coach.grupe.length}</strong> grupe active
                  </div>
                </div>
              </div>

              <div className="groups-grid">
                {coach.grupe.map((gr, i) => (
                  <div key={`${coach.antrenor}-${gr.grupa}-${i}`} className="group-card">
                    <div className="group-head">
                      <h4 className="group-name">{gr.grupa || "Fără Grupă"}</h4>
                      <span className="chip">{gr.copii?.length || 0} sportivi</span>
                    </div>

                    <ul className="athlete-list">
                      {(gr.copii || []).map((copil, k) => {
                        const genShort = prettyGen(copil.gen);
                        const parinteNume = copil._parent?.display || copil._parent?.username || "—";

                        return (
                            <li key={copil.id || k} className="athlete-item">

                              {/* 1. Avatar Mic */}
                              <div className="row-avatar-small" style={{backgroundColor: genShort === 'F' ? '#831843' : '#1e3a8a'}}>
                                {initialFromName(copil.nume)}
                              </div>

                              {/* 2. Nume Elev */}
                              <div className="row-name" title={copil.nume}>
                                {copil.nume || "Fără Nume"}
                              </div>

                              {/* 3. Detalii (Gen + Vârstă) */}
                              <div className="row-details">
                                {genShort && (
                                    <span className={`badge ${genShort === 'F' ? 'female' : 'male'}`}>
                                      {genShort === 'F' ? 'Fem' : 'Masc'}
                                    </span>
                                )}
                                <span className="badge age">
                                  {copil.varsta != null ? `${copil.varsta} ani` : "?"}
                                </span>
                              </div>

                              {/* 4. Părinte */}
                              <div className="row-parent">
                                <small>Părinte</small>
                                <span>{parinteNume}</span>
                              </div>

                              {/* 5. Acțiuni */}
                              <div className="row-actions">
                                <button
                                  className="btn-icon-sm"
                                  onClick={() => handleEdit(copil, gr.grupa)}
                                  title="Editează"
                                >
                                  <i className="fas fa-pen"></i>
                                </button>
                                <button
                                  className="btn-icon-sm delete"
                                  onClick={() => askDelete(copil)}
                                  title="Șterge"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </li>
                        );
                      })}
                      {(!gr.copii || gr.copii.length === 0) && (
                          <li style={{padding:'20px', textAlign:'center', color:'#555', fontSize:'0.9rem'}}>
                              Niciun sportiv în această grupă.
                          </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {!loading && data.length === 0 && (
            <div className="aag-alert">Nu am găsit niciun antrenor cu grupe alocate.</div>
          )}
        </div>
      </div>

      {showForm && (
        <ElevForm
          initial={editElev}
          onSubmit={handleSubmitForm}
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