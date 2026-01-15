import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../../static/css/AdminDashboard.css";
import { API_BASE } from "../../config";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [uploadStatus, setUploadStatus] = useState('');
    const username = localStorage.getItem('username');
    const [files, setFiles] = useState([]);
    const [uploadedDocs, setUploadedDocs] = useState([]);

    useEffect(() => {
        const rol = localStorage.getItem("rol");
        if (rol !== "admin") {
            navigate("/access-denied");
        }
    }, [navigate]);

    const handleUpload = async () => {
        if (files.length === 0) {
            setUploadStatus('Selectează cel puțin un fișier!');
            return;
        }

        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        // Adăugăm username ca fallback
        formData.append('username', username);

        // --- AICI ERA PROBLEMA: TREBUIE LUAT TOKEN-UL ---
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${API_BASE}/api/upload_document`, {
                method: 'POST',
                headers: {
                    // FĂRĂ Content-Type (browserul îl pune automat la FormData)
                    "Authorization": `Bearer ${token}` // <--- OBLIGATORIU
                },
                body: formData,
            });

            if (response.ok) {
                setUploadStatus('Fișierele au fost încărcate!');
                setFiles([]);
                setTimeout(() => setUploadStatus(''), 3000);
                // Opțional: Poți reîncărca lista dacă ai funcția aici,
                // dar lista e în pagina Documente.jsx
            } else {
                const errData = await response.json();
                setUploadStatus(errData.message || 'Eroare la upload!');
            }
        } catch (error) {
            console.error(error);
            setUploadStatus('Eroare la server!');
        }
    };

    // ... (Restul funcțiilor pentru listare/ștergere din Dashboard, dacă le ai aici)
    // Asigură-te că și la ele pui Authorization dacă le folosești.

    // Funcția de ștergere (dacă e folosită în acest fișier):
    const handleDelete = async (id, filename) => {
        if (!window.confirm(`Ștergi fișierul ${filename}?`)) return;
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${API_BASE}/api/delete_document/id/${id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (res.ok) {
                setUploadedDocs(prev => prev.filter(doc => doc.id !== id));
            } else {
                alert('Eroare la ștergere!');
            }
        } catch(e) { console.error(e); }
    };

    // Funcția de listare documente (pentru Dashboard)
    const fetchDocuments = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/get_documents`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUploadedDocs(data);
            }
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);


    return (
        <>
            <Navbar/>
            <div className="admin-dashboard-container">
                <div className="dashboard-header">
                    <h1>Panou Administrare</h1>
                    <p style={{color: '#888', marginTop: '5px'}}>Bine ai venit, {username}</p>
                </div>

                <div className="dashboard-grid">
                    {/* ... (CARDURILE UTILIZATORI / COMPETIȚII RĂMÂN LA FEL) ... */}
                    <div className="dashboard-card">
                        <div className="card-title"><i className="fas fa-users"></i> Gestiune Utilizatori</div>
                        <div className="action-list">
                            <Link to="/cereri-conturi" className="dashboard-btn">Conturi în așteptare</Link>
                            <Link to="/toti-utilizatorii" className="dashboard-btn">Vezi toți utilizatorii</Link>
                            <Link to="/antrenori-grupe" className="dashboard-btn">Grupe & Antrenori</Link>
                            <Link to="/toti-copiii" className="dashboard-btn">Vezi toți copiii</Link>
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-title"><i className="fas fa-trophy"></i> Competiții & Financiar</div>
                        <div className="action-list">
                            <Link to="/creeaza-concurs" className="dashboard-btn">Creează concurs nou</Link>
                            <Link to="/toti-inscrisi-concurs" className="dashboard-btn">Vezi toate înscrierile</Link>
                            <Link to="/admin-set-permisiuni" className="dashboard-btn">Permisiuni concurs</Link>
                            <Link to="/plati" className="dashboard-btn">Evidență Plăți</Link>
                        </div>
                    </div>

                    {/* CARD 3: DOCUMENTE (Aici e upload-ul) */}
                    <div className="dashboard-card">
                        <div className="card-title">
                            <i className="fas fa-folder-open"></i> Documente
                        </div>

                        <div className="upload-zone">
                            <label htmlFor="file-upload" className="custom-file-label">
                                <i className="fas fa-cloud-upload-alt"></i> Alege fișiere...
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                multiple
                                style={{display: 'none'}}
                                onChange={(e) => setFiles(Array.from(e.target.files))}
                            />

                            {files.length > 0 && (
                                <ul className="file-list-preview">
                                    {files.map((file, index) => (
                                        <li key={index}>{file.name}</li>
                                    ))}
                                </ul>
                            )}

                            <button className="upload-action-btn" onClick={handleUpload}>
                                Încarcă fișierele
                            </button>
                            {uploadStatus && (
                                <p style={{color: uploadStatus.includes('succes') ? '#4ade80' : '#ef4444', fontSize: '0.8rem', marginTop: '10px'}}>
                                    {uploadStatus}
                                </p>
                            )}
                        </div>

                        {/* Listare rapidă documente (opțional în dashboard) */}
                        <ul className="doc-list">
                            {uploadedDocs.map((doc) => (
                                <li key={doc.id} className="doc-item">
                                    <span className="doc-name">{doc.filename}</span>
                                    <button className="btn-delete-doc" onClick={() => handleDelete(doc.id, doc.filename)}>
                                        Șterge
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;