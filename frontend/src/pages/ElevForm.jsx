// src/pages/ElevForm.jsx
import React, { useMemo, useState, useEffect } from "react";

const normGen = (g) => {
  const v = String(g || "").trim().toLowerCase();
  if (v === "m" || v === "masculin") return "Masculin";
  if (v === "f" || v === "feminin") return "Feminin";
  return g || "Masculin";
};

const ElevForm = ({ initial = {}, onClose, onSubmit }) => {
  const isEdit = Boolean(initial.id);

  const [nume, setNume] = useState(initial.nume || "");

  // --- MODIFICARE: Folosim data_nasterii, nu varsta ---
  const [dataNasterii, setDataNasterii] = useState(initial.data_nasterii || "");

  const [gen, setGen] = useState(normGen(initial.gen));
  const [grupa, setGrupa] = useState(initial.grupa || "");

  const [parinteId, setParinteId] = useState(
    initial.parinte_id || initial.parent_id || ""
  );
  const [parinteNume, setParinteNume] = useState(
    initial.parent_display || initial.parinte_nume || ""
  );

  useEffect(() => {
    setGen(normGen(initial.gen));
  }, [initial.gen]);

  // Populăm data nașterii când se deschide modalul
  useEffect(() => {
    setDataNasterii(initial.data_nasterii || "");
  }, [initial.data_nasterii]);

  const title = useMemo(
    () => (isEdit ? "Editează elev" : "Adaugă elev"),
    [isEdit]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: initial.id,
      nume,
      data_nasterii: dataNasterii, // <-- Trimitem data exactă
      gen,
      grupa,
      parinte_id: parinteId || null,
      parent_display: parinteNume,
      parinte_nume: parinteNume
    }, isEdit);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h3>{title}</h3>

        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            <span>Nume elev</span>
            <input
              type="text"
              value={nume}
              onChange={(e) => setNume(e.target.value)}
              required
            />
          </label>

          {/* --- CALENDAR (Data Nașterii) --- */}
          <label>
            <span>Data Nașterii</span>
            <input
              type="date"
              value={dataNasterii}
              onChange={(e) => setDataNasterii(e.target.value)}
              required
              style={{ fontFamily: "inherit" }}
            />
          </label>

          <label>
            <span>Gen</span>
            <select value={gen} onChange={(e) => setGen(e.target.value)} required>
              <option value="Masculin">Masculin</option>
              <option value="Feminin">Feminin</option>
            </select>
          </label>

          <label>
            <span>Grupa</span>
            <input
              type="text"
              placeholder="Ex: Grupa 3"
              value={grupa}
              onChange={(e) => setGrupa(e.target.value)}
              required
            />
          </label>

          <label className="field--full">
            <span>Nume părinte (opțional – pentru părinte nou)</span>
            <input
              type="text"
              placeholder="Ex: Popescu Maria"
              value={parinteNume}
              onChange={(e) => setParinteNume(e.target.value)}
            />
          </label>

          <div className="form-actions">
            <button type="button" className="btn" onClick={onClose}>
              Anulează
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? "Salvează" : "Adaugă"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ElevForm;