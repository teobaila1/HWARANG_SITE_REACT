import React from "react";
import QRCode from "react-qr-code";

const MemberCard = ({ id, nume, titlu = "Membru Hwarang" }) => {
  // --- FIX DE SIGURANȚĂ ---
  // Dacă id-ul lipsește, nu încercăm să generăm QR-ul ca să nu crape pagina
  if (!id) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "20px", border: "1px solid red" }}>
        <p>Eroare: Lipsă ID Membru.</p>
        <p style={{fontSize: "0.8rem"}}>Încearcă să te reconectezi.</p>
      </div>
    );
  }

  return (
    <div style={{
      background: "linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)",
      padding: "20px",
      borderRadius: "15px",
      border: "2px solid #D4AF37",
      textAlign: "center",
      color: "white",
      maxWidth: "280px",
      margin: "0 auto"
    }}>
      <h3 style={{ color: "#D4AF37", margin: "0 0 10px 0" }}>HWARANG CARD</h3>

      <div style={{ background: "white", padding: "10px", borderRadius: "8px", display: "inline-block" }}>
        {/* Acum suntem siguri că id există */}
        <QRCode value={String(id)} size={150} />
      </div>

      <h4 style={{ margin: "15px 0 5px 0", fontSize: "1.2rem" }}>{nume || "Utilizator"}</h4>
      <p style={{ margin: 0, color: "#aaa", fontSize: "0.9rem" }}>{titlu}</p>
    </div>
  );
};

export default MemberCard;