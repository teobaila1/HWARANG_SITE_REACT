from flask import Flask, request, jsonify, Blueprint
import sqlite3

modifica_rol_bp = Blueprint("modifica_rol", __name__)
DB_PATH = "users.db"

@modifica_rol_bp.route("/api/modifica-rol", methods=["POST"])
def modifica_rol():
    data = request.get_json()
    admin_username = data.get("admin_username")
    target_username = data.get("target_username")
    rol_nou = data.get("rol_nou")

    if not all([admin_username, target_username, rol_nou]):
        return jsonify({"error": "Date incomplete"}), 400

    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()

        cur.execute("SELECT rol FROM utilizatori WHERE username = ?", (admin_username,))
        row = cur.fetchone()

        if not row or row[0] != "admin":
            return jsonify({"error": "Doar adminii pot modifica roluri"}), 403

        cur.execute("UPDATE utilizatori SET rol = ? WHERE username = ?", (rol_nou, target_username))
        conn.commit()
        conn.close()

        return jsonify({"status": "Rol actualizat cu succes"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

