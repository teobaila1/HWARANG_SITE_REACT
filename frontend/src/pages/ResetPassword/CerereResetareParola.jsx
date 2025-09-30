import { useState } from "react";
import Navbar from "../../components/Navbar";
import {API_BASE} from "../../config";
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
      await res.json(); // nu ne bazăm pe mesajul backend-ului, afișăm mesajul tău
      setMesaj("Link de resetare trimis pe mail, verificați...");
      setTrimis(true); // ascundem formularul
    } catch {
      setMesaj("Eroare la trimiterea emailului. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ maxWidth: 420, margin: "40px auto" }}>
        <h2>Resetare Parolă</h2>

        {!trimis ? (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Emailul tău"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{ width: "100%", padding: 10, marginBottom: 10 }}
            />
            <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
              {loading ? "Se trimite..." : "Trimite link resetare"}
            </button>
          </form>
        ) : (
          <div style={{ padding: 12, background: "black", border: "1px solid #d3f0d3", borderRadius: 8 }}>
            <p>{mesaj}</p>
          </div>
        )}

        {!trimis && mesaj && <p style={{ marginTop: 10 }}>{mesaj}</p>}
      </div>
    </>
  );
}

export default CerereResetareParola;
