import React, {useState} from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {ToastContainer, toast} from "react-toastify";
import "../../../static/css/Register.css";
import {Link} from "react-router-dom";
import {API_BASE} from "../../config";

const Register = () => {
    const [formData, setFormData] = useState({
        nume_complet: "",
        username: "",
        email: "",
        password: "",
        confirm: "",
        tip: "",
        data_nasterii: "",
        grupe: ""
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [useChildren, setUseChildren] = useState(false);
    const [copii, setCopii] = useState([]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const adaugaCopil = () =>
        setCopii((prev) => [...prev, {nume: "", varsta: "", grupa: "", gen: ""}]);
    const stergeCopil = (idx) =>
        setCopii((prev) => prev.filter((_, i) => i !== idx));

    const handleCopilChange = (index, field, value) => {
        setCopii((prev) => {
            const nou = [...prev];
            nou[index] = {...nou[index], [field]: value};
            return nou;
        });
    };

    const isAdultByYear = (dateString) => {
        if (!dateString) return false;
        const birthYear = new Date(dateString).getFullYear();
        const currentYear = new Date().getFullYear();
        return (currentYear - birthYear) >= 18;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirm) {
            toast.error("Parolele nu coincid.");
            return;
        }

        if (formData.tip === "Sportiv") {
            if (!formData.data_nasterii) {
                toast.error("Data nașterii este obligatorie.");
                return;
            }
            if (!isAdultByYear(formData.data_nasterii)) {
                toast.error("Pentru sportivii sub 18 ani (calculat la nivel de an), contul trebuie creat de un părinte.");
                return;
            }
        }

        // Validare Antrenor - Data nașterii e acum obligatorie
        if (formData.tip === "Antrenor") {
             if (!formData.data_nasterii) {
                toast.error("Data nașterii este obligatorie pentru antrenori.");
                return;
            }
        }

        const copiiTrimisi =
            useChildren && formData.tip === "Parinte"
                ? copii.filter((c) => c.nume || c.grupa || c.varsta || c.gen)
                : [];

        try {
            const res = await fetch(`${API_BASE}/api/register`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({...formData, copii: copiiTrimisi}),
            });

            const result = await res.json();
            if (result.status === "success") {
                setSuccess(true);
                toast.success("Cererea a fost trimisă! Vei primi un email de confirmare.");
                setFormData({
                    nume_complet: "",
                    username: "",
                    email: "",
                    password: "",
                    confirm: "",
                    tip: "",
                    data_nasterii: "",
                    grupe: ""
                });
                setUseChildren(false);
                setCopii([]);
            } else {
                toast.error(result.message || "Eroare la înregistrare.");
            }
        } catch {
            toast.error("Eroare server. Încearcă mai târziu.");
        }
    };

    return (
        <>
            <Navbar/>
            <section className="register-container">
                <h2>Cerere Cont HWARANG</h2>
                <form onSubmit={handleSubmit}>
                    <label>Nume complet</label>
                    <input
                        type="text"
                        name="nume_complet"
                        required
                        placeholder="Ex: Popescu Ion"
                        value={formData.nume_complet}
                        onChange={handleChange}
                    />

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
                        <option value="Sportiv">Sportiv (Peste 18 ani)</option>
                        <option value="Antrenor">Antrenor</option>
                    </select>

                    {/* --- CÂMP DATĂ NAȘTERE --- */}
                    {/* Afișăm pentru Sportiv, Parinte ȘI Antrenor */}
                    {(formData.tip === "Sportiv" || formData.tip === "Parinte" || formData.tip === "Antrenor") && (
                        <>
                            <label>Data Nașterii:</label>
                            <input
                                type="date"
                                name="data_nasterii"
                                // Este required pentru Sportiv și Antrenor
                                required={formData.tip === "Sportiv" || formData.tip === "Antrenor"}
                                value={formData.data_nasterii}
                                onChange={handleChange}
                            />
                            {formData.tip === "Sportiv" && (
                                <small style={{color: "#aaa", display: "block", marginTop: "-10px", marginBottom: "10px"}}>
                                    * Trebuie să împlinești 18 ani anul acesta.
                                </small>
                            )}
                        </>
                    )}

                    {formData.tip === "Parinte" && (
                        <>
                            <label className="checkbox-inline">
                                <input
                                    type="checkbox"
                                    checked={useChildren}
                                    onChange={(e) => setUseChildren(e.target.checked)}
                                />
                                <span>Adaug copii acum (opțional)</span>
                            </label>

                            {useChildren && (
                                <>
                                    <h4>Copii</h4>
                                    {copii.map((copil, index) => (
                                        <div key={index} className="copil-fields" style={{marginBottom: "12px"}}>
                                            <input
                                                type="text"
                                                placeholder={`Nume copil ${index + 1}`}
                                                value={copil.nume}
                                                onChange={(e) => handleCopilChange(index, "nume", e.target.value)}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Vârstă (ani)"
                                                value={copil.varsta}
                                                onChange={(e) => handleCopilChange(index, "varsta", e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Grupa"
                                                value={copil.grupa}
                                                onChange={(e) => handleCopilChange(index, "grupa", e.target.value)}
                                            />
                                            <select
                                                value={copil.gen || ""}
                                                onChange={(e) => handleCopilChange(index, "gen", e.target.value)}
                                            >
                                                <option value="">Gen</option>
                                                <option value="M">M</option>
                                                <option value="F">F</option>
                                            </select>
                                            <button type="button" className="btn btn-ghost" onClick={() => stergeCopil(index)}>
                                                Elimină
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={adaugaCopil} className="adauga-copil">+ Adaugă copil</button>
                                </>
                            )}
                        </>
                    )}

                    {formData.tip === "Antrenor" && (
                        <>
                            <label>Grupele gestionate</label>
                            <input
                                type="text"
                                name="grupe"
                                placeholder="Ex: Grupa 1, Grupa 5"
                                value={formData.grupe || ""}
                                onChange={(e) => setFormData({...formData, grupe: e.target.value})}
                                required
                            />
                        </>
                    )}

                    {error && <p className="error-msg">{error}</p>}
                    {success && <p className="success-msg">Cererea a fost trimisă cu succes!</p>}

                    <button type="submit">Trimite cererea</button>
                    Ai un cont deja creat?
                    <Link to="/autentificare" style={{color: "#b266ff", textDecoration: "none", fontWeight: "bold", marginLeft: "5px"}}>
                         Autentifică-te aici.
                    </Link>
                </form>
            </section>
            <Footer/>
        </>
    );
};

export default Register;