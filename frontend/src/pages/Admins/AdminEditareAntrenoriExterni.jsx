// import React, { useEffect, useState } from "react";
//
// function AdminConcursuriAntrenori() {
//   const [antrenori, setAntrenori] = useState([]);
//
//   useEffect(() => {
//     fetch("/api/antrenori_externi")
//       .then(res => res.json())
//       .then(data =>
//         setAntrenori(data.map(a => ({ ...a, status: "" })))
//       );
//   }, []);
//
//   const updateConcurs = async (id, concurs_permis) => {
//     const res = await fetch("/api/set_concurs_permis", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ id, concurs_permis }),
//     });
//
//     if (res.ok) {
//       setAntrenori(prev =>
//         prev.map(a =>
//           a.id === id ? { ...a, status: "salvat" } : a
//         )
//       );
//
//       setTimeout(() => {
//         setAntrenori(prev =>
//           prev.map(a =>
//             a.id === id ? { ...a, status: "" } : a
//           )
//         );
//       }, 2000); // mesaj dispare după 2 secunde
//     } else {
//       setAntrenori(prev =>
//         prev.map(a =>
//           a.id === id ? { ...a, status: "eroare" } : a
//         )
//       );
//     }
//   };
//
//   const handleChange = (id, value) => {
//     setAntrenori(prev =>
//       prev.map(a =>
//         a.id === id ? { ...a, concurs_permis: value } : a
//       )
//     );
//   };
//
//   const handleKeyOrBlur = (e, id, value) => {
//     if (e.key === "Enter" || e.type === "blur") {
//       e.preventDefault();
//       updateConcurs(id, value);
//     }
//   };
//
//   return (
//     <div style={{ color: "white" }}>
//       <h2>Gestionare Antrenori Externi</h2>
//       {antrenori.map((a) => (
//         <div key={a.id} style={{ marginBottom: "2rem" }}>
//           <strong>{a.username}</strong> ({a.email})
//           <br />
//           Concurs permis:
//           <input
//             type="text"
//             value={a.concurs_permis || ""}
//             placeholder="Ex: Cupa Hwarang 2025"
//             style={{ width: "80%", padding: "5px", marginTop: "5px" }}
//             onChange={(e) => handleChange(a.id, e.target.value)}
//             onKeyDown={(e) => handleKeyOrBlur(e, a.id, a.concurs_permis)}
//             onBlur={(e) => handleKeyOrBlur(e, a.id, a.concurs_permis)}
//           />
//           {a.status === "salvat" && (
//             <div style={{ color: "lightgreen", marginTop: "4px" }}>
//               Concurs salvat ✔
//             </div>
//           )}
//           {a.status === "eroare" && (
//             <div style={{ color: "red", marginTop: "4px" }}>
//               Eroare la salvare
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }
//
// export default AdminConcursuriAntrenori;
