import React, {useState} from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Register.css";
import {Link} from "react-router-dom";


const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirm: "",
        tip: "",
        varsta: "",
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
            // resetăm varsta dacă se schimbă tipul în "Părinte"
            ...(name === "tip" && value === "Parinte" ? {varsta: "Peste 18"} : {}),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirm) {
            toast.error("Parolele nu coincid.", {
                position: "top-center",
                autoClose: 4000,
                theme: "colored",
            });
            return;
        }

        if (formData.tip === "Sportiv" && formData.varsta === "Sub 18") {
            toast.error("Sportivii sub 18 ani nu pot crea cont. Rugăm părintele să se înregistreze.", {
                position: "top-center",
                autoClose: 4000,
                theme: "colored",
            });
            return;
        }

        try {
            const res = await fetch("http://192.168.100.87:5000/api/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            });

            const result = await res.json();
            if (result.status === "success") {
                setSuccess(true);
                toast.success("Cererea a fost trimisă! Vei primi un email de confirmare.", {
                    position: "top-center",
                    autoClose: 4000,
                    theme: "colored",
                });
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                    confirm: "",
                    tip: "",
                    varsta: "",
                });
            } else {
                toast.error(result.message || "Eroare la înregistrare.", {
                    position: "top-center",
                    autoClose: 4000,
                    theme: "colored",
                });
            }
        } catch (err) {
            toast.error("Eroare server. Încearcă mai târziu.", {
                position: "top-center",
                autoClose: 4000,
                theme: "colored",
            });
        }
    };

    return (
        <>
            <Navbar/>
            <ToastContainer/>
            <section className="register-container">
                <h2>Cerere Cont HWARANG</h2>
                <form onSubmit={handleSubmit}>
                    <label>Nume utilizator</label>
                    <input
                        type="text"
                        name="username"
                        required
                        placeholder="Ex: ion.popescu"
                        value={formData.username}
                        onChange={handleChange}
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="email@exemplu.com"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <label>Parolă</label>
                    <div className="input-password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            placeholder="Alege o parolă sigură"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <span onClick={() => setShowPassword(!showPassword)} className="eye-toggle">
    {showPassword ? "🙈" : "👁️"}
  </span>
                    </div>

                    <label>Confirmă Parola</label>
                    <div className="input-password-wrapper">
                        <input
                            type={showConfirm ? "text" : "password"}
                            name="confirm"
                            required
                            placeholder="Reintrodu parola"
                            value={formData.confirm}
                            onChange={handleChange}
                        />
                        <span onClick={() => setShowConfirm(!showConfirm)} className="eye-toggle">
    {showConfirm ? "🙈" : "👁️"}
  </span>
                    </div>

                    <label>Tip utilizator:</label>
                    <select name="tip" required onChange={handleChange} value={formData.tip}>
                        <option value="">Selectează</option>
                        <option value="Parinte">Părinte</option>
                        <option value="Sportiv">Sportiv/Copil</option>
                    </select>

                    {/* Afișăm vârsta doar dacă este Sportiv */}
                    {formData.tip === "Sportiv" && (
                        <>
                            <label>Vârstă:</label>
                            <select name="varsta" required onChange={handleChange} value={formData.varsta}>
                                <option value="">Selectează</option>
                                <option value="Peste 18">Peste 18 ani</option>
                                <option value="Sub 18">Sub 18 ani</option>
                            </select>
                        </>
                    )}

                    {error && <p className="error-msg">{error}</p>}
                    {success && <p className="success-msg">Cererea a fost trimisă cu succes!</p>}

                    <button type="submit">Trimite cererea</button>
                    Ai un cont deja creat?{" "}
                    <Link to="/autentificare" style={{color: "#b266ff", textDecoration: "none", fontWeight: "bold"}}>
                        Autentifica-te aici.
                    </Link>
                </form>
            </section>
            <Footer/>
        </>
    );
};

export default Register;