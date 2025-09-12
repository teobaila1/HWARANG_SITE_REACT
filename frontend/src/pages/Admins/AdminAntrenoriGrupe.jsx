import React, {useEffect, useState} from "react";
import Navbar from "../../components/Navbar";
import {useNavigate} from "react-router-dom";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/AdminAntrenoriGrupe.css";

const AdminAntrenoriGrupe = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const rol = localStorage.getItem("rol");
    if (rol !== "admin") {
      navigate("/access-denied");
      return;
    }

    fetch("http://localhost:5000/api/toate_grupele_antrenori")
      .then(res => res.json())
      .then(json => {
        if (json.status === "success") {
          setData(json.data);
        }
      });
  }, []);

  const initialFromName = (name = "") => (name.trim()[0] || "A").toUpperCase();

  return (
    <>
      <Navbar/>
      <div className="aag-page">
        <div className="aag-inner">
          <h2 className="aag-title">Grupele tuturor antrenorilor</h2>

          {data.map((antrenorData, index) => (
            <section key={index} className="coach-section">
              <div className="coach-head">
                <div className="coach-avatar">{initialFromName(antrenorData.antrenor)}</div>
                <div className="coach-meta">
                  <h3 className="coach-name">{antrenorData.antrenor}</h3>
                  <div className="coach-sub">Grupe: <strong>{antrenorData.grupe?.length || 0}</strong></div>
                </div>
              </div>

              <div className="groups-grid">
                {antrenorData.grupe.map((grupaData, idx) => (
                  <div key={idx} className="group-card">
                    <div className="group-head">
                      <h4 className="group-name">{grupaData.grupa}</h4>
                      <span className="chip">{grupaData.copii?.length || 0} sportivi</span>
                    </div>

                    <ul className="athlete-list">
                      {grupaData.copii.map((copil, i) => (
                        <li key={i} className="athlete-item">
                          <div className="athlete-name">
                            <span className="label">Nume:</span>
                            <strong>{copil.nume}</strong>
                          </div>
                          <div className="athlete-field">
                            <span className="label">Gen:</span>
                            <span>{copil.gen ?? "N/A"}</span>
                          </div>
                          <div className="athlete-field">
                            <span className="label">Vârstă:</span>
                            <span>{copil.varsta} ani</span>
                          </div>
                          <div className="athlete-field">
                            <span className="label">Părinte:</span>
                            <span>{grupaData.parinte?.username}</span>
                          </div>
                          <div className="athlete-field">
                            <span className="label">Email părinte:</span>
                            <span className="email">{grupaData.parinte?.email}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminAntrenoriGrupe;
