import React, { useEffect, useState } from "react";

const genders = ["M", "F"];

function ElevForm({ initial, onSubmit, onClose }) {
  const isEdit = Boolean(initial?.id);

  const [nume, setNume] = useState(initial?.nume || "");
  const [gen, setGen] = useState(initial?.gen || "");
  const [varsta, setVarsta] = useState(initial?.varsta || "");
  const [grupa, setGrupa] = useState(initial?.grupa || "");
  const parinteId = initial?.parinte_id;

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nume || !varsta || !grupa || !parinteId) return;

    const payload = {
      id: initial?.id,
      nume: nume.trim(),
      gen: gen || null,
      varsta: Number(varsta),
      grupa: grupa.trim(),
      parinte_id: parinteId,
    };
    await onSubmit(payload, isEdit);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{isEdit ? "Editează elev" : "Adaugă elev"}</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Nume*
            <input value={nume} onChange={(e) => setNume(e.target.value)} required />
          </label>

          <label>
            Gen
            <select value={gen} onChange={(e) => setGen(e.target.value)}>
              <option value="">—</option>
              {genders.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>

          <label>
            Vârsta*
            <input type="number" min="3" max="18" value={varsta} onChange={(e) => setVarsta(e.target.value)} required />
          </label>

          <label>
            Grupa*
            <input value={grupa} onChange={(e) => setGrupa(e.target.value)} required placeholder="Ex: Grupa 7" />
          </label>

          <div className="form-actions">
            <button type="button" className="btn" onClick={onClose}>Renunță</button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? "Salvează" : "Adaugă"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ElevForm;