import React, {useEffect, useState} from "react";
import Select from 'react-select';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../../components/Navbar";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Concursuri.css";
import Footer from "../../components/Footer";
import {Link} from "react-router-dom";

const Concursuri = () => {
    const [rol, setRol] = useState("");
    const [mesaj, setMesaj] = useState("");
    const [formVisible, setFormVisible] = useState(false);
    const [concursSelectat, setConcursSelectat] = useState("");
    const [gender, setGender] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        nume: "",
        dataNasterii: "",
        categorieVarsta: "",
        gradCentura: "",
        greutate: "",
        probe: "",
        gen: "", // <-- adaugă aici
    });
    const [selectedProbes, setSelectedProbes] = useState([]);

    const probeOptions = [
        {value: 'Tull', label: 'Tull'},
        {value: 'Luptă', label: 'Luptă'},
        {value: 'Tehnici speciale', label: 'Tehnici speciale'},
        {value: 'Spargeri', label: 'Spargeri'}
    ];


    const [concursuriViitoare, setConcursuriViitoare] = useState([]);
    const [numarInscrisi, setNumarInscrisi] = useState({});
    const fetchNumarInscrisi = async (numeConcurs) => {
        const res = await fetch(`http://localhost:5000/api/numar_inscrisi/${encodeURIComponent(numeConcurs)}`);
        const result = await res.json();
        setNumarInscrisi(prev => ({...prev, [numeConcurs]: result.nr}));
    };


    useEffect(() => {
        const r = localStorage.getItem("rol");
        setRol(r);
    }, []);


    useEffect(() => {
        const fetchConcursuri = async () => {
            const res = await fetch("http://localhost:5000/api/concursuri");
            const data = await res.json();

            // const viitoare = data.filter(c => new Date(c.dataStart) > new Date());
            setConcursuriViitoare(data);

            // 🔁 Mutați aici
            for (const c of data) {
                const res = await fetch(`http://localhost:5000/api/numar_inscrisi/${encodeURIComponent(c.nume)}`);
                const result = await res.json();
                setNumarInscrisi(prev => ({...prev, [c.nume]: result.nr}));
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
                if (age >= 6 && age <= 12) updated.categorieVarsta = "Junior III";
                else if (age >= 13 && age <= 15) updated.categorieVarsta = "Junior II";
                else if (age >= 16 && age <= 18) updated.categorieVarsta = "Junior I";
                else if (age > 18) updated.categorieVarsta = "Senior";
                else updated.categorieVarsta = "nu poate participa la concurs";
            }
            return updated;
        });
    };

    const handleTrimiteCerere = (numeConcurs) => {
        setConcursSelectat(numeConcurs);
        setFormVisible(true);
        setMesaj("");
    };

    const handleAnuleaza = () => {
        setFormVisible(false);
        setFormData({
            nume: "",
            dataNasterii: "",
            categorieVarsta: "",
            gradCentura: "",
            greutate: "",
            probe: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = localStorage.getItem("username");
        const email = localStorage.getItem("email");
        const probeTrimise = selectedProbes.map(p => p.value).join(", ");

        try {
            const res = await fetch("http://localhost:5000/api/inscriere_concurs", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    username,
                    email,
                    concurs: concursSelectat,
                    ...formData,
                    probe: probeTrimise,
                    gen: gender // ✅ trimitem și genul
                })
            });

            toast.success("Inscrierea a fost facuta cu succes!");
            setFormVisible(false);

            // ✅ Resetare formular complet
            setFormData({
                nume: "",
                dataNasterii: "",
                categorieVarsta: "",
                gradCentura: "",
                greutate: "",
                probe: "",
                gen: ""
            });
            setSelectedProbes([]);
            setGender(""); // ✅ resetăm și genul
            await fetchNumarInscrisi(concursSelectat);
        } catch (error) {
            console.error("Eroare la trimitere:", error);
            setMesaj("A apărut o eroare.");
        }
    };


    // useEffect(() => {
    //     const fetchConcurs = async () => {
    //         const res = await fetch("http://localhost:5000/api/concurs_permis", {
    //             method: "POST",
    //             headers: {"Content-Type": "application/json"},
    //             body: JSON.stringify({username: localStorage.getItem("username")})
    //         });
    //
    //         const result = await res.json();
    //         if (result.status === "success") {
    //             setConcurs(result.concurs); // ex: Cupa Hwarang 2025
    //         } else {
    //             navigate("/access-denied");
    //         }
    //     };
    //
    //     fetchConcurs();
    // }, []);


    const handleDeleteConcurs = async (numeConcurs) => {
        const confirmDelete = window.confirm(`Ești sigur că vrei să ștergi concursul "${numeConcurs}"?`);
        if (!confirmDelete) return;

        try {
            const res = await fetch(`http://localhost:5000/api/sterge_concurs/${encodeURIComponent(numeConcurs)}`, {
                method: "DELETE"
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


    return (
        <>
            <Navbar/>
            <div className="concursuri-container">
                <h2 className="concursuri-title">Concursuri viitoare</h2>

                <input
                    type="text"
                    placeholder="Caută concurs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-cautare"
                />

                {mesaj && <p style={{color: "lightgreen", fontWeight: "bold"}}>{mesaj}</p>}

                <table>
                    <thead>
                    <tr>
                        <th>Perioadă</th>
                        <th>Activitate</th>
                        <th>Localitate</th>
                        <th>Acțiune</th>
                    </tr>
                    </thead>
                    <tbody>
                    {concursuriFiltrate.map((c, index) => (
                        <tr key={index}>
                            <td>{c.perioada}</td>
                            <td>{c.nume}</td>
                            <td>{c.locatie}</td>
                            <td style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                                <button className="btn-inscriere" onClick={() => handleTrimiteCerere(c.nume)}>
                                    Înscrie-te la concurs
                                </button>
                                {rol && (rol === "admin" || rol === "Antrenor") && (
                                    <>
                                        <Link to={`/inscrisi/${encodeURIComponent(c.nume)}`}>
                                            <button className="btn-inscriere">
                                                Vezi înscrieri: {numarInscrisi[c.nume] ?? 0}
                                            </button>
                                        </Link>

                                        <button
                                            className="btn-inscriere"
                                            onClick={(e) => {
                                                e.preventDefault(); // prevenim comportamente nedorite
                                                e.stopPropagation(); // dacă e într-un container clicabil
                                                handleDeleteConcurs(c.nume);
                                            }}
                                        >
                                            Șterge concursul
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {formVisible && (
                    <form onSubmit={handleSubmit} className="form-inscriere">
                        <h2 style={{color: "red"}}>Înscriere la Concurs</h2>
                        <input
                            type="text"
                            name="nume"
                            placeholder="Nume complet sportiv"
                            value={formData.nume}
                            onChange={handleFormChange}
                            required
                        />
                        <input
                            type="date"
                            name="dataNasterii"
                            value={formData.dataNasterii}
                            onChange={handleFormChange}
                            required
                        />
                        <input
                            type="text"
                            name="categorieVarsta"
                            value={formData.categorieVarsta}
                            readOnly
                            placeholder="Categorie de vârstă"
                        />
                        <select
                            name="gradCentura"
                            value={formData.gradCentura}
                            onChange={handleFormChange}
                            required
                        >
                            <option value="">Alege gradul</option>
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
                        <input
                            type="number"
                            name="greutate"
                            placeholder="Greutate (kg)"
                            value={formData.greutate}
                            onChange={handleFormChange}
                            required
                        />
                        <select
                            name="gen"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                        >
                            <option value="">Alege genul</option>
                            <option value="Masculin">Masculin</option>
                            <option value="Feminin">Feminin</option>
                        </select>
                        <label className="label">Probele la care participă</label>
                        <Select
                            options={probeOptions}
                            isMulti
                            value={selectedProbes}
                            onChange={setSelectedProbes}
                            className="react-select-container"
                            classNamePrefix="react-select"

                        />
                        <div style={{display: "flex", justifyContent: "space-between", gap: "10px"}}>
                            <button type="submit">
                                Trimite Înscrierea
                            </button>
                            <button style={{backgroundColor: "gray"}} type="button" onClick={handleAnuleaza}>
                                Anulează
                            </button>
                        </div>
                    </form>
                )}
            </div>
            <ToastContainer
                position="top-center"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <Footer/>
        </>
    );
};

export default Concursuri;
