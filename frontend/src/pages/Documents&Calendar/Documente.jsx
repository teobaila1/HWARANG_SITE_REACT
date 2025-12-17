import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import "../../../static/css/Documente.css";
import { API_BASE } from "../../config";

const Documente = () => {
  const [documente, setDocumente] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadDocs = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await fetch(`${API_BASE}/api/get_documents`);
        const data = await res.json();

        // dacă backend-ul întoarce obiect de eroare, nu încercăm să dăm filter pe el
        if (!res.ok || !Array.isArray(data)) {
          console.error("Eroare la get_documents:", data);
          setErrorMsg(
            (data && data.message) ||
              "Nu s-au putut încărca documentele. Încearcă din nou."
          );
          setDocumente([]);
          return;
        }

        setDocumente(data);
      } catch (err) {
        console.error(err);
        setErrorMsg("Eroare de rețea la încărcarea documentelor.");
        setDocumente([]);
      } finally {
        setLoading(false);
      }
    };

    loadDocs();
  }, []);

  const handleDelete = async (id, filename) => {
    if (!window.confirm(`Ești sigur că vrei să ștergi fișierul ${filename}?`))
      return;

    try {
      const res = await fetch(`${API_BASE}/api/delete_document/id/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDocumente((prev) => prev.filter((doc) => doc.id !== id));
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Eroare la ștergere!");
      }
    } catch (err) {
      console.error(err);
      alert("Eroare la server!");
    }
  };

  const filteredDocs = documente.filter((doc) =>
    (doc.filename || "")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase())
  );

  const isAdmin = (localStorage.getItem("rol") || "").toLowerCase() === "admin";

  return (
    <>
      <Navbar />
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
            <button
              className="reset-button"
              onClick={() => setSearchTerm("")}
              aria-label="Șterge căutarea"
            >
              ✕
            </button>
          )}
        </div>

        {loading && <p className="docs-info">Se încarcă documentele…</p>}
        {!loading && errorMsg && (
          <p className="docs-error">{errorMsg}</p>
        )}

        {!loading && !errorMsg && (
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
              {filteredDocs.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.filename}</td>
                  <td>{doc.uploaded_by}</td>
                  <td>{doc.upload_date}</td>
                  <td>
                    <a
                      href={`${API_BASE}/api/uploads/id/${doc.id}`}
                      download
                    >
                      <button className="btn-descarca">Descarcă</button>
                    </a>
                    {isAdmin && (
                      <button
                        className="btn-sterge"
                        onClick={() => handleDelete(doc.id, doc.filename)}
                      >
                        Șterge
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={4} className="docs-empty">
                    Nu există documente pentru criteriul de căutare.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Documente;
