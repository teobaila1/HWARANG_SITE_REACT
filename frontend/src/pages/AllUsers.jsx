// src/pages/TotiUtilizatorii.jsx
import React, {useEffect, useState} from "react";
import Navbar from "../components/Navbar";


const TotiUtilizatorii = () => {
    const [users, setUsers] = useState([]);
    const [editari, setEditari] = useState({});

    useEffect(() => {
        fetch("http://localhost:5000/api/users") // modifică dacă ai alt backend
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((err) => console.error("Eroare la preluare utilizatori:", err));
    }, []);


    const handleRolChange = (userId, rolNou) => {
        setEditari((prev) => ({...prev, [userId]: rolNou}));
    };

    const handleSave = (userId) => {
        const rol_nou = editari[userId];
        const user = users.find((u) => u.id === userId);
        const admin_username = localStorage.getItem("username");

        fetch("http://localhost:5000/api/modifica-rol", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                admin_username,
                target_username: user.username,
                rol_nou,
            }),
        })
            .then((res) => res.json())
            .then((data) => alert(data.status || data.error));
    };


    const stergeUtilizator = (username) => {
        const admin_username = localStorage.getItem("username");
        if (!window.confirm(`Sigur vrei să ștergi utilizatorul ${username}?`)) return;

        fetch(`http://localhost:5000/api/users/${username}?admin_username=${admin_username}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.status || data.error);
                // actualizare vizuală
                setUsers((prev) => prev.filter((u) => u.username !== username));
            });
    };


    return (
        <>
            <Navbar/>
            <section style={{padding: "2rem", color: "white"}}>
                <h2>Toți utilizatorii</h2>
                <table style={{width: "100%", backgroundColor: "#1c1c1c", color: "white", borderCollapse: "collapse"}}>
                    <thead>
                    <tr>
                        <th style={{border: "1px solid white", padding: "0.5rem"}}>ID</th>
                        <th style={{border: "1px solid white", padding: "0.5rem"}}>Nume</th>
                        <th style={{border: "1px solid white", padding: "0.5rem"}}>Email</th>
                        <th style={{border: "1px solid white", padding: "0.5rem"}}>Rol</th>
                        <th style={{border: "1px solid white", padding: "0.5rem"}}>Acțiuni</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td style={{border: "1px solid white", padding: "0.5rem"}}>{user.id}</td>
                            <td style={{border: "1px solid white", padding: "0.5rem"}}>{user.username || user.nume}</td>
                            <td style={{border: "1px solid white", padding: "0.5rem"}}>{user.email}</td>
                            <td style={{border: "1px solid white", padding: "0.5rem"}}>
                                <select style={{border: "1px solid white", padding: "0.5rem"}}
                                        value={editari[user.id] || user.rol}
                                        onChange={(e) => handleRolChange(user.id, e.target.value)}
                                >
                                    <option style={{border: "1px solid white", padding: "0.5rem"}} value="admin">admin
                                    </option>
                                    <option style={{border: "1px solid white", padding: "0.5rem"}}
                                            value="Parinte">Parinte
                                    </option>
                                    <option style={{border: "1px solid white", padding: "0.5rem"}}
                                            value="Sportiv">Sportiv
                                    </option>
                                </select>

                            </td>
                            <td style={{border: "1px solid white", padding: "0.5rem"}}>
                                <button style={{border: "1px solid white", padding: "0.5rem"}}
                                        onClick={() => handleSave(user.id)}>Salvează
                                </button>
                                <button style={{border: "1px solid white", padding: "0.5rem"}} onClick={() => stergeUtilizator(user.username)}>Șterge</button>
                            </td>

                        </tr>
                    ))}
                    </tbody>
                </table>
            </section>
        </>
    );
};

export default TotiUtilizatorii;
