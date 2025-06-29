// src/components/LogoutButton.jsx
import React from 'react';
import {useNavigate} from 'react-router-dom';
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/LogoutButton.css";

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("rol");

        alert("Te-ai deconectat cu succes!");
        navigate("/autentificare"); // sau "/acasa" dacă nu ai nevoie de login
    };

    return (
        <button
            onClick={handleLogout}
            className="logout_button">
            Deconectare
        </button>
    );
};

export default LogoutButton;
