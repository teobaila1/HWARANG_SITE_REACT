import sqlite3

from flask import Blueprint, request, jsonify




concurs_permis_antrenori_externi_bp = Blueprint("concurs_permis_antrenori_externi", __name__)
DB_PATH = "users.db"




@concurs_permis_antrenori_externi_bp.route("/api/concurs_permis", methods=["POST"])
def concurs_permis():
    data = request.get_json()
    username = data.get("username")

    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()

        # # Găsim id-ul userului
        # cur.execute("SELECT id FROM utilizatori WHERE username = ? AND rol = 'AntrenorExtern'", (username,))
        # user_row = cur.fetchone()
        # if not user_row:
        #     return jsonify({"status": "error", "message": "Utilizator inexistent"}), 404
        #
        # user_id = user_row[0]

        # Găsim toate concursurile permise pentru acel user
        cur.execute("""
                    SELECT c.nume, c.perioada, c.locatie
                    FROM concursuri c
                    JOIN concursuri_permisiuni cp ON c.id = cp.concurs_id
                    JOIN utilizatori u ON u.id = cp.user_id
                    WHERE u.username = ?
                """, (username,))

        rows = cur.fetchall()
        concursuri = [{"nume": row[0], "perioada": row[1], "locatie": row[2]} for row in rows]

        return jsonify({"status": "success", "concursuri": concursuri})





@concurs_permis_antrenori_externi_bp.route("/api/toate_concursurile", methods=["GET"])
def toate_concursurile():
    with sqlite3.connect("users.db") as conn:
        cur = conn.cursor()
        cur.execute("SELECT id, nume, perioada FROM concursuri")
        rows = cur.fetchall()
        concursuri = [{"id": row[0], "nume": row[1], "perioada": row[2]} for row in rows]
        return jsonify({"status": "success", "concursuri": concursuri})





@concurs_permis_antrenori_externi_bp.route("/api/set_permisiuni", methods=["POST"])
def set_permisiuni():
    data = request.get_json()
    user_id = data.get("user_id")
    concurs_ids = data.get("concurs_ids", [])

    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()
        # Șterge toate permisiunile anterioare
        cur.execute("DELETE FROM concursuri_permisiuni WHERE user_id = ?", (user_id,))
        # Adaugă noile permisiuni
        for cid in concurs_ids:
            cur.execute("INSERT INTO concursuri_permisiuni (user_id, concurs_id) VALUES (?, ?)", (user_id, cid))
        conn.commit()
    return jsonify({"status": "success"})




@concurs_permis_antrenori_externi_bp.route("/api/get_permisiuni/<username>", methods=["GET"])
def get_permisiuni_antrenor(username):
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT cp.concurs_id 
            FROM concursuri_permisiuni cp
            JOIN utilizatori u ON cp.user_id = u.id
            WHERE u.username = ?
        """, (username,))
        rows = cur.fetchall()
        return jsonify([r[0] for r in rows])
