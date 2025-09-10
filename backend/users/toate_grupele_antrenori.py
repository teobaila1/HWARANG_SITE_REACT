# backend/users/toate_grupele_antrenori.py
import json
import re
from flask import Blueprint, jsonify
from ..config import get_conn, DB_PATH

toate_grupele_antrenori_bp = Blueprint('toate_grupele_antrenori', __name__)

def normalize_grupa(value):
    """Acceptă '7', 'Grupa7', 'Grupa 7' și întoarce 'Grupa 7'."""
    if value is None:
        return None
    s = str(value).strip()
    m = re.match(r'^\s*(?:grupa\s*)?(\d+)\s*$', s, re.IGNORECASE)
    if m:
        return f"Grupa {m.group(1)}"
    return s

@toate_grupele_antrenori_bp.get("/api/toate_grupele_antrenori")
def toate_grupele_antrenori():
    try:
        con = get_conn()

        # 1) Toți antrenorii cu grupele lor
        antrenori_rows = con.execute(
            "SELECT username, grupe FROM utilizatori WHERE LOWER(rol) = 'antrenor' AND grupe IS NOT NULL"
        ).fetchall()

        # 2) Toți părinții + copii (preîncărcați o singură dată)
        parinti_rows = con.execute(
            "SELECT username, email, copii FROM utilizatori WHERE LOWER(rol) = 'parinte' AND copii IS NOT NULL"
        ).fetchall()

        rezultat_final = []

        # Pre-parsăm copiii părinților
        parinti_parsati = []
        for r in parinti_rows:
            copii_list = []
            if r["copii"]:
                try:
                    copii_list = json.loads(r["copii"])
                except Exception:
                    copii_list = []
            parinti_parsati.append({
                "username": r["username"],
                "email": r["email"],
                "copii": copii_list
            })

        for a in antrenori_rows:
            antrenor = a["username"]
            grupe_raw = (a["grupe"] or "")
            grupe_norm = [normalize_grupa(g) for g in grupe_raw.split(",") if g.strip()]

            grupe_result = []
            for grupa in grupe_norm:
                copii_din_grupa_items = []
                for par in parinti_parsati:
                    # filtrează copiii părintelui care aparțin grupei curente
                    copii_din_grupa = []
                    for c in par["copii"]:
                        if normalize_grupa(c.get("grupa")) == grupa:
                            copii_din_grupa.append({
                                "nume": c.get("nume"),
                                "varsta": c.get("varsta"),
                                "gen": c.get("gen"),
                                "grupa": grupa
                            })
                    if copii_din_grupa:
                        copii_din_grupa_items.append({
                            "grupa": grupa,
                            "copii": copii_din_grupa,
                            "parinte": {
                                "username": par["username"],
                                "email": par["email"]
                            }
                        })

                if copii_din_grupa_items:
                    # pentru consistență cu structura veche: item pe grupă cu toți părinții care au copii în grupa asta
                    grupe_result.extend(copii_din_grupa_items)

            rezultat_final.append({
                "antrenor": antrenor,
                "grupe": grupe_result
            })

        return jsonify({"status": "success", "data": rezultat_final})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
