import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import {API_BASE} from "../../config";

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
        setMesaj("Parola a fost resetată cu succes! Veți fi redirecționat...");
        // schimbă ruta dacă la tine e diferită (ex: "/login")
        setTimeout(() => navigate("/autentificare"), 1500);
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
      <div className="container" style={{ maxWidth: 420, margin: "40px auto" }}>
        <h2>Introdu parola nouă</h2>

        {!success ? (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Parola nouă"
              value={parolaNoua}
              onChange={(e) => setParolaNoua(e.target.value)}
              required
              disabled={loading}
              style={{ width: "100%", padding: 10, marginBottom: 10 }}
            />
            <input
              type="password"
              placeholder="Confirmă parola"
              value={confirmare}
              onChange={(e) => setConfirmare(e.target.value)}
              required
              disabled={loading}
              style={{ width: "100%", padding: 10, marginBottom: 10 }}
            />
            <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
              {loading ? "Se salvează..." : "Resetează"}
            </button>
          </form>
        ) : (
          <div style={{ padding: 12, background: "black", border: "1px solid #d3f0d3", borderRadius: 8 }}>
            <p>{mesaj}</p>
          </div>
        )}

        {!success && mesaj && <p style={{ marginTop: 10 }}>{mesaj}</p>}
      </div>
    </>
  );
}

export default ResetareParolaForm;