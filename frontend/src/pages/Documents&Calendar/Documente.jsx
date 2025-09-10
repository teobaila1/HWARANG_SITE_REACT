import {useEffect, useState} from 'react';
import Navbar from "../../components/Navbar";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Documente.css";

const Documente = () => {
    const [documente, setDocumente] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {
        fetch('http://localhost:5000/api/get_documents')
            .then((res) => res.json())
            .then((data) => setDocumente(data));
    }, []);


    const handleDelete = async (id, filename) => {
        if (!window.confirm(`Ești sigur că vrei să ștergi fișierul ${filename}?`)) return;

        try {
            const res = await fetch(`http://localhost:5000/api/delete_document/id/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setDocumente(prev => prev.filter(doc => doc.id !== id));
            } else {
                alert('Eroare la ștergere!');
            }
        } catch (err) {
            console.error(err);
            alert('Eroare la server!');
        }
    };


    return (
        <>
            <Navbar/>
            <div className="documents-wrapper">
                <h2 className="documents-title">Documente disponibile</h2>
                <div className="search-bar-wrapper">
                    <input
                        type="text"
                        placeholder="Caută un fișier..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button className="reset-button" onClick={() => setSearchTerm("")}>
                            ✕
                        </button>
                    )}
                </div>
                <table className="documents-table">
                    <thead>
                    <tr>
                        <th>Fișier</th>
                        <th>Încărcat de</th>
                        <th>Data</th>
                        <th>Acțiuni</th>
                    </tr>
                    </thead>
                    <tbody>
                    {documente
                        .filter((doc) =>
                            doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((doc) => (
                            <tr key={doc.id}>
                                <td>{doc.filename}</td>
                                <td>{doc.uploaded_by}</td>
                                <td>{doc.upload_date}</td>
                                <td>
                                    <a href={`http://localhost:5000/api/uploads/id/${doc.id}`} download>
                                        <button className="btn-descarca">Descarcă</button>
                                    </a>
                                    {localStorage.getItem("rol") === "admin" && (
                                        <button className="btn-sterge" onClick={() => handleDelete(doc.id, doc.filename)}>
                                            Șterge
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Documente;
