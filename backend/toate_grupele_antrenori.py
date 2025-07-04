import json
import sqlite3

from flask import jsonify, Blueprint

toate_grupele_antrenori_bp = Blueprint('toate_grupele_antrenori', __name__)
DB_PATH = "users.db"


@toate_grupele_antrenori_bp.route("/api/toate_grupele_antrenori", methods=["GET"])
def toate_grupele_antrenori():
    try:
        with sqlite3.connect("users.db") as conn:
            cur = conn.cursor()

            # Obține toți antrenorii
            cur.execute("SELECT username FROM utilizatori WHERE rol = 'Antrenor'")
            antrenori = [row[0] for row in cur.fetchall()]

            rezultat_final = []

            for antrenor in antrenori:
                cur.execute("SELECT grupe FROM utilizatori WHERE username = ?", (antrenor,))
                row = cur.fetchone()
                if not row:
                    continue

                grupe = row[0].split(",")
                grupe_result = []

                for grupa in grupe:
                    grupa = grupa.strip()

                    cur.execute("""
                        SELECT copii, username, email FROM utilizatori 
                        WHERE rol = 'Parinte' AND copii IS NOT NULL
                    """)
                    for copil_json, parinte_user, parinte_email in cur.fetchall():
                        copii = json.loads(copil_json)
                        copii_din_grupa = [c for c in copii if c.get("grupa") == grupa]
                        if copii_din_grupa:
                            grupe_result.append({
                                "grupa": grupa,
                                "copii": copii_din_grupa,
                                "parinte": {"username": parinte_user, "email": parinte_email}
                            })

                rezultat_final.append({
                    "antrenor": antrenor,
                    "grupe": grupe_result
                })

            return jsonify({"status": "success", "data": rezultat_final})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500