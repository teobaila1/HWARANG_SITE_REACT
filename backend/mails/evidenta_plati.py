# backend/mails/evidenta_plati.py
from flask import Blueprint, request, jsonify
from ..config import get_conn, DB_PATH
import json as _json

evidenta_plati_bp = Blueprint("evidenta_plati", __name__)

# --- helpers --------------------------------------------------------------

def ensure_tables():
    """Creează tabela plati dacă nu există."""
    con = get_conn()
    con.execute("""
        CREATE TABLE IF NOT EXISTS plati (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            parinte_id INTEGER NOT NULL,
            copil_nume TEXT NOT NULL,
            luna TEXT,
            suma REAL,
            tip_plata TEXT,
            status TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    con.commit()

def _safe_load_children(copii_json):
    if not copii_json:
        return []
    try:
        return _json.loads(copii_json)
    except Exception:
        return []

def get_parinte_id_by_copil(copil_nume: str):
    """Mapează numele copilului (case-insensitive) -> parinte_id."""
    if not copil_nume:
        return None
    target = copil_nume.strip().upper()

    con = get_conn()
    rows = con.execute("SELECT id, copii FROM utilizatori WHERE LOWER(rol) = 'parinte'").fetchall()
    for r in rows:
        for copil in _safe_load_children(r["copii"]):
            if (copil.get("nume") or "").strip().upper() == target:
                return r["id"]
    return None

# --- routes ---------------------------------------------------------------

@evidenta_plati_bp.get("/api/plati/filtrate")
def get_plati_filtrate():
    """
    Combina:
      - toate plățile existente (join cu numele părintelui),
      - cu „copiii fără plăți” (marcati 'status': 'neplatit').
    """
    try:
        ensure_tables()
        con = get_conn()

        # Plăți existente
        rows = con.execute("""
            SELECT p.*, u.username AS parinte_nume
            FROM plati p
            JOIN utilizatori u ON u.id = p.parinte_id
            ORDER BY p.id DESC
        """).fetchall()
        cols = [d[0] for d in rows.cursor_description] if hasattr(rows, "cursor_description") else []
        plati_existente = [dict(r) for r in rows]

        # Parinți + copii lor
        parinti = con.execute("""
            SELECT username, copii
            FROM utilizatori
            WHERE LOWER(rol) = 'parinte' AND copii IS NOT NULL
        """).fetchall()

        copii_neplatiti = []
        for p in parinti:
            username = p["username"]
            for copil in _safe_load_children(p["copii"]):
                copil_nume = (copil.get("nume") or "").strip()
                if not copil_nume:
                    continue
                # dacă NU există nicio plată pentru copil (ignorăm luna aici, ca în codul tău original)
                if not any((pe.get("copil_nume") or "").strip().upper() == copil_nume.upper() for pe in plati_existente):
                    copii_neplatiti.append({
                        "copil_nume": copil_nume,
                        "parinte_nume": username,
                        "luna": None,
                        "suma": None,
                        "tip_plata": None,
                        "status": "neplatit"
                    })

        return jsonify(plati_existente + copii_neplatiti)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@evidenta_plati_bp.get("/api/plati")
def get_plati():
    try:
        ensure_tables()
        con = get_conn()
        rows = con.execute("""
            SELECT p.*, u.username AS parinte_nume
            FROM plati p
            JOIN utilizatori u ON u.id = p.parinte_id
            ORDER BY p.id DESC
        """).fetchall()
        print("[INFO] Am trimis toate plățile.")
        return jsonify([dict(r) for r in rows])
    except Exception as e:
        print(f"[ERROR] La GET /api/plati: {e}")
        return jsonify({"error": str(e)}), 500


@evidenta_plati_bp.post("/api/plati")
def add_plata():
    data = request.get_json(silent=True) or {}
    copil_nume = (data.get("copil_nume") or "").strip()
    luna = (data.get("luna") or "").strip().lower()
    suma = data.get("suma")
    tip_plata = data.get("tip_plata")
    status = data.get("status")

    if not copil_nume:
        return jsonify({"error": "Lipsește copil_nume"}), 400

    parinte_id = get_parinte_id_by_copil(copil_nume)
    if not parinte_id:
        return jsonify({"error": "Parinte necunoscut pentru copilul dat"}), 400

    try:
        ensure_tables()
        con = get_conn()

        # Dacă există deja o plată pentru același copil + lună -> UPDATE
        existing = con.execute("""
            SELECT id FROM plati
            WHERE UPPER(copil_nume) = UPPER(?) AND LOWER(luna) = LOWER(?)
            LIMIT 1
        """, (copil_nume, luna)).fetchone()

        if existing:
            con.execute("""
                UPDATE plati
                   SET suma = ?, tip_plata = ?, status = ?, parinte_id = ?
                 WHERE id = ?
            """, (suma, tip_plata, status, parinte_id, existing["id"]))
            print(f"[INFO] UPDATE în loc de INSERT pentru {copil_nume} / {luna}")
        else:
            con.execute("""
                INSERT INTO plati (parinte_id, copil_nume, luna, suma, tip_plata, status)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (parinte_id, copil_nume, luna, suma, tip_plata, status))
            print(f"[INFO] Plată nouă inserată: {copil_nume} / {luna}")

        con.commit()
        return jsonify({"message": "OK"}), 200

    except Exception as e:
        print(f"[ERROR] La POST /api/plati: {e}")
        return jsonify({"error": str(e)}), 500


@evidenta_plati_bp.put("/api/plati/<int:id>")
def update_plata(id):
    # dacă vine -1 din UI, tratăm ca create
    data = request.get_json(silent=True) or {}
    print(f"[INFO] Cerere actualizare plată ID {id}: {data}")

    try:
        ensure_tables()
        con = get_conn()

        exista = con.execute("SELECT id FROM plati WHERE id = ?", (id,)).fetchone()

        if exista:
            con.execute("""
                UPDATE plati
                   SET copil_nume = ?, luna = ?, suma = ?, tip_plata = ?, status = ?
                 WHERE id = ?
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
            parinte_id = get_parinte_id_by_copil(data.get("copil_nume"))
            if not parinte_id:
                return jsonify({"error": "Parinte necunoscut pentru copilul dat"}), 400
            con.execute("""
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

        con.commit()
        return jsonify({"message": "OK"}), 200

    except Exception as e:
        print(f"[ERROR] La PUT /api/plati/{id}: {e}")
        return jsonify({"error": str(e)}), 500


@evidenta_plati_bp.delete("/api/plati/<int:id>")
def delete_plata(id):
    try:
        ensure_tables()
        con = get_conn()
        con.execute("DELETE FROM plati WHERE id = ?", (id,))
        con.commit()
        print(f"[INFO] Plată ID {id} ștearsă.")
        return jsonify({"message": "Plată ștearsă"}), 200
    except Exception as e:
        print(f"[ERROR] La DELETE /api/plati/{id}: {e}")
        return jsonify({"error": str(e)}), 500
