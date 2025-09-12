// frontend/components/ElevForm.jsx
import React, {useEffect, useState} from "react";

const genders = ["M", "F"];

function ElevForm({initial, parentId, onSubmit, onClose}) {
    const isEdit = Boolean(initial?.id);

    const [nume, setNume] = useState(initial?.nume || "");
    const [gen, setGen] = useState(initial?.gen || "");
    const [varsta, setVarsta] = useState(initial?.varsta ?? "");
    const [grupa, setGrupa] = useState(initial?.grupa || "");
    const [parinteNume, setParinteNume] = useState(""); // nou
    const [err, setErr] = useState("");

    const parinteId = (initial && initial.parinte_id) ?? parentId ?? null;

    useEffect(() => {
        const esc = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", esc);
        return () => document.removeEventListener("keydown", esc);
    }, [onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");

        if (!nume?.trim() || varsta === "" || !grupa?.trim()) {
            setErr("Completează nume, vârsta și grupa.");
            return;
        }
        if (!parinteId && !parinteNume.trim()) {
            setErr("Trebuie să alegi un părinte sau să completezi numele părintelui.");
            return;
        }

        const payload = {
            id: initial?.id,
            nume: nume.trim(),
            gen: gen || null,
            varsta: Number(varsta),
            grupa: grupa.trim(),
            ...(parinteId
                    ? {parinte_id: parinteId}
                    : {parinte_nume: parinteNume.trim()}   // <<< DOAR asta e nevoie
            ),
        };

        await onSubmit(payload, isEdit);
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>{isEdit ? "Editează elev" : "Adaugă elev"}</h3>

                {err && <div className="alert alert-danger" role="alert">{err}</div>}

                <form onSubmit={handleSubmit} className="form-grid">
                    <label>
                        Nume și prenume elev*
                        <input
                            value={nume}
                            onChange={(e) => setNume(e.target.value)}
                            placeholder="Ex: Popescu Andrei"
                            required
                        />
                    </label>

                    <label>
                        Gen
                        <select value={gen} onChange={(e) => setGen(e.target.value)}>
                            <option value="">—</option>
                            {genders.map((g) => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Vârsta*
                        <input
                            type="number"
                            min="3"
                            max="18"
                            value={varsta}
                            onChange={(e) => setVarsta(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Grupa*
                        <input
                            value={grupa}
                            onChange={(e) => setGrupa(e.target.value)}
                            placeholder="Ex: Grupa 7"
                            required
                        />
                    </label>

                    {!parinteId && !isEdit && (
                        <label>
                            Nume părinte (dacă nu există cont)
                            <input
                                value={parinteNume}
                                onChange={(e) => setParinteNume(e.target.value)}
                                placeholder="Ex: Popescu Ion"
                            />
                        </label>
                    )}

                    {parinteId && (
                        <div className="hint">
                            <small>Părinte selectat (ID): {parinteId}</small>
                        </div>
                    )}

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
