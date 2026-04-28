import React, {useEffect, useState} from "react";
import Select from 'react-select';
import {ToastContainer, toast} from 'react-toastify';
import Navbar from "../../components/Navbar";
import "../../../static/css/Concursuri.css";
import Footer from "../../components/Footer";
import {Link} from "react-router-dom";
import {API_BASE} from "../../config";

const Concursuri = () => {
    const [rol, setRol] = useState("");
    const [mesaj, setMesaj] = useState("");
    const [openFormFor, setOpenFormFor] = useState(null);
    const [concursSelectat, setConcursSelectat] = useState("");
    const [gender, setGender] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        nume: "",
        dataNasterii: "",
        categorieVarsta: "",
        gradCentura: "",
        greutate: "",
        inaltime: "",
        probe: "",
        gen: "",
    });

    const [sugestii, setSugestii] = useState({rol: "", nume_propriu: "", copii: []});
    const [numeSelectat, setNumeSelectat] = useState("");

    const role = (rol || "").toLowerCase();
    const CAN_SEE_ENTRIES = role === "admin" || role === "Antrenor";
    const CAN_DELETE = role === "admin";

    const [selectedProbes, setSelectedProbes] = useState([]);
    const [istoricInscrieri, setIstoricInscrieri] = useState([]);

    // --- LISTA STANDARD DE PROBE ---
    const probeOptionsStandard = [
        {value: 'Tull', label: 'Tull'},
        {value: 'Tull Echipe', label: 'Tull Echipe'},
        {value: 'Luptă Tradițională', label: 'Luptă Tradițională'},
        {value: 'Luptă', label: 'Luptă'},
        {value: 'Luptă Echipe', label: 'Luptă Echipă'},
        {value: 'Tehnici speciale', label: 'Tehnici speciale'},
        {value: 'Tehnici speciale Echipe', label: 'Tehnici speciale Echipă'},
        {value: 'Spargeri Forță', label: 'Spargeri Forță'},
        {value: 'Spargeri Forță Echipe', label: 'Spargeri Forță Echipe'},
        {value: 'Speed-Kick', label: 'Speed-Kick'},
        {value: 'Speed-Punch', label: 'Speed-Punch'},
        {value: 'Dinamometru', label: 'Dinamometru'}
    ];

    // --- MAPPING GRADE PENTRU LOGICĂ ---
    const mapGradToGup = {
        "Alb": 10,
        "Alb_cu_tresă_galbenă": 9,
        "Galbena": 8,
        "Galben_cu_tresă_verde": 7,
        "Verde": 6,
        "Verde_cu_tresă_albastru": 5,
        "Albastră": 4,
        "Albastră_cu_tresă_roșie": 3,
        "Roșie": 2,
        "Roșie_cu_tresă_neagră": 1,
        "Neagră": 0
    };

    // --- SCROLL LA ISTORIC ---
    const scrollToHistory = () => {
        const element = document.getElementById('zona-istoric');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // --- FUNCTION FETCH ISTORIC ---
    useEffect(() => {
        const fetchIstoric = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await fetch(`${API_BASE}/api/inscrierile_mele`, {
                    headers: {"Authorization": `Bearer ${token}`}
                });
                const data = await res.json();
                if (data.status === "success") {
                    setIstoricInscrieri(data.data);
                }
            } catch (error) {
                console.error("Eroare la încărcarea istoricului:", error);
            }
        };
        fetchIstoric();
    }, []);


    // --- FUNCȚIA DE FILTRARE PROBE (LOGICĂ SPECIALĂ) ---
    const getProbeOptions = () => {
        const numeConcurs = concursSelectat.toLowerCase();

        // 1. LOGICĂ CUPA FAMILIEI
        if (numeConcurs.includes("familiei")) {
            return [
                {value: 'Participare', label: 'Participare'}
            ];
        }

        // 2. LOGICĂ CUPA HWARANG
        if (numeConcurs.includes("hwarang")) {
            const gradCurent = formData.gradCentura;
            const gup = mapGradToGup[gradCurent];

            if (gup === undefined) return probeOptionsStandard;

            // Grade Mici (10 GUP -> 6 GUP) = Combinată
            if (gup >= 6) {
                return [
                    {value: 'Probă Combinată', label: 'Probă Combinată'}
                ];
            }
            // Grade Mari (5 GUP -> Dan) = Standard (fără combinată)
            else {
                return probeOptionsStandard;
            }
        }

        // 3. LOGICĂ STANDARD
        return probeOptionsStandard;
    };

    const [concursuriViitoare, setConcursuriViitoare] = useState([]);
    const [numarInscrisi, setNumarInscrisi] = useState({});

    const fetchNumarInscrisi = async (numeConcurs) => {
        const token = localStorage.getItem("token");
        const headers = token ? {"Authorization": `Bearer ${token}`} : {};
        const res = await fetch(`${API_BASE}/api/numar_inscrisi/${encodeURIComponent(numeConcurs)}`, {headers});
        const result = await res.json();
        setNumarInscrisi(prev => ({...prev, [numeConcurs]: result.nr}));
    };

    useEffect(() => {
        const r = localStorage.getItem("rol");
        setRol(r);
    }, []);

    useEffect(() => {
        const username = localStorage.getItem("username");
        if (username) {
            const token = localStorage.getItem("token");
            fetch(`${API_BASE}/api/profil/sugestii_inscriere?username=${encodeURIComponent(username)}`, {
                headers: {"Authorization": `Bearer ${token}`}
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status === "success") {
                        setSugestii(data.data);
                        if (data.data.rol === "sportiv") {
                            setNumeSelectat(data.data.nume_propriu);
                            setFormData(prev => ({...prev, nume: data.data.nume_propriu}));
                        }
                    }
                })
                .catch(err => console.error("Eroare la preluarea sugestiilor:", err));
        }
    }, []);

    useEffect(() => {
        const fetchConcursuri = async () => {
            const res = await fetch(`${API_BASE}/api/concursuri`);
            const data = await res.json();
            setConcursuriViitoare(data);
            for (const c of data) {
                await fetchNumarInscrisi(c.nume);
            }
        };
        fetchConcursuri();
    }, []);

    const calculateAge = (dateString) => {
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleFormChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => {
            const updated = {...prev, [name]: value};
            if (name === "dataNasterii") {
                const age = calculateAge(value);
                if (age >= 5 && age <= 12) updated.categorieVarsta = "Junior III";
                else if (age >= 13 && age <= 15) updated.categorieVarsta = "Junior II";
                else if (age >= 16 && age <= 18) updated.categorieVarsta = "Junior I";
                else if (age > 18) updated.categorieVarsta = "Senior";
                else updated.categorieVarsta = "nu poate participa la concurs";
            }
            if (name === "gradCentura") {
                setSelectedProbes([]);
            }
            return updated;
        });
    };

    const handleTrimiteCerere = (numeConcurs) => {
        setConcursSelectat(numeConcurs);
        setOpenFormFor(prev => prev === numeConcurs ? null : numeConcurs);
        setMesaj("");
        if (openFormFor !== numeConcurs) {
            setSelectedProbes([]);
            setFormData(prev => ({...prev, gradCentura: ""}));
        }
    };

    const handleAnuleaza = () => {
        setOpenFormFor(null);
        setFormData({
            nume: "",
            dataNasterii: "",
            categorieVarsta: "",
            gradCentura: "",
            greutate: "",
            inaltime: "",
            probe: "",
            gen: ""
        });
        setSelectedProbes([]);
        setGender("");
        if (sugestii.rol !== "sportiv") {
            setNumeSelectat("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Luăm doar token-ul. Nu ne mai pasă de username/email din localStorage
        // Backend-ul știe cine suntem direct din Token!
        const token = localStorage.getItem("token");
        const probeTrimise = selectedProbes.map(p => p.value).join(", ");

        try {
            const res = await fetch(`${API_BASE}/api/inscriere_concurs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    concurs: concursSelectat,
                    ...formData,
                    probe: probeTrimise,
                    gen: gender
                })
            });

            const data = await res.json();

            // 2. TRATAREA RĂSPUNSURILOR
            if (res.ok) {
                // STATUS 200/201: Succes Total (Verde)
                toast.success(data.message || "Înscriere a fost făcută cu succes!");
                handleAnuleaza();
                await fetchNumarInscrisi(concursSelectat);

                // Reîncărcăm istoricul după o înscriere reușită
                const resIstoric = await fetch(`${API_BASE}/api/inscrierile_mele`, {
                    headers: {"Authorization": `Bearer ${token}`}
                });
                const dataIstoric = await resIstoric.json();
                if (dataIstoric.status === "success") {
                    setIstoricInscrieri(dataIstoric.data);
                }

            } else if (res.status === 409) {
                // STATUS 409: DUPLICAT (Deja înscris de antrenor)
                // AICI E SECRETUL: Îl punem ca toast.info (Albastru), nu toast.error!
                toast.info(data.message, { autoClose: 6000 });
                handleAnuleaza(); // Închidem formularul pentru că e deja înscris

            } else {
                // ALTE ERORI (Lipsă date, Concurs închis, etc) - Roșu
                toast.error(data.message || "A apărut o eroare la înscriere.");
            }

        } catch (error) {
            console.error("Eroare la trimitere:", error);
            toast.error("Eroare de conexiune cu serverul.");
        }
    };

    const handleDeleteConcurs = async (numeConcurs) => {
        const confirmDelete = window.confirm(`Ești sigur că vrei să ștergi concursul "${numeConcurs}"?`);
        if (!confirmDelete) return;
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${API_BASE}/api/sterge_concurs/${encodeURIComponent(numeConcurs)}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                toast.success("Concursul a fost șters cu succes!");
                setConcursuriViitoare(prev => prev.filter(c => c.nume !== numeConcurs));
            } else {
                toast.error("Eroare la ștergerea concursului.");
            }
        } catch (error) {
            console.error("Eroare la ștergere:", error);
            toast.error("Eroare de rețea.");
        }
    };

    const concursuriFiltrate = concursuriViitoare.filter(c =>
        c.nume.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.locatie.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleStatus = async (numeConcurs) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE}/api/concursuri/toggle_status/${encodeURIComponent(numeConcurs)}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);
                setConcursuriViitoare(prev => prev.map(c =>
                    c.nume === numeConcurs ? {...c, inscrieri_deschise: !c.inscrieri_deschise} : c
                ));
            } else {
                toast.error(data.message || "Eroare la schimbarea stării");
            }
        } catch (error) {
            console.error(error);
            toast.error("Eroare de conexiune");
        }
    };


    return (
        <>
            <Navbar/>
            <div className="concursuri-container">

                {/* --- HEADER WRAPPER NOU (Pt. Aliniere Orizontală) --- */}
                <div className="concursuri-header-wrapper">
                    <h1 className="concursuri-title">CONCURSURI VIITOARE</h1>

                    <div className="concursuri-header-actions">
                        <button
                            onClick={scrollToHistory}
                            className="view-registrations-link"
                            style={{background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit'}}
                        >
                            VEZI ÎNSCRIERILE MELE
                        </button>

                        <input
                            type="text"
                            placeholder="Caută concurs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-cautare"
                        />
                    </div>
                </div>
                {/* ------------------------------------------------ */}

                {mesaj && <p style={{color: "lightgreen", fontWeight: "bold", marginTop: "1rem"}}>{mesaj}</p>}

                <table className="concursuri-table">
                    <thead>
                    <tr>
                        <th width="20%">PERIOADĂ</th>
                        <th width="35%">ACTIVITATE</th>
                        <th width="25%">LOCALITATE</th>
                        <th width="20%">ACȚIUNE</th>
                    </tr>
                    </thead>

                    <tbody>
                    {concursuriFiltrate.map((c, index) => (
                        <React.Fragment key={index}>
                            <tr className={!c.inscrieri_deschise ? "row-closed" : ""}>
                                <td className="col-perioada" data-label="Perioadă">{c.perioada}</td>
                                <td className="col-nume" data-label="Activitate">{c.nume}</td>
                                <td className="col-localitate" data-label="Localitate">{c.locatie}</td>

                                <td data-label="Acțiune" className="td-actions">
                                    <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>

                                        {/* Buton Înscriere */}
                                        {c.inscrieri_deschise ? (
                                            <button className="btn-inscriere"
                                                    onClick={() => handleTrimiteCerere(c.nume)}>
                                                {openFormFor === c.nume ? "Ascunde formularul" : "Înscrie-te la concurs"}
                                            </button>
                                        ) : (
                                            <button className="btn-closed" disabled>
                                                ⛔ Înscrieri Închise
                                            </button>
                                        )}

                                        {/* Buton Admin Status */}
                                        {rol === "admin" && (
                                            <button
                                                onClick={() => handleToggleStatus(c.nume)}
                                                className="btn-inscriere"
                                                style={{
                                                    backgroundColor: c.inscrieri_deschise ? "#7f1d1d" : "#14532d",
                                                    border: c.inscrieri_deschise ? "1px solid #ef4444" : "1px solid #22c55e",
                                                    color: "white",
                                                    marginTop: "5px"
                                                }}
                                            >
                                                {c.inscrieri_deschise ? "🔒 Închide" : "🔓 Deschide"}
                                            </button>
                                        )}

                                        {CAN_SEE_ENTRIES && (
                                            <Link to={`/inscrisi/${encodeURIComponent(c.nume)}`}
                                                  style={{textDecoration: 'none'}}>
                                                <button className="btn-inscriere" style={{
                                                    background: "#27272a",
                                                    border: "1px solid #3f3f46",
                                                    width: "100%"
                                                }}>
                                                    Vezi înscrieri: {numarInscrisi[c.nume] ?? 0}
                                                </button>
                                            </Link>
                                        )}

                                        {CAN_DELETE && (
                                            <button
                                                className="btn-inscriere"
                                                style={{
                                                    background: "transparent",
                                                    border: "1px solid #ef4444",
                                                    color: "#ef4444"
                                                }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleDeleteConcurs(c.nume);
                                                }}
                                            >
                                                Șterge
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>

                            {openFormFor === c.nume && (
                                <tr className="form-row">
                                    <td colSpan={4}>
                                        <form onSubmit={handleSubmit} className="form-inscriere form-inscriere--inline">
                                            <h2>Înscriere la: <span className="form-concurs-nume">{c.nume}</span></h2>

                                            <div className="form-grid">
                                                <div className="form-field">
                                                    <label>Nume complet sportiv</label>
                                                    {sugestii.rol === "sportiv" ? (
                                                        <input
                                                            type="text"
                                                            name="nume"
                                                            value={formData.nume}
                                                            readOnly
                                                            style={{
                                                                backgroundColor: "#2a2a2a",
                                                                color: "#ccc",
                                                                cursor: "not-allowed",
                                                                border: "1px solid #444"
                                                            }}
                                                        />
                                                    ) : (
                                                        <>
                                                            {sugestii.copii && sugestii.copii.length > 0 && (
                                                                <select
                                                                    value={numeSelectat}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;
                                                                        setNumeSelectat(val);
                                                                        if (val !== "manual") {
                                                                            setFormData(prev => ({...prev, nume: val}));
                                                                        } else {
                                                                            setFormData(prev => ({...prev, nume: ""}));
                                                                        }
                                                                    }}
                                                                    className="input-select-elegant"
                                                                >
                                                                    <option value="">-- Alege un copil din listă --</option>
                                                                    {sugestii.copii.map((child, idx) => (
                                                                        <option key={idx} value={child.nume}>
                                                                            {child.nume} {child.grupa ? `(${child.grupa})` : ""}
                                                                        </option>
                                                                    ))}
                                                                    <option value="manual">+ Înscrie pe altcineva (manual)</option>
                                                                </select>
                                                            )}

                                                            {(numeSelectat === "manual" || !sugestii.copii || sugestii.copii.length === 0) && (
                                                                <input
                                                                    type="text"
                                                                    name="nume"
                                                                    placeholder="Scrie numele complet..."
                                                                    value={formData.nume}
                                                                    onChange={handleFormChange}
                                                                    required
                                                                />
                                                            )}
                                                        </>
                                                    )}
                                                </div>

                                                <div className="form-field">
                                                    <label>Data nașterii</label>
                                                    <input type="date" name="dataNasterii" value={formData.dataNasterii}
                                                           onChange={handleFormChange} required/>
                                                </div>

                                                <div className="form-field">
                                                    <label>Categorie de vârstă</label>
                                                    <input type="text" name="categorieVarsta"
                                                           value={formData.categorieVarsta} readOnly
                                                           placeholder="Calculată automat"
                                                           style={{backgroundColor: "#2a2a2a", cursor: "default"}}/>
                                                </div>

                                                <div className="form-field">
                                                    <label>Grad (centură)</label>
                                                    <select name="gradCentura" value={formData.gradCentura}
                                                            onChange={handleFormChange} required>
                                                        <option value="">Alege gradul</option>
                                                        <option value="Alb">Alb (10 GUP)</option>
                                                        <option value="Alb_cu_tresă_galbenă">Alb cu tresă galbenă</option>
                                                        <option value="Galbena">Galbenă</option>
                                                        <option value="Galben_cu_tresă_verde">Galben cu tresă verde</option>
                                                        <option value="Verde">Verde</option>
                                                        <option value="Verde_cu_tresă_albastru">Verde cu tresă albastru</option>
                                                        <option value="Albastră">Albastră</option>
                                                        <option value="Albastră_cu_tresă_roșie">Albastră cu tresă roșie</option>
                                                        <option value="Roșie">Roșie</option>
                                                        <option value="Roșie_cu_tresă_neagră">Roșie cu tresă neagră</option>
                                                        <option value="Neagră">Neagră</option>
                                                    </select>
                                                </div>

                                                <div className="form-field">
                                                    <label>Greutate (kg)</label>
                                                    <input type="number" name="greutate" placeholder="Greutate (kg)"
                                                           value={formData.greutate} onChange={handleFormChange}
                                                           required/>
                                                </div>

                                                {c.cere_inaltime && (
                                                    <div className="form-field">
                                                        <label>Înălțime (cm)</label>
                                                        <input type="number" name="inaltime" placeholder="Ex: 175"
                                                               value={formData.inaltime} onChange={handleFormChange}
                                                               required/>
                                                    </div>
                                                )}

                                                <div className="form-field">
                                                    <label>Gen</label>
                                                    <select name="gen" value={gender}
                                                            onChange={(e) => setGender(e.target.value)} required>
                                                        <option value="">Alege genul</option>
                                                        <option value="Masculin">Masculin</option>
                                                        <option value="Feminin">Feminin</option>
                                                    </select>
                                                </div>

                                                <div className="form-field form-field--full">
                                                    <label>
                                                        {concursSelectat.toLowerCase().includes("familiei")
                                                            ? "Mod de participare"
                                                            : "Probele la care participă"
                                                        }
                                                    </label>

                                                    <Select
                                                        options={getProbeOptions()}
                                                        isMulti
                                                        value={selectedProbes}
                                                        onChange={setSelectedProbes}
                                                        className="react-select-container"
                                                        classNamePrefix="react-select"
                                                        placeholder="Selectează..."
                                                        noOptionsMessage={() => "Selectează întâi gradul centurii"}
                                                        menuPlacement="bottom"
                                                        menuPosition="fixed"
                                                        menuPortalTarget={document.body}
                                                        maxMenuHeight={160}
                                                        menuShouldScrollIntoView={false}
                                                        styles={{
                                                            menuPortal: (base) => ({...base, zIndex: 999999}),
                                                            menu: (base) => ({
                                                                ...base,
                                                                backgroundColor: "#18181b",
                                                                zIndex: 999999
                                                            }),
                                                            menuList: (base) => ({...base, padding: 0})
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-actions">
                                                <button type="submit">Trimite înscrierea</button>
                                                <button type="button" className="btn-cancel" onClick={handleAnuleaza}>
                                                    Anulează
                                                </button>
                                            </div>
                                        </form>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>

                {/* ================= ZONA ISTORIC INSCRIERI ================= */}
                <div id="zona-istoric" className="istoric-container"
                     style={{marginTop: "80px", borderTop: "1px solid #333", paddingTop: "40px"}}>
                    <h2 className="concursuri-title" style={{fontSize: "2rem", borderLeft: "5px solid #d32f2f", paddingLeft: "20px"}}>
                        ISTORIC ÎNSCRIERI
                    </h2>

                    {istoricInscrieri.length === 0 ? (
                        <p style={{color: "#888", fontStyle: "italic", marginTop: "20px"}}>Nu ai nicio înscriere înregistrată.</p>
                    ) : (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                            gap: "25px",
                            marginTop: "30px"
                        }}>
                            {istoricInscrieri.map((item, idx) => (
                                <div key={idx} style={{
                                    backgroundColor: "#1e1e22",
                                    border: "1px solid #333",
                                    borderRadius: "12px",
                                    padding: "25px",
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                                    position: "relative"
                                }}>
                                    <div style={{
                                        fontSize: "1.3rem",
                                        fontWeight: "bold",
                                        color: "#fff",
                                        marginBottom: "12px",
                                        borderBottom: "1px solid #333",
                                        paddingBottom: "10px"
                                    }}>
                                        {item.concurs}
                                    </div>
                                    <div style={{
                                        position: "absolute",
                                        top: "25px",
                                        right: "25px",
                                        background: "#333",
                                        color: "#aaa",
                                        fontSize: "0.9rem",
                                        padding: "4px 10px",
                                        borderRadius: "6px",
                                        fontWeight: "600"
                                    }}>
                                        {item.data_inscriere}
                                    </div>

                                    <div style={{color: "#e4e4e7", marginBottom: "6px", fontSize: "1.1rem"}}>
                                        <span style={{color: "#d32f2f", fontWeight: "bold"}}>Sportiv:</span> {item.nume_sportiv}
                                    </div>
                                    <div style={{color: "#a1a1aa", marginBottom: "6px", fontSize: "1rem"}}>
                                        <span style={{fontWeight: "bold"}}>Categorie:</span> {item.categorie}
                                    </div>
                                    <div style={{
                                        color: "#d4d4d8",
                                        fontSize: "1rem",
                                        marginTop: "15px",
                                        lineHeight: "1.5",
                                        backgroundColor: "#18181b",
                                        padding: "10px",
                                        borderRadius: "8px"
                                    }}>
                                        <span style={{color: "#d32f2f", fontWeight: "bold"}}>Probe:</span><br/>
                                        {item.probe}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
            <Footer/>
        </>
    );
};

export default Concursuri;