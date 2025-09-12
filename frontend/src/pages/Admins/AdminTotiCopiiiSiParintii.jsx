import React, {useEffect, useState} from "react";
import Navbar from "../../components/Navbar";
import {useNavigate} from "react-router-dom";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/AdminTotiCopiiiSiParintii.css";

const AdminTotiCopiiiSiParintii = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const rol = localStorage.getItem("rol");
    if (rol !== "admin") {
      navigate("/access-denied");
      return;
    }

    const fetchCopii = async () => {
      const res = await fetch("http://localhost:5000/api/toti_copiii");
      const result = await res.json();
      if (result.status === "success") setData(result.date);
    };

    fetchCopii();
  }, [navigate]);

  const initialFrom = (s = "") => (s.trim()[0] || "P").toUpperCase();

  return (
    <>
      <Navbar/>
      <div className="atcp-page">
        <div className="atcp-inner">
          <h2 className="atcp-title">Toți copiii înregistrați ai părinților</h2>

          {data.length === 0 ? (
            <p className="atcp-empty">Nu există date disponibile.</p>
          ) : (
            <div className="parent-grid">
              {data.map((entry, index) => (
                <section className="parent-card" key={index}>
                  <header className="parent-head">
                    <div className="avatar">{initialFrom(entry.parinte?.username)}</div>
                    <div className="parent-meta">
                      <h4 className="parent-name">{entry.parinte?.username}</h4>
                      <div className="parent-email">{entry.parinte?.email}</div>
                    </div>
                    <span className="kids-badge">{entry.copii?.length || 0} copii</span>
                  </header>

                  <ul className="kids-list">
                    {entry.copii.map((copil, i) => (
                      <li className="kid-item" key={i}>
                        <div className="kid-row">
                          <span className="label">Nume:</span>
                          <strong>{copil.nume}</strong>
                        </div>
                        <div className="kid-row">
                          <span className="label">Gen:</span>
                          <span>{copil.gen ?? "N/A"}</span>
                        </div>
                        <div className="kid-row">
                          <span className="label">Vârstă:</span>
                          <span>{copil.varsta} ani</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminTotiCopiiiSiParintii;
