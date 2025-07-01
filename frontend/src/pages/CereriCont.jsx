import React, {useEffect, useState} from "react";
import Navbar from "../components/Navbar";

function CereriConturi() {
    const [cereri, setCereri] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const username = localStorage.getItem("username");
    const rol = localStorage.getItem("rol");

    useEffect(() => {
        if (rol !== "admin") {
            setError("Acces interzis. Această pagină este disponibilă doar pentru administratori.");
            setLoading(false);
            return;
        }

        fetch(`http://localhost:5000/api/cereri?username=${username}`)
            .then((res) => {
                if (!res.ok) throw new Error("Eroare la încărcare cereri.");
                return res.json();
            })
            .then((data) => {
                setCereri(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);


    const handleAccept = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/cereri/accepta/${id}`, {
                method: "POST",
            });
            const data = await res.json();
            if (data.status === "success") {
                alert("Cererea a fost acceptată.");
                setCereri(cereri.filter((c) => c.id !== id));
            } else {
                alert(data.error || "Eroare la acceptare.");
            }
        } catch (err) {
            alert("Eroare la server.");
        }
    };

    const handleReject = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/cereri/respingere/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.status === "success") {
                alert("Cererea a fost respinsă.");
                setCereri(cereri.filter((c) => c.id !== id));
            } else {
                alert(data.error || "Eroare la respingere.");
            }
        } catch (err) {
            alert("Eroare la server.");
        }
    };


    if (loading) return <p>Se încarcă...</p>;
    if (error) return <p style={{color: "red"}}>{error}</p>;

    return (
        <>
            <Navbar/>
            <div style={{padding: "2rem"}}>
                <h2>Cereri de creare cont</h2>
                {cereri.length === 0 ? (
                    <p>Nu există cereri de procesat.</p>
                ) : (
                    <table style={{width: "100%", borderCollapse: "collapse"}}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Tip</th>
                            <th>Vârstă</th>
                            <th>Acțiuni</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cereri.map((c) => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.username}</td>
                                <td>{c.email}</td>
                                <td>{c.tip}</td>
                                <td>{c.varsta}</td>
                                <td>
                                    <button onClick={() => handleAccept(c.id)}
                                            style={{marginRight: "10px", backgroundColor: "green", color: "white"}}>
                                        Acceptă
                                    </button>
                                    <button onClick={() => handleReject(c.id)}
                                            style={{backgroundColor: "red", color: "white"}}>
                                        Respinge
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

export default CereriConturi;
