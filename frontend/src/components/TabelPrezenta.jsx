import React, { useState, useEffect } from 'react';
import "../../static/css/TabelPrezenta.css";

// Adaugă prop-ul idCopil
const TabelPrezenta = ({ idGrupa, idCopil }) => {
    const [sportivi, setSportivi] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataCurenta, setDataCurenta] = useState(new Date());

    useEffect(() => {
        // Dacă nu avem niciun ID, nu facem nimic
        if (!idGrupa && !idCopil) return;
        fetchPrezente();
        // eslint-disable-next-line
    }, [idGrupa, idCopil, dataCurenta]);

    const fetchPrezente = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const luna = dataCurenta.getMonth() + 1;
            const an = dataCurenta.getFullYear();

            // --- LOGICĂ NOUĂ AICI ---
            // Alegem URL-ul în funcție de ce ID am primit
            let url = "";
            if (idGrupa) {
                url = `https://backend-hwarang-new.onrender.com/api/prezenta/grupa/${idGrupa}?luna=${luna}&an=${an}`;
            } else if (idCopil) {
                url = `https://backend-hwarang-new.onrender.com/api/prezenta/copil_calendar/${idCopil}?luna=${luna}&an=${an}`;
            }
            // ------------------------

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const result = await response.json();
            if (result.status === 'success') {
                setSportivi(result.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ... RESTUL CODULUI RĂMÂNE EXACT LA FEL ...
    const changeMonth = (offset) => {
        const nouaData = new Date(dataCurenta);
        nouaData.setMonth(nouaData.getMonth() + offset);
        setDataCurenta(nouaData);
    };

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const daysInMonth = getDaysInMonth(dataCurenta.getFullYear(), dataCurenta.getMonth());
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const lunaNume = dataCurenta.toLocaleString('ro-RO', { month: 'long', year: 'numeric' });
    const lunaNumeCapitalized = lunaNume.charAt(0).toUpperCase() + lunaNume.slice(1);

    return (
        <div className="tp-container">
            <div className="tp-header">
                <button className="tp-btn-nav" onClick={() => changeMonth(-1)}>❮</button>
                <h3 className="tp-title">{lunaNumeCapitalized}</h3>
                <button className="tp-btn-nav" onClick={() => changeMonth(1)}>❯</button>
            </div>

            {loading ? (
                <p className="tp-msg">Se încarcă datele...</p>
            ) : sportivi.length === 0 ? (
                <p className="tp-msg">Niciun sportiv găsit.</p>
            ) : (
                <div className="tp-table-wrapper">
                    <table className="tp-table">
                        <thead>
                            <tr>
                                <th className="tp-th tp-sticky-col">Nume Sportiv</th>
                                <th className="tp-th">Tot</th>
                                {daysArray.map(day => (
                                    <th key={day} className="tp-th">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sportivi.map(s => (
                                <tr key={s.id}>
                                    <td className="tp-sticky-col" title={s.nume}>{s.nume}</td>
                                    <td className="tp-td">
                                        <span className="tp-total-badge">{s.total}</span>
                                    </td>
                                    {daysArray.map(day => {
                                        const isPresent = s.zile.includes(day);
                                        return (
                                            <td key={day} className="tp-td">
                                                {isPresent && <span className="tp-check">✔</span>}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TabelPrezenta;