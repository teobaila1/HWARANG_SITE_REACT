from flask import Flask, request, jsonify, Blueprint
import sqlite3

from inregistrare import trimite_email_acceptare, trimite_email_respingere

cereri_utilizatori_bp = Blueprint("cereri_utilizatori", __name__)
DB_PATH = "users.db"

@cereri_utilizatori_bp.route("/api/cereri", methods=["GET"])
def get_cereri():
    username = request.args.get("username")

    if not username:
        return jsonify({"error": "Lipseste username-ul"}), 401

    try:
        with sqlite3.connect(DB_PATH) as conn:
            cur = conn.cursor()
            cur.execute("SELECT rol FROM utilizatori WHERE username = ?", (username,))
            row = cur.fetchone()

            if not row:
                return jsonify({"error": "Utilizator inexistent"}), 404

            rol = row[0]
            if rol != "admin":
                return jsonify({"error": "Acces interzis"}), 403

            # Este admin → returnăm toate cererile
            cereri = conn.execute("""
                SELECT id, username, email, tip, varsta FROM cereri_utilizatori
            """).fetchall()


            lista = [
                {"id": r[0], "username": r[1], "email": r[2], "tip": r[3], "varsta": r[4]}
                for r in cereri
            ]

            return jsonify(lista), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500




@cereri_utilizatori_bp.route("/api/cereri/accepta/<int:cerere_id>", methods=["POST"])
def accepta_cerere(cerere_id):
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cur = conn.cursor()
            cur.execute("SELECT id, username, email, parola, tip FROM cereri_utilizatori WHERE id = ?", (cerere_id,))
            row = cur.fetchone()

            if not row:
                return jsonify({"error": "Cerere inexistentă"}), 404

            id, username, email, parola, tip = row
            cur.execute("INSERT INTO utilizatori (id, username, parola, rol, email) VALUES (?, ?, ?, ?, ?)",
                        (id, username, parola, tip, email))
            cur.execute("DELETE FROM cereri_utilizatori WHERE id = ?", (cerere_id,))

            trimite_email_acceptare(email, username)

            conn.commit()
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@cereri_utilizatori_bp.route("/api/cereri/respingere/<int:cerere_id>", methods=["DELETE"])
def respinge_cerere(cerere_id):
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cur = conn.cursor()
            cur.execute("SELECT username, email FROM cereri_utilizatori WHERE id = ?", (cerere_id,))
            row = cur.fetchone()

            if row:
                username, email = row
                trimite_email_respingere(email, username)

            cur.execute("DELETE FROM cereri_utilizatori WHERE id = ?", (cerere_id,))

        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500