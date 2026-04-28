import React from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";

const AccessDenied = () => {
  return (
    <>
      <Navbar />
      <div style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#09090b", // Dark background
        color: "#fff",
        padding: "20px",
        textAlign: "center"
      }}>

        {/* Iconiță mare cu lacăt sau semn interzis */}
        <div style={{ fontSize: "4rem", marginBottom: "20px", color: "#dc2626" }}>
          <i className="fas fa-ban"></i>
        </div>

        <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "800",
            marginBottom: "10px",
            textTransform: "uppercase"
        }}>
          Acces Interzis
        </h1>

        <p style={{
            color: "#a1a1aa",
            fontSize: "1.1rem",
            maxWidth: "500px",
            lineHeight: "1.6",
            marginBottom: "30px"
        }}>
          Nu ai permisiunea necesară pentru a accesa această pagină.
          Această secțiune este rezervată administratorilor sau antrenorilor.
        </p>

        <Link to="/acasa">
          <button style={{
            padding: "12px 30px",
            backgroundColor: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            textTransform: "uppercase"
          }}>
            Înapoi la Acasă
          </button>
        </Link>
      </div>
    </>
  );
};

export default AccessDenied;