// vite_hwarang_react/frontend/pages/AdminSetPermisiuni.jsx
import React, {useEffect, useState} from "react";
import Navbar from "../../components/Navbar";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/AdminSetPermisiuni.css";
import {useNavigate} from "react-router-dom";

const AdminSetPermisiuni = () => {
  const [antrenori, setAntrenori] = useState([]);
  const [concursuri, setConcursuri] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedConcursIds, setSelectedConcursIds] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [permisiuni, setPermisiuni] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const rol = localStorage.getItem("rol");
    if (!username || rol !== "admin") navigate("/access-denied");
  }, [navigate]);

  useEffect(() => {
    fetch("/api/antrenori_externi").then(r => r.json()).then(setAntrenori);
    fetch("/api/toate_concursurile").then(r => r.json()).then(d => setConcursuri(d.concursuri));
  }, []);

  const handleUserSelect = (e) => {
    const user_id = e.target.value;
    setUserId(user_id);
    const user = antrenori.find((a) => a.id.toString() === user_id);
    setSelectedUser(user?.username || "");
    setSelectedConcursIds([]);
  };

  const toggleConcurs = (id) => {
    setSelectedConcursIds(prev => prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]);
  };

  const handleSave = () => {
    fetch("/api/set_permisiuni", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ user_id: userId, concurs_ids: selectedConcursIds })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") alert("Permisiunile au fost salvate cu succes!");
        else alert("Eroare la salvare: " + data.message);
      });
  };

  useEffect(() => {
    if (selectedUser) {
      fetch(`/api/get_permisiuni/${selectedUser}`)
        .then(res => res.json())
        .then(data => {
          const set = new Set(data);
          setPermisiuni(set);
          setSelectedConcursIds([...set]);
        })
        .catch(err => console.error('Eroare la fetch permisiuni:', err));
    }
  }, [selectedUser]);

  return (
    <>
      <Navbar/>
      <div className="permisiuni-page">
        <div className="page-inner">

          <h2 className="page-title">Setează permisiuni pentru concursuri</h2>

          <div className="selector-card">
            <div className="selector-row">
              <label htmlFor="select-antrenor" className="selector-label">Alege antrenor</label>
              <select id="select-antrenor" onChange={handleUserSelect} className="selector">
                <option value="">— Selectează —</option>
                {antrenori.map(a => (
                  <option key={a.id} value={a.id}>{a.username}</option>
                ))}
              </select>
            </div>

            {userId && (
              <div className="coach-chip">
                <span className="avatar">{selectedUser?.[0]?.toUpperCase()}</span>
                <div className="meta">
                  <span>Permisiuni pentru</span>
                  <strong>{selectedUser}</strong>
                </div>
              </div>
            )}
          </div>

          {userId && (
            <div className="table-card">
              <h3 className="table-title">Concursuri disponibile</h3>
              <table className="tabel-concursuri">
                <thead>
                  <tr>
                    <th>Concurs</th>
                    <th>Perioadă</th>
                    <th className="th-center">Permis</th>
                  </tr>
                </thead>
                <tbody>
                  {concursuri.map(c => (
                    <tr key={c.id}>
                      <td>{c.nume}</td>
                      <td>{c.perioada}</td>
                      <td className="td-center">
                        <input
                          type="checkbox"
                          checked={selectedConcursIds.includes(c.id)}
                          onChange={() => toggleConcurs(c.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="actions">
                <button onClick={handleSave} className="buton-salveaza">
                  Salvează permisiuni
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default AdminSetPermisiuni;
