import json
import smtplib
from email.mime.text import MIMEText

from flask import Flask, request, jsonify, Blueprint
import sqlite3

inregistrare_bp = Blueprint("inregistrare", __name__)
DB_PATH = "users.db"


@inregistrare_bp.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    parola = data.get("password")
    tip = data.get("tip")
    varsta = data.get("varsta")
    # grupe = data.get("grupe", None)
    copii = data.get("copii", [])  # nou
    copii_json = json.dumps(copii) if copii else None


    # dacă e părinte → extragem grupele din copii
    if tip == "Parinte":
        grupe_set = set()
        for copil in copii:
            grupa = copil.get("grupa")
            if grupa:
                grupe_set.add(grupa.strip())
        grupe = ", ".join(sorted(grupe_set)) if grupe_set else None
    else:
        # dacă e antrenor, luăm grupe direct din formular
        grupe = data.get("grupe", None)

    if tip == "Parinte" or tip == "Sportiv":
        if not all([username, email, parola, tip, varsta]):
            return jsonify({"status": "error", "message": "Toate câmpurile sunt obligatorii"}), 400
    elif tip == "Antrenor":
        if not all([username, email, parola, tip, grupe]):
            return jsonify({"status": "error", "message": "Toate câmpurile sunt obligatorii (antrenor)"}), 400
    elif tip == "AntrenorExtern":
        if not all([username, email, parola, tip]):
            return jsonify({"status": "error", "message": "Toate câmpurile sunt obligatorii (antrenor extern)"}), 400
    else:
        return jsonify({"status": "error", "message": "Tip de utilizator necunoscut"}), 400

    try:
        with sqlite3.connect(DB_PATH) as conn:
            cur = conn.cursor()

            # Verificare email deja existent
            cur.execute("SELECT COUNT(*) FROM cereri_utilizatori WHERE email = ?", (email,))
            if cur.fetchone()[0] > 0:
                return jsonify({"status": "error", "message": "Email deja folosit"}), 409

            cur.execute("SELECT COUNT(*) FROM utilizatori WHERE email = ?", (email,))
            if cur.fetchone()[0] > 0:
                return jsonify({"status": "error", "message": "Email deja folosit"}), 409

            # Verificare username deja existent
            cur.execute("SELECT COUNT(*) FROM cereri_utilizatori WHERE username = ?", (username,))
            if cur.fetchone()[0] > 0:
                return jsonify({"status": "error", "message": "Username deja folosit"}), 409

            cur.execute("SELECT COUNT(*) FROM utilizatori WHERE username = ?", (username,))
            if cur.fetchone()[0] > 0:
                return jsonify({"status": "error", "message": "Username deja folosit"}), 409

            cur.execute("""
                INSERT INTO cereri_utilizatori (username, email, parola, tip, varsta, copii, grupe)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (username, email, parola, tip, varsta, copii_json, grupe))

            conn.commit()

        # trimitem email DOAR după commit
        trimite_email_confirmare(email, username)

        return jsonify({"status": "success"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500




def trimite_email_confirmare(destinatar, username):
    mesaj = MIMEText(
        f"Bună, {username}!\n\nCererea ta de creare cont la ACS Hwarang Academy a fost înregistrată cu succes. Te vom contacta după aprobare.")
    mesaj["Subject"] = "Confirmare creare cont - ACS Hwarang Academy Sibiu"
    mesaj["From"] = "baila.teodor@gmail.com"
    mesaj["To"] = destinatar

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login("baila.teodor@gmail.com", "jaachoptmrgfvttm")  # Înlocuiește cu parola sau App Password
            server.send_message(mesaj)
    except Exception as e:
        print("Eroare email:", e)




def trimite_email_acceptare(destinatar, username):
    mesaj = MIMEText(
        f"Bună, {username}!\n\nCererea ta de creare cont a fost ACCEPTATĂ. Te poți autentifica pe site-ul ACS Hwarang Academy."
    )
    mesaj["Subject"] = "Cerere acceptată - ACS Hwarang Academy"
    mesaj["From"] = "baila.teodor@gmail.com"
    mesaj["To"] = destinatar

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login("baila.teodor@gmail.com", "jaachoptmrgfvttm")
            server.send_message(mesaj)
    except Exception as e:
        print("Eroare trimitere email acceptare:", e)




def trimite_email_respingere(destinatar, username):
    mesaj = MIMEText(
        f"Bună, {username}!\n\nCererea ta de creare cont a fost RESPINSĂ. Dacă ai întrebări, te rugăm să ne contactezi."
    )
    mesaj["Subject"] = "Cerere respinsă - ACS Hwarang Academy"
    mesaj["From"] = "baila.teodor@gmail.com"
    mesaj["To"] = destinatar

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login("baila.teodor@gmail.com", "jaachoptmrgfvttm")
            server.send_message(mesaj)
    except Exception as e:
        print("Eroare trimitere email respingere:", e)






