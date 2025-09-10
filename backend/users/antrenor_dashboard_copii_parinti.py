# backend/users/antrenor_dashboard_copii_parinti.py
import re
import uuid
import json
from flask import request, jsonify, Blueprint
from ..config import get_conn, DB_PATH  # ✅ sursă unică pentru DB

antrenor_dashboard_copii_parinti_bp = Blueprint("antrenor_dashboard_copii_parinti", __name__)

# ---------- helpers ----------
def normalize_grupa(value):
    """Acceptă '7', 'Grupa7', 'Grupa 7' și întoarce 'Grupa 7'."""
    if value is None:
        return None
    s = str(value).strip()
    m = re.match(r'^\s*(?:grupa\s*)?(\d+)\s*$', s, re.IGNORECASE)
    if m:
        return f"Grupa {m.group(1)}"
    return s  # deja text; îl lăsăm cum e

def ensure_child_ids_and_normalize(children):
    """Adaugă id lipsă, transformă varsta în int, normalizează grupa."""
    changed = False
    for c in children:
        if "id" not in c or not c["id"]:
            c["id"] = uuid.uuid4().hex
            changed = True
        # varsta -> int dacă e string numeric
        if "varsta" in c and isinstance(c["varsta"], str) and c["varsta"].isdigit():
            c["varsta"] = int(c["varsta"])
            changed = True
        # grupa -> 'Grupa X' unde e cazul
        if "grupa" in c:
            ng = normalize_grupa(c["grupa"])
            if ng != c["grupa"]:
                c["grupa"] = ng
                changed = True
    return changed, children
# -----------------------------


@antrenor_dashboard_copii_parinti_bp.route("/api/antrenor_dashboard_data", methods=["POST"])
def antrenor_dashboard_data():
    data = request.get_json(silent=True) or {}
    username = data.get("username")
    if not username:
        return jsonify({"status": "error", "message": "Lipsă username"}), 400

    try:
        con = get_conn()
        cur = con.cursor()

        # 1) antrenorul + grupele lui
        cur.execute("SELECT grupe FROM utilizatori WHERE username = ?", (username,))
        row = cur.fetchone()
        if not row:
            return jsonify({"status": "error", "message": "Utilizator inexistent"}), 404

        grupe_raw = row["grupe"] or ""
        grupe = [normalize_grupa(g) for g in grupe_raw.split(",") if g.strip()]
        if not grupe:
            return jsonify({"status": "success", "date": []})

        # 2) părinții cu copii (rol 'Parinte' case-insensitive)
        parents = cur.execute(
            "SELECT id, username, email, copii FROM utilizatori "
            "WHERE LOWER(rol) = 'parinte' AND copii IS NOT NULL"
        ).fetchall()

        rezultate = []

        # 3) pentru fiecare grupă a antrenorului, căutăm copiii părinților care aparțin acelei grupe
        for grupa in grupe:
            for p in parents:
                copii_list = []
                if p["copii"]:
                    try:
                        copii_list = json.loads(p["copii"])
                    except Exception:
                        copii_list = []

                # ne asigurăm că fiecare copil are id și câmpurile sunt normalizate
                changed, copii_list = ensure_child_ids_and_normalize(copii_list)
                if changed:
                    cur.execute(
                        "UPDATE utilizatori SET copii = ? WHERE id = ?",
                        (json.dumps(copii_list, ensure_ascii=False), p["id"])
                    )
                    con.commit()

                # filtrăm copiii din grupa curentă
                copii_din_grupa = []
                for c in copii_list:
                    if normalize_grupa(c.get("grupa")) == grupa:
                        copii_din_grupa.append({
                            "id": c.get("id"),
                            "nume": c.get("nume"),
                            "varsta": c.get("varsta"),
                            "gen": c.get("gen"),
                            "grupa": grupa,
                        })

                if copii_din_grupa:
                    rezultate.append({
                        "grupa": grupa,
                        "copii": copii_din_grupa,
                        "parinte": {
                            "id": p["id"],                 # ✅ util în frontend
                            "username": p["username"],
                            "email": p["email"]
                        }
                    })

        return jsonify({"status": "success", "date": rezultate})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@antrenor_dashboard_copii_parinti_bp.route("/api/copiii_mei", methods=["POST"])
def copiii_mei():
    data = request.get_json(silent=True) or {}
    username = data.get("username")
    if not username:
        return jsonify({"status": "error", "message": "Lipsă username"}), 400

    try:
        con = get_conn()
        cur = con.cursor()
        cur.execute(
            "SELECT copii FROM utilizatori WHERE username = ? AND LOWER(rol) = 'parinte'",
            (username,)
        )
        row = cur.fetchone()
        if not row:
            return jsonify({"status": "error", "message": "Părinte inexistent sau fără copii"}), 404

        copii = []
        if row["copii"]:
            try:
                copii = json.loads(row["copii"])
            except Exception:
                copii = []

        # ca să fim consecvenți, normalizăm și aici și adăugăm id-uri dacă lipsesc
        changed, copii = ensure_child_ids_and_normalize(copii)
        if changed:
            cur.execute(
                "UPDATE utilizatori SET copii = ? WHERE username = ?",
                (json.dumps(copii, ensure_ascii=False), username)
            )
            con.commit()

        return jsonify({"status": "success", "copii": copii})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
