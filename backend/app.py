from flask import Flask
from flask_cors import CORS
from autentificare import autentificare_bp
from antrenori_externi import antrenori_externi_bp
from antrenor_dashboard_copii_parinti import antrenor_dashboard_copii_parinti_bp
from adauga_concurs import adauga_concurs_bp
from evidenta_plati import evidenta_plati_bp
from numar_inscrisi import numar_inscrisi_bp
from creare_get_concurs import creare_get_concurs_bp
from toti_copiii_parintilor import toti_copiii_parintilor_bp
from toate_grupele_antrenori import toate_grupele_antrenori_bp
from inscrieri_concursuri_toti import inscriere_concurs_toti_bp
from concurs_permis_antrenori_externi import concurs_permis_antrenori_externi_bp
from upload_document import upload_document_bp
from inscriere_concurs import inscriere_concurs_bp
from toti_userii import toti_userii_bp
from inregistrare import inregistrare_bp
from inscriere import inscriere_bp
from cereri_utilizatori import cereri_utilizatori_bp
from modifica_rol import modifica_rol_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(inscriere_bp)
app.register_blueprint(autentificare_bp)
app.register_blueprint(inregistrare_bp)
app.register_blueprint(cereri_utilizatori_bp)
app.register_blueprint(toti_userii_bp)
app.register_blueprint(modifica_rol_bp)
app.register_blueprint(inscriere_concurs_bp)
app.register_blueprint(upload_document_bp)
app.register_blueprint(antrenori_externi_bp)
app.register_blueprint(concurs_permis_antrenori_externi_bp)
app.register_blueprint(antrenor_dashboard_copii_parinti_bp)
app.register_blueprint(inscriere_concurs_toti_bp)
app.register_blueprint(toate_grupele_antrenori_bp)
app.register_blueprint(toti_copiii_parintilor_bp)
app.register_blueprint(adauga_concurs_bp)
app.register_blueprint(creare_get_concurs_bp)
app.register_blueprint(numar_inscrisi_bp)
app.register_blueprint(evidenta_plati_bp)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
