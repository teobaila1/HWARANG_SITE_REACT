import sqlite3

from flask import Blueprint, jsonify, request

toti_userii_bp = Blueprint("toti_userii", __name__)
DB_PATH = "users.db"


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn



@toti_userii_bp.route("/api/users", methods=["GET"])
def get_all_users():
    conn = get_db()
    users = conn.execute("SELECT * FROM utilizatori").fetchall()
    conn.close()

    users_list = [
        {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "rol": user["rol"]
        }
        for user in users
    ]
    return jsonify(users_list)



@toti_userii_bp.route("/api/users/<string:username>", methods=["DELETE"])
def sterge_utilizator(username):
    admin = request.args.get("admin_username")
    if not admin:
        return jsonify({"error": "Lipseste numele adminului"}), 401

    try:
        with sqlite3.connect(DB_PATH) as conn:
            cur = conn.cursor()

            # verificăm dacă adminul e valid
            cur.execute("SELECT rol FROM utilizatori WHERE username = ?", (admin,))
            row = cur.fetchone()

            if not row or row[0] != "admin":
                return jsonify({"error": "Doar adminii pot șterge utilizatori"}), 403

            # ștergem utilizatorul
            cur.execute("DELETE FROM utilizatori WHERE username = ?", (username,))
            conn.commit()

        return jsonify({"status": "Utilizator șters"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
