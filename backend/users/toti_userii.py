# backend/users/toti_userii.py
from flask import Blueprint, jsonify, request
from ..config import get_conn, DB_PATH

toti_userii_bp = Blueprint("toti_userii", __name__)

@toti_userii_bp.get("/api/users")
def get_all_users():
    con = get_conn()
    rows = con.execute("SELECT id, username, email, rol FROM utilizatori ORDER BY id DESC").fetchall()
    return jsonify([dict(r) for r in rows])


@toti_userii_bp.delete("/api/users/<string:username>")
def sterge_utilizator(username: str):
    admin = (request.args.get("admin_username") or "").strip()
    if not admin:
        return jsonify({"status": "error", "message": "Lipsește numele adminului"}), 401

    try:
        con = get_conn()

        # verificăm că requester-ul e admin
        admin_row = con.execute(
            "SELECT rol FROM utilizatori WHERE username = ? LIMIT 1",
            (admin,)
        ).fetchone()
        if not admin_row or (admin_row["rol"] or "").lower() != "admin":
            return jsonify({"status": "error", "message": "Doar adminii pot șterge utilizatori"}), 403

        # (opțional) împiedică ștergerea propriului cont de admin
        # if admin.lower() == username.lower():
        #     return jsonify({"status": "error", "message": "Nu îți poți șterge propriul cont"}), 400

        cur = con.execute("DELETE FROM utilizatori WHERE username = ?", (username,))
        con.commit()

        if cur.rowcount == 0:
            return jsonify({"status": "error", "message": "Utilizator inexistent"}), 404

        return jsonify({"status": "success", "message": "Utilizator șters", "username": username}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500



@toti_userii_bp.patch("/api/users/<int:user_id>")
def update_user(user_id: int):
    from sqlite3 import IntegrityError
    data = request.get_json(silent=True) or {}
    admin = (data.get("admin_username") or "").strip()
    new_username = (data.get("username") or "").strip()
    new_email = (data.get("email") or "").strip()

    if not admin:
        return jsonify({"status": "error", "message": "Lipsește numele adminului"}), 401
    if not new_username or not new_email:
        return jsonify({"status": "error", "message": "Nume și email sunt obligatorii"}), 400

    try:
        con = get_conn()

        # verifică admin
        admin_row = con.execute(
            "SELECT rol FROM utilizatori WHERE username = ? LIMIT 1",
            (admin,)
        ).fetchone()
        if not admin_row or (admin_row["rol"] or "").lower() != "admin":
            return jsonify({"status": "error", "message": "Doar adminii pot modifica utilizatori"}), 403

        # update username/email
        cur = con.execute("""
            UPDATE utilizatori
               SET username = ?, email = ?
             WHERE id = ?
        """, (new_username, new_email, user_id))
        con.commit()

        if cur.rowcount == 0:
            return jsonify({"status": "error", "message": "Utilizator inexistent"}), 404

        return jsonify({"status": "success", "message": "Utilizator actualizat"}), 200

    except IntegrityError as ie:
        # dacă ai UNIQUE pe username/email, prinde coliziuni
        return jsonify({"status": "error", "message": "Username sau email deja folosit"}), 409
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500