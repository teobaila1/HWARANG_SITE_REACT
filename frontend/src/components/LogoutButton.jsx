// src/components/LogoutButton.jsx
import React from 'react';
import {useNavigate} from 'react-router-dom';
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/LogoutButton.css";

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("rol");

        toast.success("Te-ai deconectat cu succes!", {
            position: "bottom-center",
            autoClose: 1500,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
        });
        setTimeout(() => {
            navigate("/autentificare", {replace: true});
        }, 1500)
    };

    return (
        <>
            <ToastContainer/>
            <button
                onClick={handleLogout}
                className="logout_button">
                Deconectare
            </button>
        </>
    );
};

export default LogoutButton;
