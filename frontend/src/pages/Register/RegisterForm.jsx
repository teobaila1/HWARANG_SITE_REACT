import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import "../../../static/css/Register.css";
import { Link } from "react-router-dom";
import {API_BASE} from "../../config";

const Register = () => {
  const [formData, setFormData] = useState({
    nume_complet: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
    tip: "",
    varsta: "",
    grupe: ""
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // copiii sunt OPȚIONALI
  const [useChildren, setUseChildren] = useState(false);
  const [copii, setCopii] = useState([]); // start cu listă goală

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "tip" && value === "Parinte" ? { varsta: "Peste 18" } : {}),
    }));
  };

  const adaugaCopil = () =>
    setCopii((prev) => [...prev, { nume: "", varsta: "", grupa: "", gen: "" }]);
  const stergeCopil = (idx) =>
    setCopii((prev) => prev.filter((_, i) => i !== idx));

  const handleCopilChange = (index, field, value) => {
    setCopii((prev) => {
      const nou = [...prev];
      nou[index] = { ...nou[index], [field]: value };
      return nou;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirm) {
      toast.error("Parolele nu coincid.");
      return;
    }

    if (formData.tip === "Sportiv" && formData.varsta === "Sub 18") {
      toast.error("Sportivii sub 18 ani nu pot crea cont. Rugăm părintele să se înregistreze.");
      return;
    }

    // trimitem numai copiii completați cu ceva (inclusiv gen)
    const copiiTrimisi =
      useChildren && formData.tip === "Parinte"
        ? copii.filter((c) => c.nume || c.grupa || c.varsta || c.gen)
        : [];

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, copii: copiiTrimisi }),
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
          varsta: "",
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
      <Navbar />
      {/* <ToastContainer /> */}
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
            <option value="Sportiv">Sportiv/Copil</option>
            <option value="Antrenor">Antrenor</option>
          </select>

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

          {formData.tip === "Parinte" && (
            <>
              <label className="checkbox-inline" style={{ marginTop: 10 }}>
                <input
                  type="checkbox"
                  checked={useChildren}
                  onChange={(e) => setUseChildren(e.target.checked)}
                />{" "}
                Adaug copii acum (opțional)
              </label>

              {useChildren && (
                <>
                  <h4>Copii</h4>
                  {copii.map((copil, index) => (
                    <div key={index} className="copil-fields" style={{ marginBottom: "12px" }}>
                      <input
                        type="text"
                        placeholder={`Nume copil ${index + 1}`}
                        value={copil.nume}
                        onChange={(e) => handleCopilChange(index, "nume", e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Vârstă"
                        min="1"
                        max="30"
                        value={copil.varsta}
                        onChange={(e) => handleCopilChange(index, "varsta", e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Grupa (ex: Grupa 1)"
                        value={copil.grupa}
                        onChange={(e) => handleCopilChange(index, "grupa", e.target.value)}
                      />
                      <select
                        value={copil.gen || ""}
                        onChange={(e) => handleCopilChange(index, "gen", e.target.value)}
                      >
                        <option value="">Gen (—)</option>
                        <option value="M">M</option>
                        <option value="F">F</option>
                      </select>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => stergeCopil(index)}
                      >
                        Elimină
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={adaugaCopil} className="adauga-copil">
                    + Adaugă copil
                  </button>
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
                onChange={(e) => setFormData({ ...formData, grupe: e.target.value })}
                required
              />
              <small>Separă grupele prin virgulă.</small>
            </>
          )}

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">Cererea a fost trimisă cu succes!</p>}

          <button type="submit">Trimite cererea</button>
          Ai un cont deja creat?
          <Link
            to="/autentificare"
            style={{ color: "#b266ff", textDecoration: "none", fontWeight: "bold" }}
          >
            Autentifică-te aici.
          </Link>
        </form>
      </section>
      <Footer />
    </>
  );
};

export default Register;
