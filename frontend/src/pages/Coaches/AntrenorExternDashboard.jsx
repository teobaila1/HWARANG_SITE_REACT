// import React, {useEffect, useState} from "react";
//
// const AntrenorExternDashboard = () => {
//     const [concursuri, setConcursuri] = useState([]);
//
//     useEffect(() => {
//         const fetchConcurs = async () => {
//             const res = await fetch("http://localhost:5000/api/concurs_permis", {
//                 method: "POST",
//                 headers: {"Content-Type": "application/json"},
//                 body: JSON.stringify({username: localStorage.getItem("username")})
//             });
//
//             const result = await res.json();
//             if (result.status === "success") {
//                 setConcursuri(result.concursuri); // listă de { nume, perioada }
//             }
//         };
//
//         fetchConcurs();
//     }, []);
//
//     return (
//         <div className="dashboard">
//             <h2>Bine ai venit, antrenor extern!</h2>
//             <p style={{fontSize: "18px"}}>
//                 Ai dreptul să înscrii sportivi doar la concursurile permise:
//             </p>
//             <ul style={{listStyle: "none", paddingLeft: 0}}>
//                 {concursuri.map((c, index) => (
//                     <li key={index} style={{marginBottom: "10px"}}>
//                         <strong style={{color: "limegreen", fontSize: "20px"}}>{c.nume}</strong>
//                         <div style={{color: "white"}}>Perioadă: {c.perioada}</div>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };
//
// export default AntrenorExternDashboard;
