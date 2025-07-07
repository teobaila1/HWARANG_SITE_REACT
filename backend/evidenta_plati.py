from flask import Flask, request, jsonify, Blueprint, json
import sqlite3

evidenta_plati_bp = Blueprint("evidenta_plati", __name__)
DB_PATH = "users.db"



def get_connection():
    return sqlite3.connect(DB_PATH)


# 🔍 Mapare copil → parinte_id
def get_parinte_id_by_copil(copil_nume):
    copil_nume = copil_nume.strip().upper()
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, copii FROM utilizatori WHERE rol = 'Parinte'")
        for parinte_id, copii_json in cursor.fetchall():
            if not copii_json:
                continue
            try:
                copii = json.loads(copii_json)
                for copil in copii:
                    if copil.get("nume", "").strip().upper() == copil_nume:
                        return parinte_id
            except json.JSONDecodeError:
                continue
        return None
    finally:
        conn.close()


# Endpoint nou pentru plăți filtrate
@evidenta_plati_bp.route("/api/plati/filtrate", methods=["GET"])
def get_plati_filtrate():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Obține toate plățile existente
        cursor.execute("""
            SELECT plati.*, utilizatori.username AS parinte_nume
            FROM plati
            JOIN utilizatori ON utilizatori.id = plati.parinte_id
        """)
        plati_existente = cursor.fetchall()
        coloane = [col[0] for col in cursor.description]
        plati_existente = [dict(zip(coloane, row)) for row in plati_existente]

        # Obține toți copiii neasociați cu plăți
        cursor.execute("""
            SELECT username, copii FROM utilizatori 
            WHERE rol = 'Parinte' AND copii IS NOT NULL
        """)
        parinti = cursor.fetchall()

        copii_neplatiti = []
        for username, copii_json in parinti:
            try:
                copii = json.loads(copii_json)
                for copil in copii:
                    copil_nume = copil.get("nume", "").strip()
                    # Verifică dacă copilul are deja plăți
                    if not any(p['copil_nume'].strip().upper() == copil_nume.upper()
                               for p in plati_existente):
                        copii_neplatiti.append({
                            "copil_nume": copil_nume,
                            "parinte_nume": username,
                            "luna": None,
                            "suma": None,
                            "tip_plata": None,
                            "status": "neplatit"
                        })
            except json.JSONDecodeError:
                continue

        conn.close()
        return jsonify(plati_existente + copii_neplatiti)
    except Exception as e:
        return jsonify({"error": str(e)}), 500





# 📄 GET toate plățile
@evidenta_plati_bp.route("/api/plati", methods=["GET"])
def get_plati():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            SELECT plati.*, utilizatori.username AS parinte_nume
            FROM plati
            JOIN utilizatori ON utilizatori.id = plati.parinte_id
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        conn.close()
        print("[INFO] Am trimis toate plățile.")
        return jsonify([dict(zip(columns, row)) for row in rows])
    except Exception as e:
        print(f"[ERROR] La GET /api/plati: {e}")
        return jsonify({"error": str(e)}), 500

# ➕ POST - adaugă plată
@evidenta_plati_bp.route("/api/plati", methods=["POST"])
def add_plata():
    data = request.json
    copil_nume = data.get("copil_nume", "").strip().upper()
    luna = data.get("luna", "").strip().lower()
    suma = data.get("suma")
    tip_plata = data.get("tip_plata")
    status = data.get("status")

    parinte_id = get_parinte_id_by_copil(copil_nume)
    if not parinte_id:
        return jsonify({"error": "Parinte necunoscut pentru copilul dat"}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()

        # CAZUL IMPORTANT: verificăm dacă există deja o plată cu acest copil + lună
        cursor.execute("""
            SELECT id FROM plati
            WHERE UPPER(copil_nume) = ? AND LOWER(luna) = ?
        """, (copil_nume, luna))
        existing = cursor.fetchone()

        if existing:
            cursor.execute("""
                UPDATE plati
                SET suma = ?, tip_plata = ?, status = ?, parinte_id = ?
                WHERE id = ?
            """, (suma, tip_plata, status, parinte_id, existing[0]))
            print(f"[INFO] UPDATE în loc de INSERT pentru {copil_nume} / {luna}")
        else:
            cursor.execute("""
                INSERT INTO plati (parinte_id, copil_nume, luna, suma, tip_plata, status)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (parinte_id, copil_nume, luna, suma, tip_plata, status))
            print(f"[INFO] Plată nouă inserată: {copil_nume} / {luna}")

        conn.commit()
        conn.close()
        return jsonify({"message": "OK"}), 200
    except Exception as e:
        print(f"[ERROR] La POST /api/plati: {e}")
        return jsonify({"error": str(e)}), 500



# ✏️ PUT - editează plată
@evidenta_plati_bp.route("/api/plati/<int:id>", methods=["PUT"])
def update_plata(id):
    if id == -1:
        id = None  # tratăm ca "nu există, creează"
    data = request.json
    print(f"[INFO] Cerere actualizare plată ID {id}: {data}")
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # verificăm dacă există
        cursor.execute("SELECT id FROM plati WHERE id = ?", (id,))
        exista = cursor.fetchone()

        if exista:
            cursor.execute("""
                UPDATE plati
                SET copil_nume=?, luna=?, suma=?, tip_plata=?, status=?
                WHERE id=?
            """, (
                data.get("copil_nume"),
                data.get("luna"),
                data.get("suma"),
                data.get("tip_plata"),
                data.get("status"),
                id
            ))
            print(f"[INFO] Plată ID {id} actualizată.")
        else:
            # deducem parinte_id din copil
            parinte_id = get_parinte_id_by_copil(data.get("copil_nume"))
            cursor.execute("""
                INSERT INTO plati (parinte_id, copil_nume, luna, suma, tip_plata, status)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                parinte_id,
                data.get("copil_nume"),
                data.get("luna"),
                data.get("suma"),
                data.get("tip_plata"),
                data.get("status")
            ))
            print("[INFO] Plată nouă inserată (deși era editare).")

        conn.commit()
        conn.close()
        return jsonify({"message": "OK"}), 200
    except Exception as e:
        print(f"[ERROR] La PUT /api/plati/{id}: {e}")
        return jsonify({"error": str(e)}), 500

# ❌ DELETE - șterge plată
@evidenta_plati_bp.route("/api/plati/<int:id>", methods=["DELETE"])
def delete_plata(id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM plati WHERE id=?", (id,))
        conn.commit()
        conn.close()
        print(f"[INFO] Plată ID {id} ștearsă.")
        return jsonify({"message": "Plată ștearsă"}), 200
    except Exception as e:
        print(f"[ERROR] La DELETE /api/plati/{id}: {e}")
        return jsonify({"error": str(e)}), 500