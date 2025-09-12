// src/pages/AdminDashboard.jsx
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Navbar from "../../components/Navbar";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/AdminDashboard.css";


const AdminDashboard = () => {
    const navigate = useNavigate();
    const [uploadStatus, setUploadStatus] = useState('');
    const username = localStorage.getItem('username'); // presupunem că username e salvat după login
    const [files, setFiles] = useState([]);
    const [uploadedDocs, setUploadedDocs] = useState([]);

    useEffect(() => {
        const rol = localStorage.getItem("rol");
        if (rol !== "admin") {
            navigate("/access-denied"); // sau direct la /home
        }
    }, [navigate]);


    const handleUpload = async () => {
        if (files.length === 0) {
            setUploadStatus('Selectează cel puțin un fișier!');
            return;
        }

        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        formData.append('username', username);

        try {
            const response = await fetch('http://localhost:5000/api/upload_document', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setUploadStatus('Fișierele au fost încărcate cu succes!');
                setFiles([]);
                await fetchDocuments(); // 🔁 actualizează lista în timp real
            } else {
                setUploadStatus('Eroare la upload!');
            }
        } catch (error) {
            console.error(error);
            setUploadStatus('Eroare la server!');
        }
    };


    const fetchDocuments = async () => {
        const res = await fetch('http://localhost:5000/api/get_documents');
        if (!res.ok) {
            const txt = await res.text();
            throw new Error(`get_documents ${res.status}: ${txt}`);
        }
        const data = await res.json();
        setUploadedDocs(data);
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleDelete = async (id, filename) => {
        if (!window.confirm(`Ștergi fișierul ${filename}?`)) return;
        const res = await fetch(`http://localhost:5000/api/delete_document/id/${id}`, {
            method: 'DELETE',
        });
        if (res.ok) {
            setUploadedDocs(prev => prev.filter(doc => doc.id !== id));
        } else {
            alert('Eroare la ștergere!');
        }
    };


    return (
        <>
            <Navbar/>
            <div className="admin-dashboard-grid">
                {/* Col Stânga */}
                <div className="admin-left">
                    <h2>Gestionare conturi</h2>
                    <div style={{display: "flex", gap: "1rem", flexWrap: "wrap"}}>
                        <Link to="/cereri-conturi" className="btn-dashboard">Conturi în așteptare</Link>
                        <Link to="/toti-utilizatorii" className="btn-dashboard">Vezi toți utilizatorii</Link>
                        <Link to="/admin-set-permisiuni" className="btn-dashboard">Setează permisiuni de concurs</Link>
                        <Link to="/antrenori-grupe" className="btn-dashboard">Vezi grupele antrenorilor cu copiii de la
                            grupa</Link>
                        <Link to="/toti-copiii" className="btn-dashboard">Vezi toți copiii cu parintii</Link>
                        <Link to="/toti-inscrisi-concurs" className="btn-dashboard">Vezi toate inscrierile la
                            concurs</Link>
                        <Link to="/creeaza-concurs" className="btn-dashboard">Creează concurs nou</Link>
                        <Link to="/plati" className="btn-dashboard">Platile</Link>
                    </div>
                </div>


                {/* Col Dreapta */}
                <div className="admin-right">
                    <div className="custom-file-upload">
                        <label htmlFor="file-upload">Caută...</label>
                        <input
                            id="file-upload"
                            type="file"
                            multiple
                            onChange={(e) => setFiles(Array.from(e.target.files))}
                        />
                    </div>

                    {files.length > 0 && (
                        <ul style={{color: 'white', marginTop: '10px'}}>
                            {files.map((file, index) => (
                                <li key={index}>{file.name}</li>
                            ))}
                        </ul>
                    )}

                    <br/>
                    <button className="btn-upload" onClick={handleUpload}>Încarcă fișierele</button>
                    {uploadStatus && <p style={{color: 'lime', marginTop: '10px'}}>{uploadStatus}</p>}

                    <h3 style={{marginTop: "2rem"}}></h3>
                    <ul>
                        {uploadedDocs.map((doc) => (
                            <li key={doc.id}>
                                <a
                                    href={`http://localhost:5000/api/uploads/id/${doc.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="document-link"
                                >
                                    {doc.filename}
                                </a>
                                <button onClick={() => handleDelete(doc.id, doc.filename)} style={{marginLeft: "1rem"}}>
                                    Șterge
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>


                <div className="admin-left">
                    <h2>Linkuri utile</h2>
                    <div style={{display: "flex", gap: "1rem", flexWrap: "wrap"}}>
                        <a
                            href="https://sites.google.com/hwarang.ro/cerinte-examen/pagina-de-pornire?authuser=0"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-dashboard"
                        >
                            Cerințe examen grad
                        </a>
                    </div>
                </div>

            </div>
        </>
    );
};

export default AdminDashboard;
