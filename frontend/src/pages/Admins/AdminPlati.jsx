import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import "../../../static/css/EvidentaPlati.css";
import {API_BASE} from "../../config";

function EvidentaPlati() {
  const [plati, setPlati] = useState([]);
  const [filteredPlati, setFilteredPlati] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPlata, setEditingPlata] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    copil_nume: "",
    luna: "",
    suma: "",
    tip_plata: "cash",
    status: "neplatit",
  });

  const parentLabel = (row) => {
    const u = (row.parinte_nume || row.parinte_username || "").trim();
    const d = (row.parinte_display || "").trim();
    if (!u) return d || "—";
    if (!d || d.toLowerCase() === u.toLowerCase()) return u;
    return `${u} (${d})`;
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/plati/filtrate`)
      .then((res) => res.json())
      .then((data) => {
        setPlati(data);
        setFilteredPlati(data);
      });
  }, []);

  const reloadPlati = () => {
    fetch(`${API_BASE}/api/plati/filtrate`)
      .then((res) => res.json())
      .then((data) => {
        setPlati(data);
        setFilteredPlati(data);
        setFormData({
          copil_nume: "",
          luna: "",
          suma: "",
          tip_plata: "cash",
          status: "neplatit",
        });
        setEditingPlata(null);
        setShowForm(false);
      });
  };

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleAddNew = () => {
    setEditingPlata(null);
    setFormData({
      copil_nume: "",
      luna: "",
      suma: "",
      tip_plata: "cash",
      status: "neplatit",
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    const method = editingPlata && editingPlata.id ? "PUT" : "POST";
    const url =
      editingPlata && editingPlata.id
        ? `${API_BASE}/api/plati/${editingPlata.id}`
        : `${API_BASE}/api/plati`;

    const payload = {
      ...formData,
      copil_nume: formData.copil_nume.trim().toUpperCase(),
      luna: formData.luna.trim().toLowerCase(),
    };

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Eroare la salvare");
        return res.json();
      })
      .then(() => reloadPlati())
      .catch(() => alert("Eroare la trimiterea datelor"));
  };

  const handleEdit = (plata) => {
    if (editingPlata && editingPlata.id === plata.id) {
      setShowForm(false);
      setEditingPlata(null);
      return;
    }
    setEditingPlata(plata);
    setFormData({
      copil_nume: plata.copil_nume ?? "",
      luna: plata.luna ?? "",
      suma: plata.suma ?? "",
      tip_plata: plata.tip_plata ?? "cash",
      status: plata.status ?? "neplatit",
    });
    setShowForm(true);
  };

  const deletePlata = (id) => {
    if (!id) return;
    if (!window.confirm("Ești sigur că vrei să ștergi această plată?")) return;

    fetch(`${API_BASE}/api/plati/${id}`, { method: "DELETE" })
      .then(() => {
        const up = plati.filter((p) => p.id !== id);
        setPlati(up);
        setFilteredPlati(
          up.filter((p) =>
            (p.copil_nume || "").toLowerCase().includes(searchTerm) ||
            (p.parinte_nume || "").toLowerCase().includes(searchTerm) ||
            (p.parinte_display || "").toLowerCase().includes(searchTerm) ||
            (p.luna || "").toLowerCase().includes(searchTerm)
          )
        );
      })
      .catch(() => alert("Eroare la ștergere."));
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredPlati(
      plati.filter(
        (p) =>
          (p.copil_nume || "").toLowerCase().includes(term) ||
          (p.parinte_nume || "").toLowerCase().includes(term) ||
          (p.parinte_display || "").toLowerCase().includes(term) ||
          (p.luna || "").toLowerCase().includes(term)
      )
    );
  };

  return (
    <>
      <Navbar />

      <div className="ep-container">
        <div className="ep-header-row">
          <h2 className="ep-title">Evidență plăți</h2>
          {/* BUTON MIC */}
          <button className="ep-btn ep-btn-add" onClick={handleAddNew}>
            Adaugă plată
          </button>
        </div>

        <input
          type="text"
          className="ep-search-bar"
          placeholder="Caută după copil, părinte sau lună..."
          value={searchTerm}
          onChange={handleSearch}
        />

        {showForm && (
          <div className="ep-form-wrapper">
            <div className="ep-form-head">
              <h4>{editingPlata?.id ? "Editează plată" : "Adaugă plată"}</h4>
              {/* X MIC ȘI ROTUND */}
              <button className="ep-btn ep-btn-close" onClick={() => setShowForm(false)}>×</button>
            </div>

            <div className="ep-form-grid">
              <div className="ep-field">
                <label>Copil</label>
                <input
                  className="ep-input"
                  name="copil_nume"
                  placeholder="Nume copil"
                  value={formData.copil_nume}
                  onChange={handleChange}
                />
              </div>

              <div className="ep-field">
                <label>Lună</label>
                <input
                  className="ep-input"
                  name="luna"
                  placeholder="ex: ianuarie"
                  value={formData.luna}
                  onChange={handleChange}
                />
              </div>

              <div className="ep-field">
                <label>Sumă (RON)</label>
                <input
                  className="ep-input"
                  name="suma"
                  type="number"
                  placeholder="0"
                  value={formData.suma}
                  onChange={handleChange}
                />
              </div>

              <div className="ep-field">
                <label>Tip plată</label>
                <select
                  className="ep-input"
                  name="tip_plata"
                  value={formData.tip_plata}
                  onChange={handleChange}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                </select>
              </div>

              <div className="ep-field">
                <label>Status</label>
                <select
                  className="ep-input"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="platit">Plătit</option>
                  <option value="neplatit">Neplătit</option>
                </select>
              </div>
            </div>

            <div className="ep-form-actions">
              <button className="ep-btn ep-btn-ghost" onClick={() => setShowForm(false)}>
                Renunță
              </button>
              <button className="ep-btn ep-btn-add" onClick={handleSubmit}>
                {editingPlata?.id ? "Salvează" : "Adaugă"}
              </button>
            </div>
          </div>
        )}

        <div className="ep-table-container">
          <table className="ep-table">
            <thead>
              <tr>
                <th>Copil</th>
                <th>Părinte</th>
                <th>Lună</th>
                <th>Sumă</th>
                <th>Tip</th>
                <th>Status</th>
                <th className="ep-th-center">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlati.map((p, i) => (
                <tr key={p.id ?? `${p.copil_nume}-${i}`}>
                  <td data-label="Copil" className="ep-cell-bold">{p.copil_nume}</td>
                  <td data-label="Părinte">{parentLabel(p)}</td>
                  <td data-label="Lună" style={{textTransform: "capitalize"}}>{p.luna || "-"}</td>
                  <td data-label="Sumă" className="ep-cell-mono">
                    {p.suma != null ? `${p.suma} RON` : "-"}
                  </td>
                  <td data-label="Tip">
                    <span className={`ep-chip ${p.tip_plata === "card" ? "ep-chip-card" : "ep-chip-cash"}`}>
                      {p.tip_plata || "-"}
                    </span>
                  </td>
                  <td data-label="Status">
                    <span className={`ep-status ${p.status === "platit" ? "ep-status-ok" : "ep-status-no"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td data-label="Acțiuni">
                    <div className="ep-actions-cell">
                        <button
                          className="ep-btn ep-btn-table ep-btn-edit"
                          title="Editează"
                          onClick={() => handleEdit(p)}
                        >
                          Modifică
                        </button>
                        <button
                          className="ep-btn ep-btn-table ep-btn-delete"
                          title="Șterge"
                          onClick={() => deletePlata(p.id)}
                          disabled={!p.id}
                        >
                          Șterge
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPlati.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", opacity: .6, padding: "2rem" }}>
                    Nicio înregistrare găsită.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default EvidentaPlati;