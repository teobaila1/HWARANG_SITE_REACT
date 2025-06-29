from flask import Blueprint, request, jsonify
import sqlite3

autentificare_bp = Blueprint("autentificare", __name__)
DB_PATH = "users.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@autentificare_bp.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    conn = get_db()
    user = conn.execute("SELECT * FROM utilizatori WHERE username = ? AND parola = ?", (username, password)).fetchone()
    conn.close()

    if user:
        return jsonify({
            "status": "success",
            "user": username,
            "rol": user["rol"]
        })
    return jsonify({"status": "error", "message": "Utilizator sau parolă incorecte"}), 401
