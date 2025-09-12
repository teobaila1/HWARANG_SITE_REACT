import React, {useEffect, useState} from "react";
import Navbar from "../../components/Navbar";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/CereriConturi.css";

function CereriConturi() {
  const [cereri, setCereri] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem("username");
  const rol = localStorage.getItem("rol");

  useEffect(() => {
    if (rol !== "admin") {
      setError("Acces interzis. Această pagină este disponibilă doar pentru administratori.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/cereri?username=${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("Eroare la încărcare cereri.");
        return res.json();
      })
      .then((data) => {
        setCereri(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleAccept = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cereri/accepta/${id}`, { method: "POST" });
      const data = await res.json();
      if (data.status === "success") {
        alert("Cererea a fost acceptată.");
        setCereri((prev) => prev.filter((c) => c.id !== id));
      } else alert(data.error || "Eroare la acceptare.");
    } catch {
      alert("Eroare la server.");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cereri/respingere/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === "success") {
        alert("Cererea a fost respinsă.");
        setCereri((prev) => prev.filter((c) => c.id !== id));
      } else alert(data.error || "Eroare la respingere.");
    } catch {
      alert("Eroare la server.");
    }
  };

  return (
    <>
      <Navbar/>
      <div className="cereri-page">
        <div className="cereri-inner">
          <h2 className="cereri-title cereri-title--center">Cereri de creare cont</h2>

          {loading && <div className="status status-loading">Se încarcă…</div>}
          {!loading && error && <div className="status status-error">{error}</div>}

          {!loading && !error && (
            <>
              {cereri.length === 0 ? (
                <div className="empty">Nu există cereri de procesat.</div>
              ) : (
                <div className="table-card">
                  <table className="cereri-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Tip</th>
                        <th>Vârstă</th>
                        <th className="th-right">Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cereri.map((c) => (
                        <tr key={c.id}>
                          <td>{c.id}</td>
                          <td>{c.username}</td>
                          <td>{c.email}</td>
                          <td><span className="badge">{c.tip}</span></td>
                          <td>{c.varsta}</td>
                          <td className="td-right">
                            <button className="btn btn-accept" onClick={() => handleAccept(c.id)}>Acceptă</button>
                            <button className="btn btn-reject" onClick={() => handleReject(c.id)}>Respinge</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default CereriConturi;
