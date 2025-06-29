import os
from flask import request, jsonify, Blueprint, send_from_directory
import sqlite3
from datetime import datetime


upload_document_bp = Blueprint('upload_document', __name__)

UPLOAD_FOLDER = 'uploads'


# Asigură-te că folderul există
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Conectare DB
def get_db_connection():
    conn = sqlite3.connect('users.db')
    conn.row_factory = sqlite3.Row
    return conn

# Endpoint upload
@upload_document_bp.route('/upload_document', methods=['POST'])
def upload_documents():
    files = request.files.getlist('files')
    username = request.form.get('username')

    if not files or not username:
        return jsonify({'error': 'Missing files or username'}), 400

    conn = get_db_connection()
    for file in files:
        if file:
            filename = file.filename
            save_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(save_path)

            conn.execute('INSERT INTO documente (filename, uploaded_by, upload_date) VALUES (?, ?, ?)',
                         (filename, username, datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Documents uploaded successfully'}), 200




@upload_document_bp.route('/uploads/<path:filename>')
def download_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)




@upload_document_bp.route('/delete_document/<filename>', methods=['DELETE'])
def delete_document(filename):
    try:
        # Șterge fișierul de pe disc
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(file_path):
            os.remove(file_path)

        # Șterge înregistrarea din DB
        conn = get_db_connection()
        conn.execute('DELETE FROM documente WHERE filename = ?', (filename,))
        conn.commit()
        conn.close()

        return jsonify({'message': f'{filename} șters cu succes'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500





@upload_document_bp.route('/get_documents', methods=['GET'])
def get_documents():
    conn = get_db_connection()
    docs = conn.execute('SELECT * FROM documente ORDER BY upload_date DESC').fetchall()
    conn.close()
    return jsonify([dict(doc) for doc in docs])
