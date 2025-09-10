import React, {useEffect, useState} from "react";
import Navbar from "../../components/Navbar";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/EvidentaPlati.css";

function EvidentaPlati() {
    const [plati, setPlati] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        copil_nume: "",
        luna: "",
        suma: "",
        tip_plata: "cash",
        status: "neplatit",
    });
    const [editingPlata, setEditingPlata] = useState(null); // aici salvăm obiectul, nu doar id-ul
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredPlati, setFilteredPlati] = useState([]);

    useEffect(() => {
        fetch("/api/plati/filtrate")
            .then((res) => res.json())
            .then((data) => {
                setPlati(data);
                setFilteredPlati(data); // ← foarte important!
            });
    }, []);

    const reloadPlati = () => {
        fetch("/api/plati/filtrate")
            .then((res) => res.json())
            .then((data) => {
                setPlati(data);
                setFilteredPlati(data); // ← fără asta, căutarea nu mai funcționează
                setFormData({
                    copil_nume: "",
                    luna: "",
                    suma: "",
                    tip_plata: "cash",
                    status: "neplatit",
                });
                setEditingPlata(null);
                setShowForm(false);
            });
    };


    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = () => {
        const method = editingPlata && editingPlata.id ? "PUT" : "POST";
        const url = editingPlata && editingPlata.id
            ? `/api/plati/${editingPlata.id}`
            : "/api/plati";

        formData.copil_nume = formData.copil_nume.trim().toUpperCase();
        formData.luna = formData.luna.trim().toLowerCase();
        fetch(url, {
            method: method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Eroare la salvare");
                return res.json();
            })
            .then(() => reloadPlati())
            .catch((err) => {
                console.error("Eroare:", err);
                alert("Eroare la trimiterea datelor");
            });
    };

    const handleEdit = (plata) => {
        // Dacă formularul e deja deschis pe acea plată, îl închidem
        if (editingPlata && editingPlata.id === plata.id) {
            setShowForm(false);
            setEditingPlata(null);
            setFormData({
                copil_nume: "",
                luna: "",
                suma: "",
                tip_plata: "cash",
                status: "neplatit",
            });
            return;
        }

        // Altfel, deschidem formularul pentru editare
        setFormData({
            copil_nume: plata.copil_nume,
            luna: plata.luna ?? "",
            suma: plata.suma ?? "",
            tip_plata: plata.tip_plata ?? "cash",
            status: plata.status ?? "neplatit",
        });
        setEditingPlata(plata);
        setShowForm(true);
    };

    const deletePlata = (id) => {
        if (!id) return;

        const confirmDelete = window.confirm("Ești sigur că vrei să ștergi această plată?");
        if (!confirmDelete) return;

        fetch(`/api/plati/${id}`, {method: "DELETE"})
            .then(() => setPlati((prev) => prev.filter((p) => p.id !== id)));
    };


    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtrate = plati.filter(p =>
            (p.copil_nume?.toLowerCase().includes(term) || "") ||
            (p.parinte_nume?.toLowerCase().includes(term) || "") ||
            (p.luna?.toLowerCase().includes(term) || "")
        );
        setFilteredPlati(filtrate);
    };


    return (
        <>
            <Navbar/>
            <div className="evidenta-container">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Caută după copil, părinte sau lună..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <h2>Tabel Plăți</h2>
                {/*<button*/}
                {/*    onClick={() => {*/}
                {/*        setShowForm(!showForm);*/}
                {/*        setEditingPlata(null);*/}
                {/*        setFormData({*/}
                {/*            copil_nume: "",*/}
                {/*            luna: "",*/}
                {/*            suma: "",*/}
                {/*            tip_plata: "cash",*/}
                {/*            status: "neplatit",*/}
                {/*        });*/}
                {/*    }}*/}
                {/*    style={{marginBottom: "10px"}}*/}
                {/*>*/}
                {/*    ➕ Adaugă Plată*/}
                {/*</button>*/}

                {showForm && (
                    <div className="plata-form">
                        <h4>{editingPlata && editingPlata.id ? "Editează Plată" : "Adaugă Plată"}</h4>
                        <input
                            name="copil_nume"
                            placeholder="Copil"
                            value={formData.copil_nume}
                            onChange={handleChange}
                        />
                        <input
                            name="luna"
                            placeholder="Lună"
                            value={formData.luna}
                            onChange={handleChange}
                        />
                        <input
                            name="suma"
                            placeholder="Sumă"
                            type="number"
                            value={formData.suma}
                            onChange={handleChange}
                        />
                        <select name="tip_plata" value={formData.tip_plata} onChange={handleChange}>
                            <option value="cash">Cash</option>
                            <option value="card">Card</option>
                        </select>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="platit">Plătit</option>
                            <option value="neplatit">Neplătit</option>
                        </select>
                        <button onClick={handleSubmit}>
                            {editingPlata && editingPlata.id ? "💾 Salvează" : "✅ Adaugă"}
                        </button>
                    </div>
                )}

                <table>
                    <thead>
                    <tr>
                        <th>COPIL</th>
                        <th>PĂRINTE</th>
                        <th>LUNĂ</th>
                        <th>SUMĂ</th>
                        <th>TIP PLATĂ</th>
                        <th>STATUS</th>
                        <th>ACȚIUNI</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredPlati.map((p, i) => (
                        <tr key={p.id ?? `${p.copil_nume}-${i}`}>
                            <td>{p.copil_nume}</td>
                            <td>{p.parinte_nume}</td>
                            <td>{p.luna || "-"}</td>
                            <td>{p.suma != null ? `${p.suma} RON` : "-"}</td>
                            <td>{p.tip_plata || "-"}</td>
                            <td>{p.status}</td>
                            <td>
                                <button onClick={() => handleEdit(p)}>Editeaza</button>
                                <button
                                    onClick={() => deletePlata(p.id)}
                                    disabled={!p.id}
                                    style={{
                                        opacity: p.id ? 1 : 0.4,
                                        cursor: p.id ? "pointer" : "not-allowed",
                                    }}
                                >
                                    Sterge
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <Navbar/>
        </>
    );
}

export default EvidentaPlati;
