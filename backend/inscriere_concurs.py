from flask import request, jsonify, Blueprint
import sqlite3

inscriere_concurs_bp = Blueprint('inscriere_concurs', __name__)

@inscriere_concurs_bp.route('/api/inscriere_concurs', methods=['POST'])
def inscriere_concurs():
    data = request.get_json()
    username = data.get('username')
    concurs = data.get('concurs')

    if not username or not concurs:
        return jsonify({"mesaj": "Date lipsă!"}), 400

    # Se extrag și celelalte câmpuri din formular
    nume = data.get("nume")
    data_nasterii = data.get("dataNasterii")
    categorie_varsta = data.get("categorieVarsta")
    grad_centura = data.get("gradCentura")
    greutate = data.get("greutate")
    probe = data.get("probe")

    # Emailul se obține din tabelul utilizatori
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    cursor.execute("SELECT email FROM utilizatori WHERE username = ?", (username,))
    row = cursor.fetchone()
    email = row[0] if row else None

    # Creează tabela cu toate câmpurile dacă nu există
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS inscrieri_concursuri (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT,
            username TEXT,
            concurs TEXT,
            nume TEXT,
            data_nasterii TEXT,
            categorie_varsta TEXT,
            grad_centura TEXT,
            greutate TEXT,
            probe TEXT
        )
    """)

    # Inserează cererea
    cursor.execute("""
        INSERT INTO inscrieri_concursuri (
            email, username, concurs, nume, data_nasterii,
            categorie_varsta, grad_centura, greutate, probe
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        email, username, concurs, nume, data_nasterii,
        categorie_varsta, grad_centura, greutate, probe
    ))

    conn.commit()
    conn.close()

    return jsonify({"mesaj": f"Cererea pentru „{concurs}” a fost trimisă!"})
