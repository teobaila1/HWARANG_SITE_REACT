import React, {useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import {useNavigate} from "react-router-dom";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/AntrenorDashboard.css";


const AntrenorDashboard = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const username = localStorage.getItem("username");
        const rol = localStorage.getItem("rol");
        if (!username && rol !== "Antrenor") {
            navigate("/access-denied");
        }
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("http://localhost:5000/api/antrenor_dashboard_data", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username: localStorage.getItem("username")})
            });

            const result = await res.json();
            if (result.status === "success") {
                setData(result.date);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <Navbar/>
            <div className="dashboard">
                <h2>Grupele tale și copiii acestora</h2>
                {data.map((grupaData, idx) => (
                    <div key={idx} className="grupa-card">
                        <h3>{grupaData.grupa}</h3>
                        <ul>
                            {grupaData.copii.map((copil, i) => (
                                <li key={i}>
                                    <strong>{copil.nume}</strong> (vârsta: {copil.varsta}) —
                                    Părinte: {grupaData.parinte.username} ({grupaData.parinte.email})
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    );
};

export default AntrenorDashboard;
