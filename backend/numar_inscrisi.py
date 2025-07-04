from flask import Blueprint, jsonify

numar_inscrisi_bp = Blueprint('numar_inscrisi', __name__)


@numar_inscrisi_bp.route('/api/numar_inscrisi/<nume_concurs>', methods=['GET'])
def numar_inscrisi(nume_concurs):
    import sqlite3
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM inscrieri_concursuri WHERE concurs = ?", (nume_concurs,))
    count = cursor.fetchone()[0]
    conn.close()
    return jsonify({"nr": count})



@numar_inscrisi_bp.route('/api/inscrisi_concurs/<nume_concurs>', methods=['GET'])
def inscrisi_concurs(nume_concurs):
    import sqlite3
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute("""
        SELECT nume, data_nasterii, categorie_varsta, grad_centura, greutate, probe, gen
        FROM inscrieri_concursuri
        WHERE concurs = ?
    """, (nume_concurs,))
    rows = cursor.fetchall()
    conn.close()

    rezultat = [
        {
            "nume": row[0],
            "data_nasterii": row[1],
            "categorie_varsta": row[2],
            "grad_centura": row[3],
            "greutate": row[4],
            "probe": row[5],
            "gen": row[6]
        } for row in rows
    ]
    return jsonify(rezultat)


