import React, {useState} from "react";
import Select from 'react-select';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../components/Navbar";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Concursuri.css";

const Concursuri = () => {
    const [mesaj, setMesaj] = useState("");
    const [formVisible, setFormVisible] = useState(false);
    const [concursSelectat, setConcursSelectat] = useState("");
    const [gender, setGender] = useState('');
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

    const genOptions = [
        {value: 'masculin', label: 'Masculin'},
        {value: 'feminin', label: 'Feminin'},
    ];

    const concursuri = [
        {
            perioada: "04.07 – 05.07",
            nume: "Cupa memorială „Gyuri Masza”",
            locatie: "Cluj-Napoca",
            dataStart: "2025-07-04"
        },
        {
            perioada: "06.11 – 09.11",
            nume: "Cupa României pentru seniori, juniori I, II și III",
            locatie: "Baia Mare",
            dataStart: "2025-11-06"
        },
        {
            perioada: "28.11 – 30.11",
            nume: "Jaguar Open Cup",
            locatie: "Târgu Mureș",
            dataStart: "2025-11-28"
        }
    ];

    const concursuriViitoare = concursuri.filter(c => new Date(c.dataStart) > new Date());

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

            const data = await res.json();
            toast.success("Cererea a fost trimisă cu succes!");
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
        } catch (error) {
            console.error("Eroare la trimitere:", error);
            setMesaj("A apărut o eroare.");
        }
    };


    return (
        <>
            <Navbar/>
            <div className="concursuri-container">
                <h2 className="concursuri-title">Concursuri viitoare</h2>
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
                    {concursuriViitoare.map((c, index) => (
                        <tr key={index}>
                            <td>{c.perioada}</td>
                            <td>{c.nume}</td>
                            <td>{c.locatie}</td>
                            <td>
                                <button onClick={() => handleTrimiteCerere(c.nume)}>
                                    Înscrie-te la concurs
                                </button>
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
                            <button type="submit" style={{backgroundColor: "red", color: "white", flex: 1}}>
                                Trimite Înscrierea
                            </button>
                            <button type="button" onClick={handleAnuleaza}
                                    style={{backgroundColor: "gray", color: "white", flex: 1}}>
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
        </>
    );

};

export default Concursuri;
