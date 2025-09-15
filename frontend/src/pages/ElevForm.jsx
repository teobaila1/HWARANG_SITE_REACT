// src/pages/ElevForm.jsx
import React, { useMemo, useState } from "react";

const ElevForm = ({ initial = {}, onClose, onSubmit }) => {
  const isEdit = Boolean(initial.id);

  const [nume, setNume] = useState(initial.nume || "");
  const [varsta, setVarsta] = useState(initial.varsta || "");
  const [gen, setGen] = useState(initial.gen || "");
  const [grupa, setGrupa] = useState(initial.grupa || "");
  const [parentId] = useState(
    initial.parent_id ?? initial.parinte_id ?? null
  );
  const [parentName, setParentName] = useState(
    initial.parent_name || initial.parent_display || ""
  );

  const title = useMemo(
    () => (isEdit ? "Editează elev" : "Adaugă elev"),
    [isEdit]
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...(isEdit ? { id: initial.id } : {}),
      nume: nume.trim(),
      varsta: varsta === "" ? null : Number(varsta),
      gen,
      grupa: grupa.trim(),
    };

    // opțional – dacă există / a fost modificat
    if (parentId != null) payload.parent_id = parentId;
    if (parentName && parentName.trim()) payload.parent_name = parentName.trim();

    onSubmit(payload, isEdit);
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

          <label>
            <span>Vârstă</span>
            <input
              type="number"
              min="1"
              max="99"
              value={varsta}
              onChange={(e) => setVarsta(e.target.value)}
              required
            />
          </label>

          <label>
            <span>Gen</span>
            <select value={gen} onChange={(e) => setGen(e.target.value)} required>
              <option value="">Selectează</option>
              <option value="M">Masculin</option>
              <option value="F">Feminin</option>
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

          {/* ✨ câmpul nou: Nume părinte – apare și la edit, și la add */}
          <label className="field--full">
            <span>Nume părinte (opțional)</span>
            <input
              type="text"
              placeholder="Ex: Popescu Maria"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
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
