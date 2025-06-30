from flask import Flask
from flask_cors import CORS
from autentificare import autentificare_bp
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

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
