import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import "../../../static/css/Documente.css";
import { API_BASE } from "../../config";

const Documente = () => {
  const [documente, setDocumente] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const loadDocs = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const token = localStorage.getItem("token"); // <-- Luăm token

      // --- MODIFICARE: Adăugat header Authorization ---
      const res = await fetch(`${API_BASE}/api/get_documents`, {
          headers: {
              "Authorization": `Bearer ${token}`
          }
      });
      // ------------------------------------------------

      const data = await res.json();

      if (!res.ok || !Array.isArray(data)) {
        console.error("Eroare la get_documents:", data);
        setErrorMsg((data && data.message) || "Nu s-au putut încărca documentele.");
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

  useEffect(() => {
    loadDocs();
  }, []);

  const handleDelete = async (id, filename) => {
    if (!window.confirm(`Ești sigur că vrei să ștergi fișierul ${filename}?`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/delete_document/id/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}` // <-- Token și aici
        }
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

  const handleDownload = async (docId, filename) => {
      try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_BASE}/api/uploads/id/${docId}`, {
              headers: { "Authorization": `Bearer ${token}` }
          });

          if (res.ok) {
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              a.remove();
              window.URL.revokeObjectURL(url);
          } else {
              alert("Nu am putut descărca fișierul.");
          }
      } catch (e) {
          console.error(e);
          alert("Eroare de rețea.");
      }
  };

  const filteredDocs = documente.filter((doc) =>
    (doc.filename || "").toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const isAdmin = (localStorage.getItem("rol") || "").toLowerCase() === "admin";

  const formatDateRO = (dateStr) => {
    if (!dateStr) return "-";
    // mic hack pt timezone dacă stringul e simplu
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleString("ro-RO", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

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
            <button className="reset-button" onClick={() => setSearchTerm("")}>✕</button>
          )}
        </div>

        {loading && <p className="docs-info">Se încarcă documentele…</p>}
        {!loading && errorMsg && <p className="docs-error">{errorMsg}</p>}

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
                  <td>{formatDateRO(doc.upload_date)}</td>
                  <td>
                    <button
                        className="btn-descarca"
                        onClick={() => handleDownload(doc.id, doc.filename)}
                    >
                        Descarcă
                    </button>
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
                <tr><td colSpan={4} className="docs-empty">Nu există documente.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Documente;