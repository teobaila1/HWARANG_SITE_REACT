// vite_hwarang_react/frontend/pages/AdminSetPermisiuni.jsx
import React, {useEffect, useState} from "react";
import Navbar from "../components/Navbar";
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
        if (!username || rol !== "admin") {
            navigate("/access-denied");
        }
    }, []);


    useEffect(() => {
        fetch("/api/antrenori_externi")
            .then(res => res.json())
            .then(data => setAntrenori(data));

        fetch("/api/toate_concursurile")
            .then(res => res.json())
            .then(data => setConcursuri(data.concursuri));
    }, []);

    const handleUserSelect = (e) => {
        const user_id = e.target.value;
        setUserId(user_id);
        const user = antrenori.find((a) => a.id.toString() === user_id);
        setSelectedUser(user?.username || "");  // setează username-ul corect
        setSelectedConcursIds([]); // curățăm selecția
    };

    const toggleConcurs = (id) => {
        setSelectedConcursIds(prev =>
            prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
        );
    };

    const handleSave = () => {

        fetch("/api/set_permisiuni", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                user_id: userId,
                concurs_ids: selectedConcursIds
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    alert("✔️ Permisiunile au fost salvate cu succes!");
                } else {
                    alert("❌ Eroare la salvare: " + data.message);
                }
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
                .catch(err => {
                    console.error('Eroare la fetch permisiuni:', err);
                });
        }
    }, [selectedUser]);


    return (
        <>
            <Navbar/>
            <div className="selector-antrenor">
                <label>Alege antrenor:</label>
                <select onChange={handleUserSelect}>
                    <option value="">-- Selectează --</option>
                    {antrenori.map(a => (
                        <option key={a.id} value={a.id}>{a.username}</option>
                    ))}
                </select>

                {userId && (
                    <div className="lista-concursuri">
                        <h3>Concursuri disponibile:</h3>
                        <table className="tabel-concursuri">
                            <thead>
                            <tr>
                                <th>Concurs</th>
                                <th>Perioadă</th>
                                <th>Permis</th>
                            </tr>
                            </thead>
                            <tbody>
                            {concursuri.map(c => (
                                <tr key={c.id}>
                                    <td>{c.nume}</td>
                                    <td>{c.perioada}</td>
                                    <td style={{textAlign: "center"}}>
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
                        <button onClick={handleSave} className="buton-salveaza">Salvează permisiuni</button>
                    </div>

                )}
            </div>
        </>
    );
};

export default AdminSetPermisiuni;
