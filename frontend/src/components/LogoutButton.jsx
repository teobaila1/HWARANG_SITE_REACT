// src/components/LogoutButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import "../../static/css/LogoutButton.css";
import { useAuth } from "../auth/AuthProvider";   // ← folosim logout din context

const LogoutButton = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    // golește context + localStorage gestionat de AuthProvider
    logout();

    // dacă mai ai chei vechi, le poți curăța aici (retro-compat):
    localStorage.removeItem("username");
    localStorage.removeItem("rol");
    localStorage.removeItem("email");

    toast.success("Te-ai deconectat cu succes!");
    setTimeout(() => {
      navigate("/autentificare", { replace: true });
    }, 500);
  };

  return (
    <button onClick={handleLogout} className="logout_button">
      Deconectare
    </button>
  );
};

export default LogoutButton;
