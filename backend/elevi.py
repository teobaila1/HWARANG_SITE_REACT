# backend/users/elevi.py
import json, uuid, re
from flask import Blueprint, request, jsonify
from ..config import get_conn, DB_PATH

elevi_bp = Blueprint("elevi", __name__)

# ----------------- helpers -----------------
def _normalize_grupa(value):
    """Acceptă '7', 'Grupa7', 'Grupa 7' -> 'Grupa 7'."""
    if value is None:
        return None
    s = str(value).strip()
    m = re.match(r'^\s*(?:grupa\s*)?(\d+)\s*$', s, re.IGNORECASE)
    return f"Grupa {m.group(1)}" if m else s

def _safe_load_children(copii_json):
    if not copii_json:
        return []
    try:
        v = json.loads(copii_json)
        return v if isinstance(v, list) else []
    except Exception:
        return []

def _save_parent_children(con, parent_id, children):
    con.execute(
        "UPDATE utilizatori SET copii = ? WHERE id = ?",
        (json.dumps(children, ensure_ascii=False), parent_id)
    )

def _ensure_child_ids(children):
    changed = False
    for c in children:
        if not c.get("id"):
            c["id"] = uuid.uuid4().hex
            changed = True
        # varsta -> int dacă e string numeric
        if "varsta" in c and isinstance(c["varsta"], str) and c["varsta"].isdigit():
            c["varsta"] = int(c["varsta"])
        # grupa -> normalizată
        if "grupa" in c:
            ng = _normalize_grupa(c["grupa"])
            if ng != c["grupa"]:
                c["grupa"] = ng
                changed = True
    return changed, children

def _find_parent_of_child(con, child_id):
    rows = con.execute(
        "SELECT id, copii FROM utilizatori WHERE LOWER(rol) = 'parinte'"
    ).fetchall()
    for r in rows:
        parent_id = r["id"]
        children = _safe_load_children(r["copii"])
        for idx, c in enumerate(children):
            if str(c.get("id")) == str(child_id):
                return parent_id, children, idx
    return None, None, None
# -------------------------------------------


@elevi_bp.post("/api/elevi")
def create_elev():
    data = request.get_json(silent=True) or {}
    nume       = (data.get("nume") or "").strip()
    varsta     = data.get("varsta")
    grupa_raw  = data.get("grupa")
    grupa      = _normalize_grupa(grupa_raw)
    gen        = (data.get("gen") or None)
    parent_id  = data.get("parinte_id")

    if not nume or varsta is None or not grupa or not parent_id:
        return jsonify({"status": "error", "message": "Câmpuri obligatorii: nume, varsta, grupa, parinte_id."}), 400

    try:
        varsta = int(varsta)
    except Exception:
        return jsonify({"status": "error", "message": "Vârsta trebuie să fie număr."}), 400

    con = get_conn()
    try:
        parent = con.execute(
            "SELECT id, copii, grupe FROM utilizatori WHERE id = ?",
            (parent_id,)
        ).fetchone()
        if not parent:
            return jsonify({"status": "error", "message": "Părinte inexistent."}), 404

        children = _safe_load_children(parent["copii"])
        _, children = _ensure_child_ids(children)

        new_child = {
            "id": uuid.uuid4().hex,
            "nume": nume,
            "varsta": varsta,
            "grupa": grupa,
            "gen": gen
        }
        children.append(new_child)
        _save_parent_children(con, parent_id, children)

        # actualizează coloana grupe (fără duplicate)
        existing_grupe = [g.strip() for g in (parent["grupe"] or "").split(",") if g.strip()]
        if grupa and grupa not in existing_grupe:
            existing_grupe.append(grupa)
            con.execute(
                "UPDATE utilizatori SET grupe = ? WHERE id = ?",
                (", ".join(existing_grupe), parent_id)
            )

        con.commit()
        return jsonify({"status": "success", "id": new_child["id"]}), 201

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@elevi_bp.patch("/api/elevi/<child_id>")
def update_elev(child_id):
    data = request.get_json(silent=True) or {}
    allowed = {"nume", "varsta", "grupa", "gen"}
    payload = {k: v for k, v in data.items() if k in allowed}

    if "grupa" in payload:
        payload["grupa"] = _normalize_grupa(payload["grupa"])

    if "varsta" in payload:
        try:
            payload["varsta"] = int(payload["varsta"])
        except Exception:
            return jsonify({"status": "error", "message": "Vârsta trebuie să fie număr."}), 400

    con = get_conn()
    try:
        parent_id, children, idx = _find_parent_of_child(con, child_id)
        if parent_id is None:
            return jsonify({"status": "error", "message": "Elev inexistent."}), 404

        children[idx].update(payload)
        _save_parent_children(con, parent_id, children)
        con.commit()
        return jsonify({"status": "success"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@elevi_bp.delete("/api/elevi/<child_id>")
def delete_elev(child_id):
    con = get_conn()
    try:
        parent_id, children, idx = _find_parent_of_child(con, child_id)
        if parent_id is None:
            return jsonify({"status": "error", "message": "Elev inexistent."}), 404

        children.pop(idx)
        _save_parent_children(con, parent_id, children)
        con.commit()
        return jsonify({"status": "success"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
