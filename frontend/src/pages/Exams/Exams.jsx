import React, { useState, useEffect } from "react";
import "../../../static/css/EligibilitateExamen.css";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";

const API_BASE_URL = "https://backend-hwarang-new.onrender.com";

const EligibilitateExamen = () => {
    const [sportivi, setSportivi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // State-uri pentru Modalul de Examen
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSportiv, setSelectedSportiv] = useState(null);
    const [formData, setFormData] = useState({
        centura: "",
        data_examen: new Date().toISOString().split("T")[0],
        feedback: ""
    });

    // State-uri pentru Modalul de Editare Profil
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({ id: "", nume: "", cnp: "", tip: "" });

    const fetchEligibilitate = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${API_BASE_URL}/api/sportivi/eligibilitate`, {
                headers: { 'x-access-token': token }
            });
            if (!response.ok) throw new Error("Eroare la preluarea datelor");
            const data = await response.json();
            setSportivi(data);
        } catch (error) {
            console.error("Eroare:", error);
            toast.error("Nu s-au putut încărca sportivii.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEligibilitate();
    }, []);

    // Deschidere modal Examen
    const handleOpenModal = (sportiv) => {
        setSelectedSportiv(sportiv);
        setFormData({
            centura: "",
            data_examen: new Date().toISOString().split("T")[0],
            feedback: ""
        });
        setIsModalOpen(true);
    };

    // Deschidere modal Editare Profil
    const handleOpenEditModal = (sportiv) => {
        setEditData({
            id: sportiv.id,
            nume: sportiv.nume,
            cnp: sportiv.cnp === "Necompletat" ? "" : sportiv.cnp,
            data_nasterii: sportiv.data_nasterii || "",
            tip: sportiv.tip
        });
        setIsEditModalOpen(true);
    };

    // Salvare Examen
    const handleSaveExamen = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!formData.centura) {
            toast.warning("Te rog să selectezi noua centură!");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/sportivi/examen/salvare`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                },
                body: JSON.stringify({
                    sportiv_id: selectedSportiv.id,
                    centura: formData.centura,
                    data_examen: formData.data_examen,
                    feedback: formData.feedback
                })
            });

            const result = await response.json();

            if (response.ok && result.status === "success") {
                toast.success("Examenul a fost salvat cu succes!");
                setIsModalOpen(false);
                fetchEligibilitate();
            } else {
                toast.error(result.message || "Eroare la salvare.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Eroare de conexiune la server.");
        }
    };

    // Salvare Editare Profil
    const handleUpdateProfil = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${API_BASE_URL}/api/sportivi/actualizeaza`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                },
                body: JSON.stringify(editData)
            });

            const result = await response.json();

            if (response.ok && result.status === "success") {
                toast.success("Datele au fost actualizate!");
                setIsEditModalOpen(false);
                fetchEligibilitate();
            } else {
                toast.error(result.message || "Eroare la actualizare.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Eroare de conexiune.");
        }
    };

const getBeltBadgeStyle = (beltName) => {
        if (!beltName) return { background: '#fff', color: '#000' };
        
        const baseBorder = {
            borderTop: '1px solid #ccc',
            borderRight: '1px solid #ccc',
            borderBottom: '1px solid #ccc'
        };

        // 1. Centura Albă simplă
        if (beltName === '10 Gup - Albă' || (beltName.includes('Albă') && !beltName.includes('tresă'))) {
            return { background: '#f8f9fa', color: '#222', border: '1px solid #ccc' };
        }
        
        // 2. Tresa Galbenă (Albă cu tresă galbenă)
        if (beltName.includes('tresă galbenă')) {
            return { 
                background: '#f8f9fa', 
                color: '#222', 
                ...baseBorder,
                borderLeft: '6px solid #f1c40f' 
            };
        }
        
        // 3. Galbenă simplă
        if (beltName.includes('Galbenă') && !beltName.includes('tresă')) {
            return { background: 'linear-gradient(135deg, #f1c40f, #d4ac0d)', color: '#000', boxShadow: '0 0 8px rgba(241, 196, 15, 0.4)' };
        }

        // 4. Tresa Verde (Galbenă cu tresă verde)
        if (beltName.includes('tresă verde')) {
            return { 
                background: '#f1c40f', 
                color: '#000', 
                ...baseBorder,
                borderLeft: '6px solid #2ecc71', 
                boxShadow: '0 0 8px rgba(241, 196, 15, 0.3)' 
            };
        }

        // 5. Verde simplă
        if (beltName.includes('Verde') && !beltName.includes('tresă')) {
            return { background: 'linear-gradient(135deg, #2ecc71, #27ae60)', color: '#fff', boxShadow: '0 0 8px rgba(46, 204, 113, 0.4)' };
        }

        // 6. Tresa Albastră (Verde cu tresă albastră)
        if (beltName.includes('tresă albastră')) {
            return { 
                background: '#2ecc71', 
                color: '#fff', 
                ...baseBorder,
                borderLeft: '6px solid #3498db', 
                boxShadow: '0 0 8px rgba(46, 204, 113, 0.3)' 
            };
        }

        // 7. Albastră simplă
        if (beltName.includes('Albastră') && !beltName.includes('tresă')) {
            return { background: 'linear-gradient(135deg, #3498db, #2980b9)', color: '#fff', boxShadow: '0 0 8px rgba(52, 152, 219, 0.4)' };
        }

        // 8. Tresa Roșie (Albastră cu tresă roșie)
        if (beltName.includes('tresă roșie')) {
            return { 
                background: '#3498db', 
                color: '#fff', 
                ...baseBorder,
                borderLeft: '6px solid #e74c3c', 
                boxShadow: '0 0 8px rgba(52, 152, 219, 0.3)' 
            };
        }

        // 9. Roșie simplă
        if (beltName.includes('Roșie') && !beltName.includes('tresă')) {
            return { background: 'linear-gradient(135deg, #e74c3c, #c0392b)', color: '#fff', boxShadow: '0 0 8px rgba(231, 76, 60, 0.4)' };
        }

        // 10. Tresa Neagră (Roșie cu tresă neagră)
        if (beltName.includes('tresă neagră')) {
            return { 
                background: '#e74c3c', 
                color: '#fff', 
                ...baseBorder,
                borderLeft: '6px solid #111', 
                boxShadow: '0 0 8px rgba(231, 76, 60, 0.3)' 
            };
        }

        // 11. Centuri Negre / Dane
        if (beltName.includes('Dan') || beltName.includes('Neagră')) {
            return { 
                background: 'linear-gradient(135deg, #2c3e50, #000000)', 
                color: '#f1c40f', 
                border: '1px solid #f1c40f', 
                boxShadow: '0 0 10px rgba(241, 196, 15, 0.5)' 
            };
        }

        return { background: '#7f8c8d', color: '#fff' };
    };

    // Funcție ajutătoare mică pentru verificare
    function beltname_include_tresa(name) {
        return name.includes('tresă');
    }

    const sportiviFiltrati = sportivi.filter(sportiv => 
        sportiv.nume.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (sportiv.cnp && sportiv.cnp.includes(searchTerm))
    );

    return (
        <>
        <Navbar/>
        <div className="gradare-container">
            <h2 className="gradare-title">Sportivi Eligibili pentru Examen</h2>
            
            <div className="search-bar-dark">
                <i className="fas fa-search"></i>
                <input 
                    type="text" 
                    placeholder="Caută sportiv după nume sau CNP..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div style={{color: "white", textAlign: "center", marginTop: "50px"}}>
                    Se calculează eligibilitatea... <i className="fas fa-spinner fa-spin"></i>
                </div>
            ) : (
                <div className="sportivi-list">
                    {sportiviFiltrati.length === 0 && (
                        <p style={{color: "#888"}}>Niciun sportiv găsit.</p>
                    )}

                    {sportiviFiltrati.map(sportiv => (
                        <div className="sportiv-card-dark animated-card" key={sportiv.id}>
                            <div className="card-left">
                                <div className="avatar-placeholder">
                                    {sportiv.nume.charAt(0)}
                                </div>
                                <div className="sportiv-info">
                                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
                                        <h3>{sportiv.nume}</h3>
                                        {/* Categoria calculată automat în timp real după vârstă */}
                                        <span className="badge-tip senior">
                                            {sportiv.categorie} ({sportiv.varsta} ani)
                                        </span>
                                        {/* <span className={`badge-tip ${sportiv.tip}`}>
                                            {sportiv.tip === 'utilizator' ? 'Senior' : 'Junior'}
                                        </span> */}
                                    </div>
                                    <p className="club-name">ACS HWARANG ACADEMY</p>
                                    
                                    {/* Centura animată / stilizată */}
                                    <div className="belt-info">
                                        <span className="belt-animated-badge" style={getBeltBadgeStyle(sportiv.centura)}>
                                            {sportiv.centura}
                                        </span>
                                    </div>

                                    <p className="cnp-info">
                                        CNP: <span className="cnp-number">{sportiv.cnp}</span>
                                    </p>

                                    <p className="cnp-info" style={{ marginTop: "4px" }}>
                                        Data Nașterii: <span style={{ color: "#ddd" }}>{sportiv.data_nasterii || "Nespecificată"}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="card-right">
                                <div className="eligibility-status">
                                    <small>Ultimul examen:</small>
                                    <strong>{sportiv.data_ultimului_examen}</strong>
                                    
                                    
                                    <div className="stats-row">
                                        <span className={sportiv.luni_trecute >= 3 ? "good" : "bad"}>
                                            <i className="fas fa-calendar-alt"></i> {sportiv.text_timp}
                                        </span>
                                    </div>
                                    
                                    {sportiv.este_eligibil ? (
                                        <span className="badge-eligibil">ELIGIBIL EXAMEN</span>
                                    ) : (
                                        <span className="badge-asteptare">NECESITĂ TIMP</span>
                                    )}
                                </div>
                                
                                <div className="card-actions" style={{display: "flex", gap: "8px", marginTop: "15px"}}>
                                    <button 
                                        className="btn-editeaza" 
                                        onClick={() => handleOpenEditModal(sportiv)}
                                        style={{padding: "8px 12px", backgroundColor: "#333", color: "#ccc", border: "1px solid #555", borderRadius: "8px", cursor: "pointer", fontWeight: "bold"}}
                                    >
                                        <i className="fas fa-edit"></i> Editează
                                    </button>
                                    
                                    <button 
                                        className="btn-valideaza" 
                                        onClick={() => handleOpenModal(sportiv)}
                                        style={{padding: "8px 16px", backgroundColor: "#d91e18", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold"}}
                                    >
                                        <i className="fas fa-award"></i> Validează Examen
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Validează Examen */}
            {isModalOpen && selectedSportiv && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Acordare Grad: {selectedSportiv.nume}</h3>
                        <p style={{color: "#888", fontSize: "0.9rem", marginBottom: "20px"}}>
                            Centura actuală: <strong>{selectedSportiv.centura}</strong>
                        </p>
                        
                        <form onSubmit={handleSaveExamen}>
                            <div className="form-group">
                                <label>Noua Centură Obținută:</label>
                                <select 
                                    value={formData.centura} 
                                    onChange={(e) => setFormData({...formData, centura: e.target.value})}
                                    required
                                >
                                    <option value="">-- Selectează Centura --</option>
                                    <option value="10 Gup - Albă">10 Gup - Albă</option>
                                    <option value="9 Gup - Albă cu tresă galbenă">9 Gup - Albă cu tresă galbenă</option>
                                    <option value="8 Gup - Galbenă">8 Gup - Galbenă</option>
                                    <option value="7 Gup - Galbenă cu tresă verde">7 Gup - Galbenă cu tresă verde</option>
                                    <option value="6 Gup - Verde">6 Gup - Verde</option>
                                    <option value="5 Gup - Verde cu tresă albastră">5 Gup - Verde cu tresă albastră</option>
                                    <option value="4 Gup - Albastră">4 Gup - Albastră</option>
                                    <option value="3 Gup - Albastră cu tresă roșie">3 Gup - Albastră cu tresă roșie</option>
                                    <option value="2 Gup - Roșie">2 Gup - Roșie</option>
                                    <option value="1 Gup - Roșie cu tresă neagră">1 Gup - Roșie cu tresă neagră</option>
                                    <option value="1 Dan - Neagră">1 Dan - Neagră</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Data Examenului:</label>
                                <input 
                                    type="date" 
                                    value={formData.data_examen}
                                    onChange={(e) => setFormData({...formData, data_examen: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Feedback Antrenor:</label>
                                <textarea 
                                    rows="3" 
                                    placeholder="Ex: Tehnică excelentă..."
                                    value={formData.feedback}
                                    onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                                ></textarea>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Anulează</button>
                                <button type="submit" className="btn-save">Salvează Gradul</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Editează Profil */}
            {isEditModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Modificare Date Sportiv</h3>
                        <p style={{color: "#888", fontSize: "0.9rem", marginBottom: "20px"}}>
                            Actualizează numele sau codul numeric personal (CNP).
                        </p>
                        
                        <form onSubmit={handleUpdateProfil}>
                            <div className="form-group">
                                <label>Nume Complet:</label>
                                <input 
                                    type="text" 
                                    value={editData.nume}
                                    onChange={(e) => setEditData({...editData, nume: e.target.value})}
                                    required
                                />
                            </div>

                            
                            <div className="form-group">
                                <label>Data Nașterii:</label>
                                <input 
                                    type="date" 
                                    value={editData.data_nasterii}
                                    onChange={(e) => setEditData({...editData, data_nasterii: e.target.value})}
                                />
                            </div>

                            {editData.tip === 'utilizator' && (
                                <div className="form-group">
                                    <label>CNP:</label>
                                    <input 
                                        type="text" 
                                        maxLength="13"
                                        value={editData.cnp}
                                        onChange={(e) => setEditData({...editData, cnp: e.target.value})}
                                        placeholder="Introduceți CNP-ul..."
                                    />
                                </div>
                            )}

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Anulează</button>
                                <button type="submit" className="btn-save">Actualizează</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default EligibilitateExamen;