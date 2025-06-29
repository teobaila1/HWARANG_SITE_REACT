import smtplib
from email.mime.text import MIMEText

from flask import Blueprint, request, jsonify
import sqlite3

inscriere_bp = Blueprint("inscriere", __name__)
DB_PATH = "users.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@inscriere_bp.route("/api/inscriere", methods=["POST"])
def inscriere():
    data = request.get_json()
    nume = data.get("name")
    prenume = data.get("prename")
    email = data.get("email")
    telefon = data.get("phone")
    mesaj = data.get("message")

    if not nume or not email or not telefon:
        return jsonify({"status": "error", "message": "Câmpuri obligatorii lipsă"}), 400

    conn = get_db()
    conn.execute(
        "INSERT INTO inscrieri (nume, prenume, email, telefon, mesaj) VALUES (?, ?, ?, ?, ?)",
        (nume, prenume, email, telefon, mesaj)
    )
    conn.commit()
    conn.close()

    return jsonify({"status": "success"})



def trimite_email_confirmare(destinatar, nume):
    mesaj = MIMEText(f"Bună, {nume}!\n\nÎți mulțumim pentru înscrierea la ACS Hwarang Academy.\nTe vom contacta în cel mai scurt timp!")
    mesaj["Subject"] = "Confirmare înscriere - ACS Hwarang Academy Sibiu"
    mesaj["From"] = "baila.teodor@gmail.com"
    mesaj["To"] = destinatar

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login("baila.teodor@gmail.com", "jaachoptmrgfvttm")  # înlocuiește cu parola reală sau folosește App Password
            server.send_message(mesaj)
    except Exception as e:
        print("Eroare la trimiterea emailului:", e)