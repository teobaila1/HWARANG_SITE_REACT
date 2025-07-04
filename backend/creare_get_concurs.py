import sqlite3

from flask import Blueprint, jsonify

creare_get_concurs_bp = Blueprint('creare_get_concurs', __name__)


@creare_get_concurs_bp.route('/api/concursuri', methods=['GET'])
def get_concursuri():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute("SELECT nume, perioada, locatie FROM concursuri")
    rows = cursor.fetchall()
    conn.close()

    def extract_data_start(perioada):
        try:
            day, month = perioada.split("–")[0].strip().split(".")
            return f"2025-{month.zfill(2)}-{day.zfill(2)}"
        except:
            return "2025-12-31"  # fallback

    data = [
        {
            "nume": row[0],
            "perioada": row[1],
            "locatie": row[2],
            "dataStart": extract_data_start(row[1])
        }
        for row in rows
    ]
    return jsonify(data)
