import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {toast} from "react-toastify";
import "../../../static/css/Login.css";
import {Link} from "react-router-dom";
import {API_BASE} from "../../config";

const LoginForm = () => {
    const [formData, setFormData] = useState({username: "", password: ""});
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Dacă e deja logat, îl trimitem acasă
        const username = localStorage.getItem("username");
        if (username && username !== "undefined") {
            navigate("/acasa", {replace: true});
        }
    }, []);

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
            const res = await fetch(`${API_BASE}/api/login`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (res.ok && result.status === "success") {
                toast.success("Autentificare reușită!");

                // --- SALVARE DATE SESIUNE ---
                localStorage.setItem("token", result.token);
                localStorage.setItem("username", result.username);
                localStorage.setItem("rol", result.rol);

                // IMPORTANT: Salvăm ID-ul pentru generarea codului QR
                // Unificăm: dacă backend-ul trimite 'id' sau 'user_id', îl salvăm ca 'user_id'
                const idToSave = result.user_id || result.id;
                if (idToSave) {
                    localStorage.setItem("user_id", idToSave);
                }

                if (result.nume_complet) localStorage.setItem("nume_complet", result.nume_complet);
                if (result.email) localStorage.setItem("email", result.email);

                // Redirect în funcție de rol
                setTimeout(() => {
                    const r = result.rol;
                    if (r === "admin") {
                        navigate("/admin-dashboard");
                    } else if (r === "Antrenor") {
                        navigate("/antrenor_dashboard");
                    } else if (r === "AntrenorExtern") {
                        navigate("/concursuri-extern");
                    } else if (r === "Parinte") {
                        navigate("/copiii-mei");
                    } else {
                        navigate("/acasa");
                    }
                }, 500);

            } else {
                setError(result.message || "Autentificare eșuată.");
            }
        } catch (err) {
            console.error(err);
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
                        placeholder="Nume utilizator"
                    />

                    <label htmlFor="password">Parolă:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Parola"
                    />

                    {error && <p className="error-msg">{error}</p>}

                    <button type="submit">Autentifică-te</button>

                    <p style={{marginTop: "1rem", color: "white"}}>
                        Ți-ai uitat parola?{" "}
                        <Link to="/resetare-parola"
                              style={{color: "#ffcc00", textDecoration: "none", fontWeight: "bold"}}>
                            Resetează aici.
                        </Link>
                    </p>

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