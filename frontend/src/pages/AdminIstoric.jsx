import React, { useEffect, useState } from "react";
// Ajustează calea către fișierul CSS în funcție de structura ta
import "../../static/css/AdminIstoric.css";
import Navbar from "../components/Navbar";

const API_BASE_URL = "https://backend-hwarang-new.onrender.com";

const AdminIstoric = () => {
    const [istoric, setIstoric] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIstoric = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`${API_BASE_URL}/api/status/istoric?t=${new Date().getTime()}`, {
                    headers: { 'x-access-token': token }
                });
                
                if (!response.ok) throw new Error("Eroare la preluarea istoricului");
                
                const data = await response.json();
                setIstoric(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchIstoric();
        // Polling la fiecare 10 secunde ca să vezi datele live
        const interval = setInterval(fetchIstoric, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="istoric-loading">Se încarcă istoricul...</div>;
    if (error) return <div className="istoric-error">Eroare: {error}</div>;

    return (
        <>
        <Navbar/>
        <div className="admin-istoric-container">
            <h2 className="admin-istoric-title">Istoric Navigare Utilizatori</h2>
            
            <div className="admin-istoric-table-wrapper">
                <table className="admin-istoric-table">
                    <thead>
                        <tr>
                            <th>Dată / Oră (RO)</th>
                            <th>Utilizator</th>
                            <th>Pagina Accesată</th>
                            <th>Session ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {istoric.map((item, index) => {
                            const isAnonim = item.nume === "Vizitator Anonim";
                            const userClass = isAnonim ? "anonim" : "logat";

                            return (
                                <tr key={index}>
                                    <td className="istoric-date" data-label="Dată / Oră: ">{item.data}</td>
                                    <td className={`istoric-user ${userClass}`} data-label="Utilizator: ">
                                        {item.nume}
                                    </td>
                                    <td className="istoric-page" data-label="Pagina: ">{item.pagina}</td>
                                    <td className="istoric-session" data-label="Session ID: ">
                                        {item.session_id.substring(0, 16)}...
                                    </td>
                                </tr>
                            );
                        })}
                        {istoric.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ padding: "20px", textAlign: "center" }}>
                                    Niciun istoric recent găsit.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
};

export default AdminIstoric;