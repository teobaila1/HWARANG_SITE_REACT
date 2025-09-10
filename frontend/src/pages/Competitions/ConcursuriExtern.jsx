// vite_hwarang_react/frontend/pages/ConcursuriExtern.jsx
import React, {useEffect, useState} from "react";
import Select from 'react-select';
import {ToastContainer, toast} from 'react-toastify';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import 'react-toastify/dist/ReactToastify.css';
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Concursuri.css";
import {useNavigate} from "react-router-dom";

const ConcursuriExtern = () => {
    const [formVisible, setFormVisible] = useState(false);
    const [selectedProbes, setSelectedProbes] = useState([]);
    const [gender, setGender] = useState('');
    const [formData, setFormData] = useState({
        nume: "",
        dataNasterii: "",
        categorieVarsta: "",
        gradCentura: "",
        greutate: "",
        gen: ""
    });

    const [concursuri, setConcursuri] = useState([]);
    const [formularDeschis, setFormularDeschis] = useState(null); // index concurs deschis
    const navigate = useNavigate();


    const calculateAge = (dateString) => {
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
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
                else updated.categorieVarsta = "nu poate participa";
            }
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = localStorage.getItem("username");
        const email = localStorage.getItem("email");
        const probeTrimise = selectedProbes.map(p => p.value).join(", ");
        const concursTrimis = concursuri[formularDeschis]?.nume || "";

        const res = await fetch("http://localhost:5000/api/inscriere_concurs", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username,
                email,
                concurs: concursTrimis,
                ...formData,
                probe: probeTrimise,
                gen: gender
            })
        });

        if (res.ok) {
            toast.success("Înscriere trimisă cu succes!");
            setFormVisible(false);
            setFormData({
                nume: "", dataNasterii: "", categorieVarsta: "",
                gradCentura: "", greutate: "", gen: ""
            });
            setSelectedProbes([]);
        } else {
            toast.error("Eroare la trimiterea înscrierii!");
        }
    };

    const fetchConcurs = async () => {
        const rol = localStorage.getItem("rol");
        const username = localStorage.getItem("username");


        if (rol === "AntrenorExtern") {
            fetch("/api/concurs_permis", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username})
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status === "success") {
                        setConcursuri(data.concursuri);  // trebuie să fie array de obiecte: {nume, perioada}
                    }
                });
        }

        if (rol === "admin") {
            const res = await fetch("http://localhost:5000/api/toate_concursurile");
            const data = await res.json();
            if (data.status === "success") {
                setConcursuri(data.concursuri); // trebuie să fie un array deja
            }
        }
    };


    useEffect(() => {
        fetchConcurs();
    }, []);


    useEffect(() => {
        const rol = localStorage.getItem("rol");
        if (rol !== "AntrenorExtern" && rol !== "admin") {
            navigate("/access-denied");
        }
    }, []);


    const probeOptions = [
        {value: 'Tull', label: 'Tull'},
        {value: 'Luptă', label: 'Luptă'},
        {value: 'Tehnici speciale', label: 'Tehnici speciale'},
        {value: 'Spargeri', label: 'Spargeri'}
    ];


    return (
        <>
            <Navbar/>
            <div className="concursuri-container">
                <h2 style={{color: "white"}}>Concursuri viitoare:</h2>

                {Array.isArray(concursuri) && concursuri.map((conc, index) => (
                    <div key={index} className="concurs-card">
                        <div className="concurs-name">{conc.nume}</div>
                        <table className="concurs-table">
                            <tbody>
                            <tr>
                                <td>Perioadă:</td>
                                <td>{conc.perioada}</td>
                            </tr>
                            <tr>
                                <td>Locație:</td>
                                <td>{conc.locatie || "Necunoscută"}</td>
                            </tr>
                            </tbody>
                        </table>
                        {formularDeschis !== index ? (
                            <button className="btn-inscriere" onClick={() => setFormularDeschis(index)}>Înscrie
                                sportiv</button>
                        ) : (
                            <form onSubmit={handleSubmit} className="form-inscriere">
                                <input name="nume" placeholder="Nume complet" value={formData.nume}
                                       onChange={handleFormChange} required/>
                                <input name="dataNasterii" type="date" value={formData.dataNasterii}
                                       onChange={handleFormChange} required/>
                                <input name="categorieVarsta" value={formData.categorieVarsta} readOnly/>
                                <select name="gradCentura" value={formData.gradCentura} onChange={handleFormChange}
                                        required>
                                    <option value="">Alege gradul</option>
                                    <option value="Galbena">Galbenă</option>
                                    <option value="Verde">Verde</option>
                                    <option value="Albastră">Albastră</option>
                                    <option value="Roșie">Roșie</option>
                                    <option value="Neagră">Neagră</option>
                                </select>
                                <input name="greutate" placeholder="Greutate (kg)" type="number"
                                       value={formData.greutate} onChange={handleFormChange} required/>
                                <select name="gen" value={gender} onChange={(e) => setGender(e.target.value)}
                                        required>
                                    <option value="">Gen</option>
                                    <option value="Masculin">Masculin</option>
                                    <option value="Feminin">Feminin</option>
                                </select>
                                <Select options={probeOptions} isMulti value={selectedProbes}
                                        onChange={setSelectedProbes}/>
                                <button className="btn-inscriere" type="submit">Trimite Înscrierea</button>
                                <button className="btn-inscriere" type="button"
                                        onClick={() => setFormularDeschis(null)}>Anulează
                                </button>
                            </form>
                        )}
                    </div>
                ))}
            </div>

            <ToastContainer/>
            <Footer/>
        </>
    );
};

export default ConcursuriExtern;
