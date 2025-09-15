import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/EvidentaPlati.css";

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

  // Construieste eticheta "username (Nume Complet)"
  const parentLabel = (row) => {
    const u = (row.parinte_nume || row.parinte_username || "").trim();
    const d = (row.parinte_display || "").trim();
    if (!u) return d || "—";
    if (!d || d.toLowerCase() === u.toLowerCase()) return u;
    return `${u} (${d})`;
  };

  useEffect(() => {
    fetch("/api/plati/filtrate")
      .then((res) => res.json())
      .then((data) => {
        setPlati(data);
        setFilteredPlati(data);
      });
  }, []);

  const reloadPlati = () => {
    fetch("/api/plati/filtrate")
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
        ? `/api/plati/${editingPlata.id}`
        : "/api/plati";

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

    fetch(`/api/plati/${id}`, { method: "DELETE" })
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

      <div className="evidenta-container">
        <div className="header-row">
          <h2>Evidență plăți</h2>
          <button className="btn btn-primary" onClick={handleAddNew}>
            Adaugă plată
          </button>
        </div>

        <input
          type="text"
          className="search-bar"
          placeholder="Caută după copil, părinte sau lună..."
          value={searchTerm}
          onChange={handleSearch}
        />

        {showForm && (
          <div className="plata-form card">
            <div className="form-head">
              <h4>{editingPlata?.id ? "Editează plată" : "Adaugă plată"}</h4>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>✖</button>
            </div>

            <div className="form-grid">
              <div className="field">
                <label>Copil</label>
                <input
                  name="copil_nume"
                  placeholder="Nume copil"
                  value={formData.copil_nume}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Lună</label>
                <input
                  name="luna"
                  placeholder="ex: ianuarie"
                  value={formData.luna}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Sumă (RON)</label>
                <input
                  name="suma"
                  type="number"
                  placeholder="0"
                  value={formData.suma}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Tip plată</label>
                <select
                  name="tip_plata"
                  value={formData.tip_plata}
                  onChange={handleChange}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                </select>
              </div>

              <div className="field">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="platit">Plătit</option>
                  <option value="neplatit">Neplătit</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" onClick={handleSubmit}>
                {editingPlata?.id ? "Salvează" : "Adaugă"}
              </button>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>
                Renunță
              </button>
            </div>
          </div>
        )}

        <div className="table-wrap">
          <table className="plati-table">
            <thead>
              <tr>
                <th>Copil</th>
                <th>Părinte</th>
                <th>Lună</th>
                <th>Sumă</th>
                <th>Tip</th>
                <th>Status</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlati.map((p, i) => (
                <tr key={p.id ?? `${p.copil_nume}-${i}`}>
                  <td className="cell-name">{p.copil_nume}</td>
                  <td>{parentLabel(p)}</td>
                  <td className="cell-month">{p.luna || "-"}</td>
                  <td className="cell-amount">
                    {p.suma != null ? `${p.suma} RON` : "-"}
                  </td>
                  <td>
                    <span className={`chip ${p.tip_plata === "card" ? "chip--card" : "chip--cash"}`}>
                      {p.tip_plata || "-"}
                    </span>
                  </td>
                  <td>
                    <span className={`status ${p.status === "platit" ? "status--ok" : "status--no"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="btn btn-icon"
                      title="Editează"
                      onClick={() => handleEdit(p)}
                    >
                      Modifică
                    </button>
                    <button
                      className="btn btn-icon btn-danger"
                      title="Șterge"
                      onClick={() => deletePlata(p.id)}
                      disabled={!p.id}
                    >
                      Șterge
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPlati.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", opacity: .8 }}>
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
