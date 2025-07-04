import json
import sqlite3

from flask import jsonify, Blueprint

toti_copiii_parintilor_bp = Blueprint('copiii_parintilor', __name__)
DB_PATH = "users.db"

@toti_copiii_parintilor_bp.route("/api/toti_copiii", methods=["GET"])
def toti_copiii():
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cur = conn.cursor()
            cur.execute("SELECT username, email, copii FROM utilizatori WHERE rol = 'Parinte' AND copii IS NOT NULL")
            rezultate = []

            for username, email, copii_json in cur.fetchall():
                copii = json.loads(copii_json)
                rezultate.append({
                    "parinte": {"username": username, "email": email},
                    "copii": copii
                })

            return jsonify({"status": "success", "date": rezultate})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500