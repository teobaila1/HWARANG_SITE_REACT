# backend/users/toti_copiii_parintilor.py
import json
import re
import uuid
from flask import Blueprint, jsonify, request
from ..config import get_conn, DB_PATH

toti_copiii_parintilor_bp = Blueprint('copiii_parintilor', __name__)

def _safe_load_list(s):
    if not s:
        return []
    try:
        v = json.loads(s)
        return v if isinstance(v, list) else []
    except Exception:
        return []

def _normalize_grupa(value: str):
    """Acceptă '7', 'Grupa7', 'Grupa 7' și întoarce 'Grupa 7'."""
    if value is None:
        return None
    s = str(value).strip()
    m = re.match(r'^\s*(?:grupa\s*)?(\d+)\s*$', s, re.IGNORECASE)
    return f"Grupa {m.group(1)}" if m else s

@toti_copiii_parintilor_bp.get("/api/toti_copiii")
def toti_copiii():
    try:
        con = get_conn()
        rows = con.execute(
            "SELECT username, email, copii FROM utilizatori "
            "WHERE LOWER(rol) = 'parinte' AND copii IS NOT NULL"
        ).fetchall()

        rezultate = []
        for r in rows:
            copii = _safe_load_list(r["copii"])
            rezultate.append({
                "parinte": {"username": r["username"], "email": r["email"]},
                "copii": copii
            })

        return jsonify({"status": "success", "date": rezultate})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@toti_copiii_parintilor_bp.post("/api/adauga_copil")
def adauga_copil():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    nume = (data.get("nume") or "").strip()
    varsta = data.get("varsta")
    grupa = _normalize_grupa(data.get("grupa"))
    gen = (data.get("gen") or "").strip()  # opțional

    if not username or not nume or varsta is None or not grupa:
        return jsonify({"status": "error", "message": "Date incomplete"}), 400

    # varsta -> int dacă e posibil
    if isinstance(varsta, str) and varsta.isdigit():
        varsta = int(varsta)

    try:
        con = get_conn()
        row = con.execute(
            "SELECT copii FROM utilizatori WHERE username = ? AND LOWER(rol) = 'parinte'",
            (username,)
        ).fetchone()

        if not row:
            return jsonify({"status": "error", "message": "Utilizator inexistent sau nu este Părinte"}), 404

        lista = _safe_load_list(row["copii"])

        copil_nou = {
            "id": uuid.uuid4().hex,   # id unic, util pentru editări/ștergeri ulterioare
            "nume": nume,
            "varsta": varsta,
            "grupa": grupa,
            "gen": gen or None
        }
        lista.append(copil_nou)

        con.execute(
            "UPDATE utilizatori SET copii = ? WHERE username = ?",
            (json.dumps(lista, ensure_ascii=False), username)
        )
        con.commit()

        return jsonify({"status": "success", "message": "Copil adăugat cu succes"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
