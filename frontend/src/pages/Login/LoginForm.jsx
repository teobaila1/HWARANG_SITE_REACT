import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import "../../../static/css/Login.css";
import { api } from "../../api/client";               // ← folosim axios client centralizat
import { useAuth } from "../../auth/AuthProvider";     // ← luăm setFromLogin din context

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setFromLogin } = useAuth();                  // ← salvăm userul în localStorage via context

  // Dacă e deja logat, trimite-l acasă
  useEffect(() => {
    const raw = localStorage.getItem("hwarang:user");
    if (raw) navigate("/acasa", { replace: true });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Backend-ul tău răspunde cu { status, user, email, rol, grupe ... }
      const { data } = await api.post("/api/login", formData);

      if (data?.status === "success") {
        // 1) persistă userul în localStorage prin Context
        setFromLogin(data);                           // ← NU mai folosim /api/me

        // 2) feedback UI
        toast.success("Autentificare reușită!");

        // 3) routing în funcție de rol (normalizat)
        const role = (data?.rol || "").toString().trim().toLowerCase();
        setTimeout(() => {
          if (["admin"].includes(role)) return navigate("/admin-dashboard");
          if (["antrenor"].includes(role)) return navigate("/antrenor_dashboard");
          if (["antrenorextern"].includes(role)) return navigate("/concursuri-extern");
          // parinte / sportiv / fallback
          return navigate("/acasa");
        }, 600);
      } else {
        setError(data?.message || "Autentificare eșuată.");
      }
    } catch (err) {
      setError("Eroare server. Încearcă din nou.");
    }
  };

  return (
    <>
      <Navbar />
      <section className="login-container">
        <h2>Autentificare</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
          />

          <label htmlFor="password">Parolă:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />

          {error && <p className="error-msg">{error}</p>}

          <button type="submit">Autentifică-te</button>

          <p style={{ marginTop: "1rem", color: "white" }}>
            Ți-ai uitat parola?{" "}
            <Link
              to="/resetare-parola"
              style={{ color: "#ffcc00", textDecoration: "none", fontWeight: "bold" }}
            >
              Resetează aici.
            </Link>
          </p>

          <p style={{ marginTop: "1rem", color: "white" }}>
            Nu ai un cont?{" "}
            <Link
              to="/inregistrare"
              style={{ color: "#b266ff", textDecoration: "none", fontWeight: "bold" }}
            >
              Înregistrează-te aici.
            </Link>
          </p>
        </form>
      </section>
      <Footer />
    </>
  );
};

export default LoginForm;
