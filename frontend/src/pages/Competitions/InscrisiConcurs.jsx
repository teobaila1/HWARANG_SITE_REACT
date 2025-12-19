import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../../static/css/InscrisiConcurs.css";
import {API_BASE} from "../../config";

const InscrisiConcurs = () => {
  const {numeConcurs} = useParams();
  const [inscrisi, setInscrisi] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchInscrisi = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/inscrisi_concurs/${encodeURIComponent(numeConcurs)}`);
        const data = await res.json();
        setInscrisi(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchInscrisi();
  }, [numeConcurs]);

  const normalize = (v) => (v ?? "").toString().toLowerCase();
  const q = normalize(searchTerm).trim();

  const inscrisiFiltrati = q
    ? inscrisi.filter((p) => {
        const haystack = [
          p.nume,
          p.probe,
          p.grad_centura,
          p.gen,
          p.categorie_varsta,
          p.data_nasterii,
        ]
          .map(normalize)
          .join(" ");
        return haystack.includes(q);
      })
    : inscrisi;

  return (
    <>
      <Navbar/>
      <div className="inscrisi-container">
        <h2 className="inscrisi-title">Înscriși la: {numeConcurs}</h2>

        {/* Căutare locală */}
        <input
          type="text"
          className="input-cautare inscrisi-cautare"
          placeholder="Caută după nume, probe, centură, gen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Caută în lista de înscriși"
        />
        <div className="inscrisi-stats">
          {inscrisiFiltrati.length} rezultate
          {q && ` (din ${inscrisi.length})`}
        </div>

        <table className="inscrisi-table">
          <thead>
            <tr>
              <th>Nume</th>
              <th>Data nașterii</th>
              <th>Vârstă</th>
              <th>Centură</th>
              <th>Greutate</th>
              <th>Probe</th>
              <th>Gen</th>
            </tr>
          </thead>
          <tbody>
            {inscrisiFiltrati.map((p, i) => (
              <tr key={i}>
                <td data-label="Nume">{p.nume}</td>
                <td data-label="Data nașterii">{p.data_nasterii}</td>
                <td data-label="Vârstă">{p.categorie_varsta}</td>
                <td data-label="Centură">{p.grad_centura}</td>
                <td data-label="Greutate">{p.greutate} kg</td>
                <td data-label="Probe">{p.probe}</td>
                <td data-label="Gen">{p.gen}</td>
              </tr>
            ))}

            {inscrisiFiltrati.length === 0 && (
                <tr>
                    <td colSpan="7" style={{textAlign: 'center', padding: '20px', color: '#888'}}>
                        Nu există înscrieri care să corespundă căutării.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default InscrisiConcurs;