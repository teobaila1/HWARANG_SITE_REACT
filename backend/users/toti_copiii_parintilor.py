# backend/users/toti_copiii_parintilor.py
import json
import re
import uuid
from flask import Blueprint, jsonify, request
from ..config import get_conn

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

def _is_admin(con, username):
    r = con.execute("SELECT rol FROM utilizatori WHERE username=?", (username,)).fetchone()
    return bool(r and str(r["rol"]).lower() == "admin")

# ---------------- GET toți copiii ----------------
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

# ---------------- POST adaugă copil (util: alte pagini) ----------------
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
            "id": uuid.uuid4().hex,
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

# ---------------- ADMIN: PATCH copil ----------------
@toti_copiii_parintilor_bp.patch("/api/admin/copii/<child_id>")
def admin_update_child(child_id):
    data = request.get_json(silent=True) or {}
    admin_username = (data.get("admin_username") or "").strip()
    parent_username = (data.get("parent_username") or "").strip()
    if not admin_username or not parent_username:
        return jsonify({"status": "error", "message": "Lipsește admin_username sau parent_username."}), 400

    fields = {}
    if "nume" in data:    fields["nume"] = (data["nume"] or "").strip()
    if "gen" in data:     fields["gen"]  = (data["gen"] or None)
    if "grupa" in data:   fields["grupa"] = _normalize_grupa(data["grupa"])
    if "varsta" in data:
        try: fields["varsta"] = int(data["varsta"])
        except: return jsonify({"status":"error","message":"Vârsta trebuie să fie număr."}), 400

    try:
        con = get_conn()
        if not _is_admin(con, admin_username):
            return jsonify({"status":"error","message":"Doar adminul are voie."}), 403

        r = con.execute(
            "SELECT copii FROM utilizatori WHERE username=? AND LOWER(rol)='parinte'",
            (parent_username,)
        ).fetchone()
        if not r:
            return jsonify({"status":"error","message":"Părinte inexistent."}), 404

        copii = _safe_load_list(r["copii"])
        idx = next((i for i,c in enumerate(copii) if str(c.get("id"))==str(child_id)), None)
        if idx is None:
            return jsonify({"status":"error","message":"Copil inexistent."}), 404

        copii[idx].update(fields)
        con.execute(
            "UPDATE utilizatori SET copii=? WHERE username=?",
            (json.dumps(copii, ensure_ascii=False), parent_username)
        )
        con.commit()
        return jsonify({"status":"success"})
    except Exception as e:
        return jsonify({"status":"error","message":str(e)}), 500

# ---------------- ADMIN: DELETE copil ----------------
@toti_copiii_parintilor_bp.delete("/api/admin/copii/<child_id>")
def admin_delete_child(child_id):
    data = request.get_json(silent=True) or {}
    admin_username = (data.get("admin_username") or "").strip()
    parent_username = (data.get("parent_username") or "").strip()
    if not admin_username or not parent_username:
        return jsonify({"status":"error","message":"Lipsește admin_username sau parent_username."}), 400

    try:
        con = get_conn()
        if not _is_admin(con, admin_username):
            return jsonify({"status":"error","message":"Doar adminul are voie."}), 403

        r = con.execute(
            "SELECT copii FROM utilizatori WHERE username=? AND LOWER(rol)='parinte'",
            (parent_username,)
        ).fetchone()
        if not r:
            return jsonify({"status":"error","message":"Părinte inexistent."}), 404

        copii = _safe_load_list(r["copii"])
        new_list = [c for c in copii if str(c.get("id")) != str(child_id)]
        if len(new_list) == len(copii):
            return jsonify({"status":"error","message":"Copil inexistent."}), 404

        con.execute(
            "UPDATE utilizatori SET copii=? WHERE username=?",
            (json.dumps(new_list, ensure_ascii=False), parent_username)
        )
        con.commit()
        return jsonify({"status":"success"})
    except Exception as e:
        return jsonify({"status":"error","message":str(e)}), 500

# ---------------- ADMIN: PATCH părinte (username/email) ----------------
@toti_copiii_parintilor_bp.patch("/api/admin/parinte/<parent_username>")
def admin_update_parent(parent_username):
    data = request.get_json(silent=True) or {}
    admin_username = (data.get("admin_username") or "").strip()
    if not admin_username:
        return jsonify({"status":"error","message":"Lipsește admin_username."}), 400

    new_username = (data.get("new_username") or "").strip() or parent_username
    email = data.get("email", None)
    try:
        con = get_conn()
        if not _is_admin(con, admin_username):
            return jsonify({"status":"error","message":"Doar adminul are voie."}), 403

        # dacă schimbăm username-ul, verificăm coliziuni
        if new_username.lower() != parent_username.lower():
            exists = con.execute("SELECT 1 FROM utilizatori WHERE LOWER(username)=LOWER(?)", (new_username,)).fetchone()
            if exists:
                return jsonify({"status":"error","message":"Username deja folosit."}), 409

        row = con.execute(
            "SELECT id FROM utilizatori WHERE username=? AND LOWER(rol)='parinte'",
            (parent_username,)
        ).fetchone()
        if not row:
            return jsonify({"status":"error","message":"Părinte inexistent."}), 404

        con.execute(
            "UPDATE utilizatori SET username=?, email=? WHERE id=?",
            (new_username, email, row["id"])
        )
        con.commit()
        return jsonify({"status":"success"})
    except Exception as e:
        return jsonify({"status":"error","message":str(e)}), 500

# ---------------- ADMIN: DELETE părinte (șterge rândul complet) ----------------
@toti_copiii_parintilor_bp.delete("/api/admin/parinte/<parent_username>")
def admin_delete_parent(parent_username):
    data = request.get_json(silent=True) or {}
    admin_username = (data.get("admin_username") or "").strip()
    if not admin_username:
        return jsonify({"status":"error","message":"Lipsește admin_username."}), 400

    try:
        con = get_conn()
        if not _is_admin(con, admin_username):
            return jsonify({"status":"error","message":"Doar adminul are voie."}), 403

        cur = con.execute(
            "DELETE FROM utilizatori WHERE username=? AND LOWER(rol)='parinte'",
            (parent_username,)
        )
        if cur.rowcount == 0:
            return jsonify({"status":"error","message":"Părinte inexistent."}), 404
        con.commit()
        return jsonify({"status":"success"})
    except Exception as e:
        return jsonify({"status":"error","message":str(e)}), 500
