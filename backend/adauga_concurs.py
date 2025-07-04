from flask import request, jsonify, Blueprint
import sqlite3



adauga_concurs_bp = Blueprint('adauga_concurs', __name__)



@adauga_concurs_bp.route('/adauga_concurs', methods=['POST'])
def adauga_concurs():
    data = request.get_json()
    nume = data.get('nume')
    perioada = data.get('perioada')
    locatie = data.get('locatie')

    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO concursuri (nume, perioada, locatie) VALUES (?, ?, ?)", (nume, perioada, locatie))
    conn.commit()
    conn.close()

    return jsonify({"message": "Concurs adăugat"}), 200
