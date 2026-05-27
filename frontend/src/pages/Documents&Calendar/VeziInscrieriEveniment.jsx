import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import "../../../static/css/VeziInscrieriEvenimente.css";

const API_BASE_URL = "https://backend-hwarang-new.onrender.com";

const VeziInscrieriEveniment = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const eveniment = location.state?.eveniment;
    const isExamen = eveniment?.titlu?.toLowerCase().includes('examen');

    const [inscrieri, setInscrieri] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!eveniment) {
            navigate("/calendar");
            return;
        }
        fetchInscrieri();
    }, [eveniment, navigate]);

    const fetchInscrieri = () => {
        const token = localStorage.getItem("token");
        fetch(`${API_BASE_URL}/api/calendar/evenimente/${id}/inscrieri`, {
            headers: { 'x-access-token': token }
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                setInscrieri(data);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error("Eroare preluare inscrieri:", err);
            setLoading(false);
        });
    };

    if (!eveniment) return null;

    return (
        <div className="vie-wrapper">
            <Navbar />
            <div className="vie-container">
                <div className="vie-header">
                    <h1>Participanți: {eveniment.titlu}</h1>
                    <button className="vie-btn-cancel" onClick={() => navigate("/calendar_club")}>
                        <i className="fas fa-arrow-left"></i> Înapoi
                    </button>
                </div>

                <div className="vie-stat-bar">
                    <span className="vie-lbl">Total înscriși</span>
                    <span className="vie-val">{inscrieri.length}<small>participanți</small></span>
                </div>

                {loading ? (
                    <div className="vie-state">
                        <i className="fas fa-spinner fa-spin"></i>
                        Se încarcă lista...
                    </div>
                ) : inscrieri.length === 0 ? (
                    <div className="vie-state">
                        <i className="fas fa-user-slash"></i>
                        Niciun participant înscris momentan.
                    </div>
                ) : (
                    <div className="vie-list">
                        {inscrieri.map((participant, index) => (
                            <div className="vie-card" key={index}>
                                <div className="vie-num">{index + 1}</div>
                                <div className="vie-body">
                                    <div className="vie-name">{participant.nume} {participant.prenume}</div>
                                    <div className="vie-meta">
                                        <span className="vie-grad">
                                            Grad: <b>{participant.grad_curent || "-"}</b>
                                        </span>
                                        {isExamen && participant.grad_viitor && (
                                            <span className="vie-exam">→ {participant.grad_viitor}</span>
                                        )}
                                    </div>
                                </div>
                                <span className={`vie-tag ${participant.tip_inscriere === 'Profil' ? 'cont' : 'manual'}`}>
                                    {participant.tip_inscriere === 'Profil' ? 'Din cont' : 'Manual'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VeziInscrieriEveniment;