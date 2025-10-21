// frontend/pages/Admins/AdminAntrenoriGrupe.jsx
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

  // ——— helper: ia array indiferent de formă
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
      const res = await fetch(`${API_BASE}/api/toate_grupele_antrenori`);
      const json = await res.json();

      // acceptă data/date/results sau map
      const raw =
        json?.data ?? json?.date ?? json?.results ?? json ?? [];

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

  const handleEdit = (copil, grupaName) => {
    setEditElev({...copil, grupa: grupaName});
    setShowForm(true);
  };

  const handleSubmitForm = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/api/elevi/${payload.id}`, {
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

  const askDelete = (copil) =>
    setConfirm({open: true, id: copil.id, nume: copil.nume});

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/elevi/${confirm.id}`, {method: "DELETE"});
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
          <h2 className="aag-title">Grupele tuturor antrenorilor</h2>

          {loading && <p>Se încarcă…</p>}
          {!loading && msg && <div className="aag-alert">{msg}</div>}

          {data.map((coach, index) => (
            <section key={`${coach.antrenor}-${index}`} className="coach-section">
              <div className="coach-head">
                <div className="coach-avatar">{initialFromName(coach.antrenor_display || coach.antrenor)}</div>
                <div className="coach-meta">
                  <h3 className="coach-name">{coachLabel(coach)}</h3>
                  <div className="coach-sub">
                    Grupe: <strong>{coach.grupe.length}</strong>
                  </div>
                </div>
              </div>

              <div className="groups-grid">
                {coach.grupe.map((gr, i) => (
                  <div key={`${coach.antrenor}-${gr.grupa}-${i}`} className="group-card">
                    <div className="group-head">
                      <h4 className="group-name">{gr.grupa || "—"}</h4>
                      <span className="chip">{gr.copii?.length || 0} sportivi</span>
                    </div>

                    <ul className="athlete-list">
                      {(gr.copii || []).map((copil, k) => (
                        <li key={copil.id || k} className="athlete-item">
                          <div className="athlete-name">
                            <span className="label">Nume:</span>
                            <strong>{copil.nume || "—"}</strong>
                          </div>
                          <div className="athlete-field">
                            <span className="label">Gen:</span>
                            <span>{copil.gen ?? "N/A"}</span>
                          </div>
                          <div className="athlete-field">
                            <span className="label">Vârstă:</span>
                            <span>{copil.varsta != null ? `${copil.varsta} ani` : "—"}</span>
                          </div>

                          <div className="athlete-actions">
                            <button
                              className="btn btn-sm"
                              disabled={!copil.id}
                              onClick={() => handleEdit(copil, gr.grupa)}
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

          {!loading && data.length === 0 && (
            <div className="aag-alert">Nu am găsit niciun antrenor.</div>
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
