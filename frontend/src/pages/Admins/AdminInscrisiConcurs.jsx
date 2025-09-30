import React, {useEffect, useState} from "react";
import Navbar from "../../components/Navbar";
import {useNavigate} from "react-router-dom";
import "../../../static/css/AdminInscrisiConcurs.css";
import {API_BASE} from "../../config";

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

    fetch(`${API_BASE}/api/inscrisi_concursuri`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setSportivi(data.sportivi);
          setFilteredSportivi(data.sportivi);
        }
      });
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Ești sigur că vrei să ștergi această înscriere?")) return;

    const res = await fetch(`${API_BASE}/api/delete_inscriere/${id}`, { method: "DELETE" });

    if (res.ok) {
      const updated = sportivi.filter((s) => s.id !== id);
      setSportivi(updated);
      setFilteredSportivi(filterList(updated, searchTerm));
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
    const res = await fetch(`${API_BASE}/api/update_inscriere/${editIndex}`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(editData)
    });

    if (res.ok) {
      const updatedList = sportivi.map((s) =>
        s.id === editIndex ? {...editData, id: editIndex} : s
      );
      setSportivi(updatedList);
      setFilteredSportivi(filterList(updatedList, searchTerm));
      setEditIndex(null);
      setEditData({});
    } else {
      alert("Eroare la salvare!");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredSportivi(filterList(sportivi, term));
  };

  const filterList = (list, term) =>
    list.filter((s) =>
      s.nume.toLowerCase().includes(term) ||
      s.categorie?.toLowerCase().includes(term) ||
      s.grad?.toLowerCase().includes(term) ||
      s.gen?.toLowerCase().includes(term) ||
      s.concurs?.toLowerCase().includes(term)
    );

  return (
    <>
      <Navbar/>
      {/* adăugăm un scope clar: admin-inscrisi */}
      <div className="inscrisi-container admin-inscrisi">
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
          {filteredSportivi.map((s) => (
            <tr
              key={s.id}
              className={editIndex === s.id ? "row-editing" : ""}
            >
              {editIndex === s.id ? (
                <>
                  <td>
                    <input
                      value={editData.nume || ""}
                      onChange={e => setEditData({...editData, nume: e.target.value})}
                    />
                  </td>
                  <td>
                    <select
                      value={editData.gen || ""}
                      onChange={e => setEditData({...editData, gen: e.target.value})}
                    >
                      <option value="">-</option>
                      <option value="Masculin">Masculin</option>
                      <option value="Feminin">Feminin</option>
                    </select>
                  </td>
                  <td>
                    <input
                      value={editData.categorie || ""}
                      onChange={e => setEditData({...editData, categorie: e.target.value})}
                    />
                  </td>
                  <td>
                    <input
                      value={editData.grad || ""}
                      onChange={e => setEditData({...editData, grad: e.target.value})}
                    />
                  </td>
                  <td>
                    <input
                      value={editData.greutate || ""}
                      onChange={e => setEditData({...editData, greutate: e.target.value})}
                    />
                  </td>
                  <td>
                    <input
                      value={editData.probe || ""}
                      onChange={e => setEditData({...editData, probe: e.target.value})}
                    />
                  </td>
                  <td>
                    <input
                      value={editData.concurs || ""}
                      onChange={e => setEditData({...editData, concurs: e.target.value})}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={editData.data_nasterii || ""}
                      onChange={e => setEditData({...editData, data_nasterii: e.target.value})}
                    />
                  </td>
                  <td>
                    <button className="btn-primary" onClick={handleSave}>Salvează</button>
                    <button className="btn-secondary" onClick={handleCancel}>Anulează</button>
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
                    <button className="btn-primary" onClick={() => handleEdit(s)}>Editează</button>
                    <button className="btn-danger" onClick={() => handleDelete(s.id)}>Șterge</button>
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
