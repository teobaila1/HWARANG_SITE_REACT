import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Navbar from "../../components/Navbar";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/InscrisiConcurs.css";

const InscrisiConcurs = () => {
  const {numeConcurs} = useParams();
  const [inscrisi, setInscrisi] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchInscrisi = async () => {
      const res = await fetch(`http://localhost:5000/api/inscrisi_concurs/${encodeURIComponent(numeConcurs)}`);
      const data = await res.json();
      setInscrisi(data);
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
                <td>{p.nume}</td>
                <td>{p.data_nasterii}</td>
                <td>{p.categorie_varsta}</td>
                <td>{p.grad_centura}</td>
                <td>{p.greutate} kg</td>
                <td>{p.probe}</td>
                <td>{p.gen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default InscrisiConcurs;
