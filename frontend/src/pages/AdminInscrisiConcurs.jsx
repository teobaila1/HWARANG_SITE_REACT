import React, {useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import {useNavigate} from "react-router-dom";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/AdminInscrisiConcurs.css";


const AdminInscrisiConcurs = () => {
    const [sportivi, setSportivi] = useState([]);
    const navigate = useNavigate();

    const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState({});

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSportivi, setFilteredSportivi] = useState([]);

    useEffect(() => {
        const rol = localStorage.getItem("rol");
        if (rol !== "admin") {
            navigate("/access-denied");
        }

        fetch("http://localhost:5000/api/inscrisi_concursuri")
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    setSportivi(data.sportivi);
                    setFilteredSportivi(data.sportivi); // 👈 filtrul de start
                }
            });
    }, []);


    const handleDelete = async (id) => {
        if (!window.confirm("Ești sigur că vrei să ștergi această înscriere?")) return;

        const res = await fetch(`http://localhost:5000/api/delete_inscriere/${id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            setSportivi(prev => prev.filter(s => s.id !== id));
        } else {
            alert("Eroare la ștergere.");
        }
    };


    const handleEdit = (sportiv) => {
        setEditIndex(sportiv.id);
        setEditData({...sportiv});
    };


    const handleCancel = () => {
        setEditIndex(null);
        setEditData({});
    };


    const handleSave = async () => {
        const res = await fetch(`http://localhost:5000/api/update_inscriere/${editIndex}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(editData)
        });

        if (res.ok) {
            // update local
            setSportivi(prev =>
                prev.map(s => (s.id === editIndex ? {...editData, id: editIndex} : s))
            );
            setEditIndex(null);
            setEditData({});
        } else {
            alert("Eroare la salvare!");
        }
    };


    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = sportivi.filter((s) =>
            s.nume.toLowerCase().includes(term) ||
            s.categorie?.toLowerCase().includes(term) ||
            s.grad?.toLowerCase().includes(term) ||
            s.gen?.toLowerCase().includes(term) ||
            s.concurs?.toLowerCase().includes(term)
        );

        setFilteredSportivi(filtered);
    };


    return (
        <>
            <Navbar/>
            <div className="inscrisi-container">
                <h2>Sportivi înscriși la concursuri</h2>


                <input
                    type="text"
                    className="search-bar"
                    placeholder="Caută după nume, categorie, centură, concurs..."
                    value={searchTerm}
                    onChange={handleSearch}
                />


                <table className="inscrisi-table">
                    <thead>
                    <tr>
                        <th>Nume</th>
                        <th>Gen</th>
                        <th>Categoria</th>
                        <th>Grad</th>
                        <th>Greutate</th>
                        <th>Probe</th>
                        <th>Concurs</th>
                        <th>Data nașterii</th>
                        <th>Acțiuni</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredSportivi.map((s, idx) => (
                        <tr key={s.id}>
                            {editIndex === s.id ? (
                                <>
                                    <td><input value={editData.nume}
                                               onChange={e => setEditData({...editData, nume: e.target.value})}/></td>
                                    <td>
                                        <select value={editData.gen}
                                                onChange={e => setEditData({...editData, gen: e.target.value})}>
                                            <option value="">-</option>
                                            <option value="Masculin">Masculin</option>
                                            <option value="Feminin">Feminin</option>
                                        </select>
                                    </td>
                                    <td><input value={editData.categorie}
                                               onChange={e => setEditData({...editData, categorie: e.target.value})}/>
                                    </td>
                                    <td><input value={editData.grad}
                                               onChange={e => setEditData({...editData, grad: e.target.value})}/></td>
                                    <td><input value={editData.greutate}
                                               onChange={e => setEditData({...editData, greutate: e.target.value})}/>
                                    </td>
                                    <td><input value={editData.probe}
                                               onChange={e => setEditData({...editData, probe: e.target.value})}/></td>
                                    <td><input value={editData.concurs}
                                               onChange={e => setEditData({...editData, concurs: e.target.value})}/>
                                    </td>
                                    <td><input type="date" value={editData.data_nasterii} onChange={e => setEditData({
                                        ...editData,
                                        data_nasterii: e.target.value
                                    })}/></td>
                                    <td>
                                        <button onClick={handleSave} style={{backgroundColor: "lime"}}>💾</button>
                                        <button onClick={handleCancel} style={{backgroundColor: "gray"}}>❌</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{s.nume}</td>
                                    <td>{s.gen}</td>
                                    <td>{s.categorie}</td>
                                    <td>{s.grad}</td>
                                    <td>{s.greutate} kg</td>
                                    <td>{s.probe}</td>
                                    <td>{s.concurs}</td>
                                    <td>{s.data_nasterii}</td>
                                    <td>
                                        <button onClick={() => handleEdit(s)} style={{marginRight: "6px"}}>✏️</button>
                                        <button onClick={() => handleDelete(s.id)}>🗑️</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}

                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AdminInscrisiConcurs;
