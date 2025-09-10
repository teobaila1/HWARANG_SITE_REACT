import React, {useEffect, useState} from "react";
import Navbar from "../../components/Navbar";
import {useNavigate} from "react-router-dom";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/AdminTotiCopiiiSiParintii.css";

const AdminTotiCopiiiSiParintii = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const rol = localStorage.getItem("rol");
        if (rol !== "admin") {
            navigate("/access-denied");
            return;
        }

        const fetchCopii = async () => {
            const res = await fetch("http://localhost:5000/api/toti_copiii");
            const result = await res.json();
            if (result.status === "success") {
                setData(result.date);
            }
        };

        fetchCopii();
    }, [navigate]);

    return (
        <>
            <Navbar/>
            <div className="admin-toti-copiii-container">
                <h2>Toți copiii înregistrați ai părinților</h2>

                {data.length === 0 ? (
                    <p style={{textAlign: "center"}}>Nu există date disponibile.</p>
                ) : (
                    <div className="copii-grid">
                        {data.map((entry, index) => (
                            <div key={index} className="copii-card">
                                <h4 className="card-header">
                                    👤 {entry.parinte.username}
                                    <span>{entry.parinte.email}</span>
                                </h4>
                                <ul className="card-copii-list">
                                    {entry.copii.map((copil, i) => (
                                        <li key={i}>
                                            <strong>{copil.nume}</strong> ({copil.gen ?? "N/A"}) – {copil.varsta} ani
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminTotiCopiiiSiParintii;
