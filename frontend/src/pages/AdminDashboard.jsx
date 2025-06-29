// src/pages/AdminDashboard.jsx
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/AdminDashboard.css";


const AdminDashboard = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const username = localStorage.getItem('username'); // presupunem că username e salvat după login
    const [files, setFiles] = useState([]);

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
            const response = await fetch('http://localhost:5000/upload_document', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setUploadStatus('Fișierele au fost încărcate cu succes!');
                setFiles([]);
            } else {
                setUploadStatus('Eroare la upload!');
            }
        } catch (error) {
            console.error(error);
            setUploadStatus('Eroare la server!');
        }
    };


    return (
        <>
            <Navbar/>
            <section style={{padding: "2rem", color: "white"}}>
                <h1>Panou Administrator</h1>
                <p>Bun venit în zona de administrare!</p>

            </section>
            <section style={{padding: "2rem", color: "white"}}>
                <div style={{marginTop: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap"}}>
                    <Link to="/cereri-conturi" className="btn-dashboard">Conturi în așteptare</Link>
                    <Link to="/toti-utilizatorii" className="btn-dashboard">Vezi toți utilizatorii</Link>
                </div>
            </section>
            <div>
                <h2>Încarcă un document</h2>
                <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles(Array.from(e.target.files))}
                    style={{marginBottom: '10px'}}
                />
                <br/>
                <button onClick={handleUpload}>Încarcă</button>
                {uploadStatus && <p style={{color: 'lime', marginTop: '10px'}}>{uploadStatus}</p>}
            </div>
        </>
    );
};

export default AdminDashboard;
