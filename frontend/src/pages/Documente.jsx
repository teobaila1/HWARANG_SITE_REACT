import {useEffect, useState} from 'react';
import Navbar from "../components/Navbar";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Documente.css";

const Documente = () => {
    const [documente, setDocumente] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {
        fetch('http://192.168.100.87:5000/get_documents')
            .then((res) => res.json())
            .then((data) => setDocumente(data));
    }, []);


    const handleDelete = async (filename) => {
        if (!window.confirm(`Ești sigur că vrei să ștergi fișierul ${filename}?`)) return;

        try {
            const res = await fetch(`http://192.168.100.87:5000/delete_document/${filename}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setDocumente(prev => prev.filter(doc => doc.filename !== filename));
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
                                    <a href={`http://192.168.100.87:5000/uploads/${doc.filename}`} download>
                                        <button className="btn-descarca">Descarcă</button>
                                    </a>
                                    {localStorage.getItem("rol") === "admin" && (
                                        <button className="btn-sterge" onClick={() => handleDelete(doc.filename)}>
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
