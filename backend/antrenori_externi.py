import sqlite3

from flask import jsonify, request, Blueprint

antrenori_externi_bp = Blueprint("antrenori_externi", __name__)
DB_PATH = "users.db"



@antrenori_externi_bp.route("/api/antrenori_externi")
def get_antrenori_externi():
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT u.id, u.username, u.email
            FROM utilizatori u
            WHERE u.rol = 'AntrenorExtern'
        """)
        users = cur.fetchall()

        antrenori = []
        for user in users:
            user_id = user[0]
            cur.execute("""
                SELECT c.nume
                FROM concursuri_permisiuni cp
                JOIN concursuri c ON c.id = cp.concurs_id
                WHERE cp.user_id = ?
            """, (user_id,))
            concursuri = [row[0] for row in cur.fetchall()]

            antrenori.append({
                "id": user[0],
                "username": user[1],
                "email": user[2],
                "concursuri_permise": concursuri
            })

        return jsonify(antrenori)



