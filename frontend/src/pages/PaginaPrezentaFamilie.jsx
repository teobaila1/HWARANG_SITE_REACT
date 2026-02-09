import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TabelPrezenta from '../components/TabelPrezenta';
import { API_BASE } from '../config';

const PaginaPrezentaFamilie = () => {
    const [copii, setCopii] = useState([]);
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 1. Încărcăm lista de copii a părintelui
    useEffect(() => {
        const fetchCopii = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`${API_BASE}/api/copiii_mei`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();

                if (Array.isArray(data) && data.length > 0) {
                    setCopii(data);
                    // Selectăm automat primul copil din listă
                    setSelectedChildId(data[0].id);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCopii();
    }, []);

    // --- STILURI BUTOANE MICI (TAB-URI) ---
    const styles = {
        tabContainer: {
            display: 'flex',
            gap: '8px',              // Spațiu mic între ele
            marginBottom: '20px',
            flexWrap: 'wrap',
            justifyContent: 'center' // Centrate frumos
        },
        tabButton: (isActive) => ({
            padding: '6px 16px',         // <--- MULT MAI MICI (Padding redus)
            backgroundColor: isActive ? '#d32f2f' : '#222',
            color: isActive ? 'white' : '#aaa',
            border: isActive ? '1px solid #d32f2f' : '1px solid #444',
            borderRadius: '20px',        // Formă de "pilulă"
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem',          // <--- Text mai finuț
            transition: 'all 0.2s ease',
            outline: 'none',
            minWidth: 'auto'             // <--- Nu le lățim forțat
        })
    };

    return (
        <>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '100%', margin: '0 auto', color: 'white' }}>

                {/* Header cu Buton Înapoi */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Prezențe la sală</h2>
                </div>

                {loading ? (
                    <p style={{ textAlign: 'center', color: '#888' }}>Se încarcă lista copiilor...</p>
                ) : copii.length === 0 ? (
                    <p style={{ textAlign: 'center' }}>Nu ai copii înregistrați.</p>
                ) : (
                    <>
                        {/* --- LISTA DE TAB-URI (NUMELE COPIILOR) --- */}
                        <div style={styles.tabContainer}>
                            {copii.map(copil => (
                                <button
                                    key={copil.id}
                                    onClick={() => setSelectedChildId(copil.id)}
                                    style={styles.tabButton(selectedChildId === copil.id)}
                                >
                                    {copil.nume}
                                </button>
                            ))}
                        </div>

                        {/* --- TABELUL CARE SE SCHIMBĂ ÎN FUNCȚIE DE TAB --- */}
                        {selectedChildId && (
                            <div className="fade-in-animation">
                                <TabelPrezenta idCopil={selectedChildId} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default PaginaPrezentaFamilie;