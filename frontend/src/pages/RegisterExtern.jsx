import React, {useState} from "react";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {useNavigate} from "react-router-dom";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Register.css";


const RegisterExtern = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirm: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirm) {
            toast.error("Parolele nu coincid.");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    ...formData,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    tip: "AntrenorExtern",
                    varsta: "-"  // ← adăugat pentru a satisface coloana
                })
            });

            const result = await res.json();
            if (result.status === "success") {
                toast.success("Cererea a fost trimisă cu succes!");
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                    confirm: "",
                });
            } else {
                toast.error(result.message || "Eroare la înregistrare.");
            }
        } catch (err) {
            toast.error("Eroare de server.");
        }
    };

    return (
        <>
            <Navbar/>
            <ToastContainer/>
            <section className="register-container">
                <h2>Înregistrare Antrenor Extern</h2>
                <form onSubmit={handleSubmit}>
                    <label>Username:</label>
                    <input type="text" name="username" required value={formData.username} onChange={handleChange}/>

                    <label>Email:</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange}/>

                    <label>Parolă:</label>
                    <input type={showPassword ? "text" : "password"} name="password" required value={formData.password}
                           onChange={handleChange}/>
                    <span onClick={() => setShowPassword(!showPassword)}>{showPassword ? "🙈" : "👁️"}</span>

                    <label>Confirmare parolă:</label>
                    <input type={showConfirm ? "text" : "password"} name="confirm" required value={formData.confirm}
                           onChange={handleChange}/>
                    <span onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? "🙈" : "👁️"}</span>

                    <button type="submit">Trimite cererea</button>
                </form>
            </section>
            <Footer/>
        </>
    );
};

export default RegisterExtern;
