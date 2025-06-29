import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Login.css";
import {Link} from "react-router-dom";


const LoginForm = () => {
    const [formData, setFormData] = useState({username: "", password: ""});
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            });

            const result = await res.json();
            if (result.status === "success") {
                alert("Autentificare reușită!");
                localStorage.setItem("username", result.user);
                localStorage.setItem("rol", result.rol);
                localStorage.setItem("email", result.email);

                // redirecționare automată în funcție de rol
                if (result.rol === "admin" || "Parinte" || "Sportiv") {
                    navigate("/acasa");
                }
            } else {
                setError(result.message || "Autentificare eșuată.");
            }
        } catch (err) {
            setError("Eroare server. Încearcă din nou.");
        }
    };

    return (
        <>
            <Navbar/>
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
                    <p style={{marginTop: "1rem", color: "white"}}>
                        Nu ai un cont?{" "}
                        <Link to="/inregistrare" style={{color: "#b266ff", textDecoration: "none", fontWeight: "bold"}}>
                            Înregistrează-te aici.
                        </Link>
                    </p>
                </form>
            </section>
            <Footer/>
        </>
    );
};

export default LoginForm;
