import sqlite3

from flask import request, jsonify, json, Blueprint

antrenor_dashboard_copii_parinti_bp = Blueprint("antrenor_dashboard_copii_parinti", __name__)
DB_PATH = "users.db"


@antrenor_dashboard_copii_parinti_bp.route("/api/antrenor_dashboard_data", methods=["POST"])
def antrenor_dashboard_data():
    data = request.get_json()
    username = data.get("username")

    if not username:
        return jsonify({"status": "error", "message": "Lipsă username"}), 400

    try:
        with sqlite3.connect(DB_PATH) as conn:
            cur = conn.cursor()
            # preluăm grupele din utilizatori
            cur.execute("SELECT grupe FROM utilizatori WHERE username = ?", (username,))
            row = cur.fetchone()
            if not row:
                return jsonify({"status": "error", "message": "Utilizator inexistent"}), 404

            grupe = row[0].split(",")  # ex: "Grupa 1, Grupa 2"

            rezultate = []
            for grupa in grupe:
                grupa = grupa.strip()
                # copiii din cereri_utilizatori care aparțin grupei respective
                cur.execute(
                    "SELECT copii, username, email FROM utilizatori WHERE rol = 'Parinte'"
                    " AND copii IS NOT NULL")
                for copil_json, parinte, email in cur.fetchall():
                    copii = json.loads(copil_json)
                    copii_din_grupa = [c for c in copii if c.get("grupa") == grupa]
                    if copii_din_grupa:
                        rezultate.append({
                            "grupa": grupa,
                            "copii": copii_din_grupa,
                            "parinte": {"username": parinte, "email": email}
                        })

            return jsonify({"status": "success", "date": rezultate})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@antrenor_dashboard_copii_parinti_bp.route("/api/copiii_mei", methods=["POST"])
def copiii_mei():
    data = request.get_json()
    username = data.get("username")

    if not username:
        return jsonify({"status": "error", "message": "Lipsă username"}), 400

    try:
        with sqlite3.connect(DB_PATH) as conn:
            cur = conn.cursor()
            cur.execute("SELECT copii FROM utilizatori WHERE username = ? AND rol = 'Parinte'", (username,))
            row = cur.fetchone()
            if not row:
                return jsonify({"status": "error", "message": "Părinte inexistent sau fără copii"}), 404

            copii = json.loads(row[0]) if row[0] else []
            return jsonify({"status": "success", "copii": copii})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500



