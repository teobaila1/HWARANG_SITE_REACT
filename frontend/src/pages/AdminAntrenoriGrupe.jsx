import React, {useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import {useNavigate} from "react-router-dom";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/AntrenorDashboard.css";

const AdminAntrenoriGrupe = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const rol = localStorage.getItem("rol");
        if (rol !== "admin") {
            navigate("/access-denied");
            return;
        }

        fetch("http://localhost:5000/api/toate_grupele_antrenori")
            .then(res => res.json())
            .then(json => {
                if (json.status === "success") {
                    setData(json.data);
                }
            });
    }, []);

    return (
        <>
            <Navbar/>
            <div className="dashboard">
                <h2>Grupele tuturor antrenorilor</h2>
                {data.map((antrenorData, index) => (
                    <div key={index} style={{marginBottom: "2rem"}}>
                        <h3 style={{color: "#ff3333"}}>👨‍🏫 {antrenorData.antrenor}</h3>
                        {antrenorData.grupe.map((grupaData, idx) => (
                            <div key={idx} className="grupa-card">
                                <h4>{grupaData.grupa}</h4>
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
                ))}
            </div>
        </>
    );
};

export default AdminAntrenoriGrupe;
