import React, { useState, useEffect } from 'react';
import Navbar from "../../components/Navbar"; // Modifică calea dacă Navbar-ul tău e în altă parte
import "../../../static/css/AdminOnline.css"; // NOU: Fișierul CSS dedicat pe care tocmai l-am creat!

const API_BASE_URL = "https://backend-hwarang-new.onrender.com";

const AdminOnline = () => {
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOnline = () => {
            const token = localStorage.getItem("token");
            fetch(`${API_BASE_URL}/api/status/online`, {
                headers: { 'x-access-token': token }
            })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setOnlineUsers(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Eroare preluare utilizatori online:", err);
                setLoading(false);
            });
        };

        // Apelăm prima dată imediat
        fetchOnline();
        
        // Setăm să se actualizeze singură lista la fiecare 15 secunde
        const interval = setInterval(fetchOnline, 15000); 
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="vezi-ev-wrapper">
            <Navbar />
            
            {/* Header-ul cu gradient albastru-roșu */}
            <div className="vezi-ev-header-section">
                <div className="vezi-ev-header-content">
                    <h1>Monitorizare: <br/><span>Activitate Live pe Site</span></h1>
                </div>
            </div>

            <div className="vezi-ev-main-container">
                {/* Cardul de statistici */}
                <div className="vezi-ev-stats-card">
                    <div className="stats-info">
                        <p className="stats-label">Utilizatori Activi (Ultimul Minut)</p>
                        <h2 className="stats-value">{onlineUsers.length} <span>persoane conectate</span></h2>
                    </div>
                </div>

                {/* Tabelul de monitorizare */}
                <div className="vezi-ev-table-card">
                    <div className="vezi-ev-table-responsive">
                        <table className="vezi-ev-table">
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Nume Utilizator / Vizitator</th>
                                    <th>Pagina Vizualizată Acum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="3" className="table-status">Se scanează traficul...</td></tr>
                                ) : onlineUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="table-status">
                                            Niciun utilizator activ în acest moment.
                                        </td>
                                    </tr>
                                ) : (
                                    onlineUsers.map((user, index) => (
                                        <tr key={index}>
                                            <td className="col-index">
                                                <span style={{color: '#28a745', fontSize: '1.2rem', marginRight: '5px'}}>●</span> 
                                                <span style={{fontWeight: '600', color: '#28a745'}}>Online</span>
                                            </td>
                                            <td className="col-name">{user.nume}</td>
                                            <td className="col-source" style={{textTransform: 'none', fontWeight: 'bold'}}>
                                                {user.pagina === '/' ? '/acasa' : user.pagina}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOnline;