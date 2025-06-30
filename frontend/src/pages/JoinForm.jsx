import React, {useState} from "react";
import Footer from "../components/Footer";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Join.css";
import {toast} from "react-toastify";
import {ToastContainer} from "react-toastify";
import Navbar from "../components/Navbar";

const JoinForm = () => {
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        prename: "",
        email: "",
        phone: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://192.168.100.87:5000/api/inscriere", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (result.status === "error") {
            toast.error(result.message); // Ex: "Email deja folosit"
            return;
        }
        if (result.status === "success") {
            setFormData({
                name: "",
                prename: "",
                email: "",
                phone: "",
                message: "",
            });
            toast.success("Înscriere trimisă cu succes! Vei primi un email de confirmare.", {
                position: "bottom-center",
                autoClose: 2000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        }
    };


    return (
        <>
            <Navbar/>
            <ToastContainer/>
            <section className="signup-container">
                <h2>Înscriere la ACS Hwarang Academy</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Nume:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <label htmlFor="prename">Prenume:</label>
                    <input
                        type="text"
                        id="prename"
                        name="prename"
                        required
                        value={formData.prename}
                        onChange={handleChange}
                    />

                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <label htmlFor="phone">Telefon:</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    <label htmlFor="message">Mesaj (opțional):</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                    ></textarea>

                    <div className="terms-checkbox">
                        <input
                            type="checkbox"
                            id="acceptTerms"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            required
                        />
                        <label htmlFor="acceptTerms">
                            Am citit și accept <a href="/termeni" style={{color: '#ff0066'}}>Termenii și Condițiile</a>
                        </label>
                    </div>

                    <button type="submit">Înscrie-te</button>
                </form>
            </section>

            <Footer/>
        </>
    );
};

export default JoinForm;
