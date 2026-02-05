import React from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from "react-toastify";
import "../../static/css/LogoutButton.css";

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("rol");
        localStorage.removeItem("email");
        localStorage.removeItem("user_id"); // Asigură-te că ștergi și ID-ul

        toast.info("Te-ai deconectat."); // 'info' e mai puțin agresiv decât success

        setTimeout(() => {
            navigate("/autentificare", {replace: true});
        }, 500)
    };

    return (
        <button
            onClick={handleLogout}
            className="logout_button"
            title="Deconectare"
        >
            {/* Iconiță elegantă */}
            <i className="fas fa-power-off"></i>
            <span>Deconectare</span>
        </button>
    );
};

export default LogoutButton;