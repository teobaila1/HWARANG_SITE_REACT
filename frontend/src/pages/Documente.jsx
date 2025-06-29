import {useEffect, useState} from 'react';
import Navbar from "../components/Navbar";

const Documente = () => {
    const [documente, setDocumente] = useState([]);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/get_documents')
            .then((res) => res.json())
            .then((data) => setDocumente(data));
    }, []);


    const handleDelete = async (filename) => {
        if (!window.confirm(`Ești sigur că vrei să ștergi fișierul ${filename}?`)) return;

        try {
            const res = await fetch(`http://localhost:5000/delete_document/${filename}`, {
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
            <div className="documents-container">
                <h2>📄 Documente disponibile</h2>
                <ul>
                    {documente.map((doc) => (
                        <li key={doc.id}>
                            <strong>{doc.filename}</strong> — încărcat
                            de <em>{doc.uploaded_by}</em> la {doc.upload_date} &nbsp;
                            <a href={`http://localhost:5000/uploads/${doc.filename}`} download>
                                <button style={{marginRight: '0.5rem'}}>Descarcă</button>
                            </a>
                            <button onClick={() => handleDelete(doc.filename)}>Șterge</button>
                        </li>

                    ))}

                </ul>
            </div>
        </>
    );
};

export default Documente;
