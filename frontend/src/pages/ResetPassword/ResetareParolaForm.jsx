import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import { API_BASE } from "../../config";

function ResetareParolaForm() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [parolaNoua, setParolaNoua] = useState("");
  const [confirmare, setConfirmare] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parolaNoua !== confirmare) {
      setMesaj("Parolele nu coincid.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: parolaNoua }),
      });

      const data = await res.json();
      if (data.status === "success") {
        setSuccess(true);
        // schimbă ruta dacă la tine e diferită (ex: "/login" sau "/autentificare")
        setTimeout(() => navigate("/autentificare"), 2000);
      } else {
        setMesaj(data.message || "Eroare la resetare.");
      }
    } catch {
      setMesaj("A apărut o eroare. Te rugăm să încerci din nou.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* --- CSS DEDICAT PENTRU MOBIL & DESKTOP --- */}
      <style>
        {`
          .reset-final-container {
            max-width: 420px;
            margin: 100px auto;
            padding: 20px;
          }

          /* INPUT FIELDS */
          .reset-final-input {
            width: 100%;
            padding: 16px;
            margin-bottom: 15px;
            background-color: #121214 !important;
            border: 1px solid #3f3f46 !important;
            border-radius: 8px;
            color: #ffffff !important;
            font-size: 16px !important; /* Previne zoom pe iOS */
            outline: none;
            -webkit-appearance: none; /* Reset iOS */
            appearance: none;         /* Reset Android */
            box-sizing: border-box;
          }
          .reset-final-input:focus {
            border-color: #dc2626 !important;
            background-color: #000 !important;
          }
          .reset-final-input::placeholder {
            color: #71717a;
          }

          /* BUTON */
          .reset-final-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%) !important;
            color: white !important;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
            -webkit-appearance: none;
            appearance: none;
            margin-top: 10px;
            transition: transform 0.2s;
          }
          .reset-final-btn:active {
            transform: scale(0.98);
          }

          /* BUTON LOADING */
          .reset-final-btn:disabled {
            background: #27272a !important;
            color: #71717a !important;
            border: 1px solid #3f3f46 !important;
            box-shadow: none;
            cursor: not-allowed;
            opacity: 1 !important;
          }

          /* LABEL */
          .reset-label {
            display: block;
            color: #a1a1aa;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 6px;
            margin-left: 2px;
          }
        `}
      </style>

      <div className="reset-final-container">
        <h2 style={{ textAlign: "center", marginBottom: "30px", fontWeight: "800", color: "#fff" }}>
            Setare Parolă Nouă
        </h2>

        {!success ? (
          <form onSubmit={handleSubmit}>

            {/* Input 1: Parola Nouă */}
            <div style={{ marginBottom: "15px" }}>
                <label className="reset-label">Parola Nouă</label>
                <input
                  className="reset-final-input"
                  type="password"
                  placeholder="Introdu noua parolă"
                  value={parolaNoua}
                  onChange={(e) => setParolaNoua(e.target.value)}
                  required
                  disabled={loading}
                />
            </div>

            {/* Input 2: Confirmare */}
            <div style={{ marginBottom: "5px" }}>
                <label className="reset-label">Confirmă Parola</label>
                <input
                  className="reset-final-input"
                  type="password"
                  placeholder="Confirmă noua parolă"
                  value={confirmare}
                  onChange={(e) => setConfirmare(e.target.value)}
                  required
                  disabled={loading}
                />
            </div>

            <button
                type="submit"
                className="reset-final-btn"
                disabled={loading}
            >
              {loading ? "SE SALVEAZĂ..." : "SALVEAZĂ PAROLA"}
            </button>
          </form>
        ) : (
          <div style={{
              padding: "25px",
              background: "#18181b",
              border: "1px solid #2ecc71",
              borderRadius: "12px",
              textAlign: "center"
          }}>
            <div style={{ fontSize: "3rem", color: "#2ecc71", marginBottom: "15px" }}>
                <i className="fas fa-check-circle"></i>
            </div>
            <h3 style={{ color: "#fff", margin: "0 0 10px 0" }}>Succes!</h3>
            <p style={{ color: "#a1a1aa", margin: 0 }}>
                Parola a fost schimbată.<br/>Vei fi redirecționat către autentificare...
            </p>
          </div>
        )}

        {!success && mesaj && (
            <div style={{
                marginTop: "20px",
                padding: "15px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid #ef4444",
                borderRadius: "8px",
                color: "#ef4444",
                textAlign: "center",
                fontWeight: "bold"
            }}>
                {mesaj}
            </div>
        )}
      </div>
    </>
  );
}

export default ResetareParolaForm;