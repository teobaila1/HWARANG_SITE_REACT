import { useState } from "react";
import Navbar from "../../components/Navbar";
import { API_BASE } from "../../config";

function CerereResetareParola() {
  const [email, setEmail] = useState("");
  const [mesaj, setMesaj] = useState(null);
  const [trimis, setTrimis] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      await res.json();
      setMesaj("Link de resetare trimis pe mail, verificați...");
      setTrimis(true);
    } catch {
      setMesaj("Eroare la trimiterea emailului. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  };

  // --- STILURI COMUNE (Ca să fie identic pe iPhone și Android) ---
  const inputStyle = {
    width: "100%",
    padding: "15px",
    marginBottom: "15px",
    backgroundColor: "#121214", // Fundal închis
    border: "1px solid #3f3f46", // Chenar gri fin
    borderRadius: "8px",
    color: "#ffffff", // Text alb
    fontSize: "16px", // Mărime fixă (previne zoom pe iPhone)
    outline: "none",
    appearance: "none",        // Scoate stilul nativ Android
    WebkitAppearance: "none",  // Scoate stilul nativ iOS
    boxSizing: "border-box"
  };

  const buttonStyle = {
    width: "100%",
    padding: "15px",
    // Dacă e loading sau dezactivat, îl facem gri închis. Dacă nu, Roșu Hwarang.
    background: loading
      ? "#27272a"
      : "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
    color: loading ? "#71717a" : "#ffffff", // Text gri dacă e loading, alb dacă e activ
    border: loading ? "1px solid #3f3f46" : "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: 1, // Forțăm vizibilitatea pe mobil
    appearance: "none",
    WebkitAppearance: "none",
    boxShadow: loading ? "none" : "0 4px 15px rgba(220, 38, 38, 0.3)"
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ maxWidth: 420, margin: "100px auto", padding: "20px" }}>

        <h2 style={{ textAlign: "center", marginBottom: "30px", fontWeight: "800" }}>
            Resetare Parolă
        </h2>

        {!trimis ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "5px" }}>
                <label style={{ color: "#a1a1aa", fontSize: "0.85rem", fontWeight: "600", marginLeft: "2px" }}>
                    EMAILUL TĂU
                </label>
            </div>

            <input
              type="email"
              placeholder="ex: nume@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={inputStyle} // Aplicăm stilul definit sus
              onFocus={(e) => e.target.style.borderColor = "#dc2626"} // Roșu când scrii
              onBlur={(e) => e.target.style.borderColor = "#3f3f46"}  // Gri când pleci
            />

            <button
                type="submit"
                disabled={loading}
                style={buttonStyle} // Aplicăm stilul definit sus
            >
              {loading ? "SE TRIMITE..." : "TRIMITE LINK RESETARE"}
            </button>
          </form>
        ) : (
          <div style={{
              padding: "20px",
              background: "#18181b",
              border: "1px solid #2ecc71",
              borderRadius: "12px",
              textAlign: "center"
          }}>
            <p style={{ color: "#2ecc71", fontWeight: "bold", fontSize: "1.1rem", margin: 0 }}>
                <i className="fas fa-check-circle" style={{ marginRight: "8px" }}></i>
                {mesaj}
            </p>
          </div>
        )}

        {!trimis && mesaj && (
            <p style={{ marginTop: "15px", color: "#ef4444", textAlign: "center", fontWeight: "bold" }}>
                {mesaj}
            </p>
        )}
      </div>
    </>
  );
}

export default CerereResetareParola;