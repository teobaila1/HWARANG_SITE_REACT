import React, {useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import {useNavigate} from "react-router-dom";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/ParinteCopii.css";


const ParinteCopii = () => {
    const [copii, setCopii] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCopii = async () => {
            const res = await fetch("http://localhost:5000/api/copiii_mei", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username: localStorage.getItem("username")}),
            });

            const result = await res.json();
            if (result.status === "success") {
                setCopii(result.copii);
            }
        };

        fetchCopii();
    }, []);


    useEffect(() => {
        const rol = localStorage.getItem("rol");
        if (rol !== "Parinte" && rol !== "admin") {
            navigate("/access-denied");
        }
    }, []);


    return (
        <>
            <Navbar/>
            <div className="copii-parinte">
                <h2>Copiii tăi înregistrați</h2>
                {copii.length === 0 ? (
                    <p>Nu ai copii înregistrați.</p>
                ) : (
                    <ul>
                        {copii.map((copil, index) => (
                            <li key={index}>
                                <strong>{copil.nume}</strong>
                                <span> – {copil.varsta} ani – {copil.grupa}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};

export default ParinteCopii;
