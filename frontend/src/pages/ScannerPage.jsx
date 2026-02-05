import React, { useState, useEffect } from "react"; // <-- Adaugă useEffect
import { useNavigate } from "react-router-dom";     // <-- Adaugă useNavigate
import QrScanner from "react-qr-scanner";
import { API_BASE } from "../config";

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState("");
  const [message, setMessage] = useState("Aștept scanarea...");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScanned, setLastScanned] = useState(null); // Fix pentru scanare dublă

  const navigate = useNavigate();

  // --- SECURITATE: Verificăm rolul la intrare ---
  useEffect(() => {
    const rol = localStorage.getItem("rol");
    const token = localStorage.getItem("token");

    // Dacă nu e logat SAU nu e (Antrenor sau admin) -> Redirect
    if (!token || (rol !== "Antrenor" && rol !== "admin")) {
        // Opțional: alert("Acces interzis!");
        navigate("/acasa"); // Îl aruncăm pe prima pagină
    }
  }, [navigate]);

  const handleScan = async (data) => {
    // ... (restul codului tău de scanare rămâne neschimbat) ...
    if (data && data.text && !isProcessing) {
        if (data.text === lastScanned) return;
        // ... logica ta de fetch ...
        // Asigură-te că aici ai logica de fetch corectă pe care am scris-o anterior
        setIsProcessing(true);
        setLastScanned(data.text);

        try {
            const token = localStorage.getItem("token");
            const antrenor_id = localStorage.getItem("user_id");

            const res = await fetch(`${API_BASE}/api/prezenta/scan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    qr_code: data.text,
                    antrenor_id: antrenor_id
                })
            });
            // ... restul logicii de răspuns ...
            const result = await res.json();
            if (res.ok) {
                setScanResult(`✅ ${result.nume}`);
                setMessage("Prezență salvată!");
            } else {
                 setMessage(result.message || "Eroare");
            }
        } catch(e) { console.log(e); }

        setTimeout(() => {
             setIsProcessing(false);
             setLastScanned(null);
             setScanResult("");
             setMessage("Pregătit...");
        }, 2000);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const previewStyle = {
    height: 240,
    width: 320,
    margin: "0 auto",
    borderRadius: "10px",
    border: "2px solid red"
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", color: "white", marginTop: "60px" }}>
      <h2>Scanare Prezență</h2>
      <p style={{color: "#aaa"}}>Îndreaptă camera spre codul QR</p>

      <div style={{marginTop: "20px", marginBottom: "20px"}}>
        <QrScanner
          delay={300}
          style={previewStyle}
          onError={handleError}
          onScan={handleScan}
          constraints={{
             video: { facingMode: "environment" }
          }}
        />
      </div>

      <div style={{
          padding: "15px",
          borderRadius: "10px",
          backgroundColor: scanResult.includes("✅") ? "green" : "#333",
          fontWeight: "bold",
          fontSize: "1.2rem",
          minHeight: "50px"
      }}>
        {scanResult || message}
      </div>

      <button onClick={() => window.location.reload()} style={{marginTop: "20px", padding: "10px 20px"}}>
        Resetează Camera
      </button>
    </div>
  );
};

export default ScannerPage;