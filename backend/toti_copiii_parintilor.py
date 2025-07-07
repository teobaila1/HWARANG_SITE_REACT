import json
import sqlite3

from flask import jsonify, Blueprint, request

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



@toti_copiii_parintilor_bp.route("/api/adauga_copil", methods=["POST"])
def adauga_copil():
    data = request.json
    username = data.get("username")
    nume = data.get("nume")
    varsta = data.get("varsta")
    grupa = data.get("grupa")

    if not all([username, nume, varsta, grupa]):
        return jsonify({"status": "error", "message": "Date incomplete"})

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    # Verifică dacă utilizatorul există
    cursor.execute("SELECT copii FROM utilizatori WHERE username = ?", (username,))
    row = cursor.fetchone()

    if not row:
        conn.close()
        return jsonify({"status": "error", "message": "Utilizator inexistent"})

    try:
        lista_existenta = json.loads(row[0]) if row[0] else []
    except:
        lista_existenta = []

    copil_nou = {
        "nume": nume,
        "varsta": varsta,
        "grupa": grupa
    }

    lista_existenta.append(copil_nou)
    json_actualizat = json.dumps(lista_existenta)

    cursor.execute("UPDATE utilizatori SET copii = ? WHERE username = ?", (json_actualizat, username))
    conn.commit()
    conn.close()

    return jsonify({"status": "success", "message": "Copil adăugat cu succes"})