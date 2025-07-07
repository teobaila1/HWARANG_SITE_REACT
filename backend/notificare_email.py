import sqlite3
import smtplib
from email.mime.text import MIMEText
from datetime import datetime

# Trimite doar în ziua 20
if datetime.now().day != 20:
    print("Nu este 20 ale lunii. Ieșire.")
    exit()

# Setări email
EMAIL_FROM = "baila.teodor@gmail.com"
EMAIL_PASS = "jaachoptmrgfvttm"  # Parolă aplicație dacă ai 2FA
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

# Conectare la baza de date
conn = sqlite3.connect("users.db")
cursor = conn.cursor()

# Selectăm toți părinții cu copii
cursor.execute("SELECT username, email, copii FROM utilizatori WHERE rol = 'Parinte'")
parinti = cursor.fetchall()

for username, email, copii_json in parinti:
    if not email:
        continue

    try:
        copii = eval(copii_json) if copii_json else []
        nume_copii = ', '.join(c['nume'] for c in copii)

        body = f"""
        Bună, {username},

        Te rugăm să achiți abonamentul lunar pentru copilul/copiii: {nume_copii}.

        Termenul limită este sfârșitul lunii curente.

        Mulțumim!
        Academia Hwarang
        """

        msg = MIMEText(body)
        msg["Subject"] = "📢 Notificare plată abonament"
        msg["From"] = EMAIL_FROM
        msg["To"] = email

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_FROM, EMAIL_PASS)
            server.send_message(msg)

        print(f"Email trimis către {email}")

    except Exception as e:
        print(f"Eroare la {email}: {e}")

conn.close()
