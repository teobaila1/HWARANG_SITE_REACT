# backend/users/cereri_utilizatori.py
from flask import Blueprint, request, jsonify
from ..config import get_conn, DB_PATH
from ..accounts.inregistrare import trimite_email_acceptare, trimite_email_respingere

cereri_utilizatori_bp = Blueprint("cereri_utilizatori", __name__)

@cereri_utilizatori_bp.get("/api/cereri")
def get_cereri():
    username = (request.args.get("username") or "").strip()
    if not username:
        return jsonify({"error": "Lipsește username-ul"}), 401

    try:
        con = get_conn()

        # verifică rolul de admin
        row = con.execute(
            "SELECT rol FROM utilizatori WHERE username = ? LIMIT 1",
            (username,)
        ).fetchone()
        if not row:
            return jsonify({"error": "Utilizator inexistent"}), 404
        if (row["rol"] or "").lower() != "admin":
            return jsonify({"error": "Acces interzis"}), 403

        cereri = con.execute("""
            SELECT id, username, email, tip, varsta
            FROM cereri_utilizatori
            ORDER BY id DESC
        """).fetchall()

        lista = [
            {
                "id": r["id"],
                "username": r["username"],
                "email": r["email"],
                "tip": r["tip"],
                "varsta": r["varsta"],
            }
            for r in cereri
        ]
        return jsonify(lista), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@cereri_utilizatori_bp.post("/api/cereri/accepta/<int:cerere_id>")
def accepta_cerere(cerere_id: int):
    try:
        con = get_conn()
        cur = con.cursor()

        row = cur.execute("""
            SELECT id, username, email, parola, tip, copii, grupe
            FROM cereri_utilizatori
            WHERE id = ?
        """, (cerere_id,)).fetchone()

        if not row:
            return jsonify({"error": "Cerere inexistentă"}), 404

        _, username, email, parola, tip, copii, grupe = (
            row["id"], row["username"], row["email"], row["parola"], row["tip"], row["copii"], row["grupe"]
        )

        # verifică duplicate în utilizatori
        exists = cur.execute(
            "SELECT 1 FROM utilizatori WHERE username = ? OR email = ? LIMIT 1",
            (username, email)
        ).fetchone()
        if exists:
            return jsonify({"error": "Există deja un utilizator cu acest username/email"}), 409

        # inserăm în utilizatori (lăsăm SQLite să aloce id-ul)
        cur.execute("""
            INSERT INTO utilizatori (username, parola, rol, email, grupe, copii)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (username, parola, tip, email, grupe, copii))

        # ștergem cererea
        cur.execute("DELETE FROM cereri_utilizatori WHERE id = ?", (cerere_id,))
        con.commit()

        # trimitem emailul DUPĂ commit
        try:
            trimite_email_acceptare(email, username)
        except Exception as e:
            # nu blocăm succesul pe e-mail
            print("[WARN] Email acceptare eșuat:", e)

        return jsonify({"status": "success"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@cereri_utilizatori_bp.delete("/api/cereri/respingere/<int:cerere_id>")
def respinge_cerere(cerere_id: int):
    try:
        con = get_conn()
        cur = con.cursor()

        row = cur.execute(
            "SELECT username, email FROM cereri_utilizatori WHERE id = ?",
            (cerere_id,)
        ).fetchone()

        if not row:
            return jsonify({"status": "success"}), 200  # deja nu există

        username, email = row["username"], row["email"]

        # ștergem cererea
        cur.execute("DELETE FROM cereri_utilizatori WHERE id = ?", (cerere_id,))
        con.commit()

        # e-mail (non-blocking)
        try:
            trimite_email_respingere(email, username)
        except Exception as e:
            print("[WARN] Email respingere eșuat:", e)

        return jsonify({"status": "success"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
