// src/components/LogoutButton.jsx
import React from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from "react-toastify";
import "../../static/css/LogoutButton.css";

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Ștergem TOATE datele de sesiune, cel mai important fiind token-ul
        localStorage.removeItem("token");     // <--- CRITIC: Fără asta nu ești deconectat real
        localStorage.removeItem("username");
        localStorage.removeItem("rol");
        localStorage.removeItem("email");

        toast.success("Te-ai deconectat cu succes!");

        // Redirect rapid către login
        setTimeout(() => {
            navigate("/autentificare", {replace: true});
        }, 750)
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