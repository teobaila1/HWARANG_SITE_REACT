import sqlite3

from flask import jsonify, Blueprint, request

inscriere_concurs_toti_bp = Blueprint('inscriere_concurs_toti', __name__)



@inscriere_concurs_toti_bp.route("/api/inscrisi_concursuri", methods=["GET"])
def inscrisi_concursuri():
    try:
        with sqlite3.connect("users.db") as conn:
            cur = conn.cursor()
            cur.execute("""
                SELECT id, nume, gen, categorie_varsta, grad_centura, greutate, probe, concurs, data_nasterii, username, email 
                FROM inscrieri_concursuri
            """)
            rows = cur.fetchall()
            lista = []
            for row in rows:
                lista.append({
                    "id": row[0],
                    "nume": row[1],
                    "gen": row[2],
                    "categorie": row[3],
                    "grad": row[4],
                    "greutate": row[5],
                    "probe": row[6],
                    "concurs": row[7],
                    "data_nasterii": row[8],
                    "inscris_de": f"{row[9]} ({row[10]})"
                })
            return jsonify({"status": "success", "sportivi": lista})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500




@inscriere_concurs_toti_bp.route("/api/update_inscriere/<int:id>", methods=["POST"])
def update_inscriere(id):
    data = request.get_json()
    try:
        with sqlite3.connect("users.db") as conn:
            cur = conn.cursor()
            cur.execute("""
                UPDATE inscrieri_concursuri SET
                    nume = ?, gen = ?, categorie_varsta = ?, grad_centura = ?,
                    greutate = ?, probe = ?, concurs = ?, data_nasterii = ?
                WHERE id = ?
            """, (
                data["nume"], data["gen"], data["categorie"], data["grad"],
                data["greutate"], data["probe"], data["concurs"], data["data_nasterii"], id
            ))
            conn.commit()
            return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500




@inscriere_concurs_toti_bp.route("/api/delete_inscriere/<int:id>", methods=["DELETE"])
def delete_inscriere(id):
    try:
        with sqlite3.connect("users.db") as conn:
            cur = conn.cursor()
            cur.execute("DELETE FROM inscrieri_concursuri WHERE id = ?", (id,))
            conn.commit()
            return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500