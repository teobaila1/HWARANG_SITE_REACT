// import React, { useState } from "react";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import { toast, ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// import "../../../static/css/Join.css";
// import {API_BASE} from "../../config";
//
// const JoinForm = () => {
//   const [acceptTerms, setAcceptTerms] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     prename: "",
//     email: "",
//     phone: "",
//     message: "",
//   });
//
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (submitting) return;
//     setSubmitting(true);
//
//     try {
//       const response = await fetch(`${API_BASE}/api/inscriere`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//
//       const result = await response.json();
//       if (result.status === "error") {
//         toast.error(result.message || "Eroare la trimitere.");
//       } else if (result.status === "success") {
//         setFormData({ name: "", prename: "", email: "", phone: "", message: "" });
//         toast.success("Înscriere trimisă cu succes! Vei primi un email de confirmare.");
//       } else {
//         toast.error("A apărut o problemă. Încearcă din nou.");
//       }
//     } catch {
//       toast.error("Eroare server. Încearcă mai târziu.");
//     } finally {
//       setSubmitting(false);
//     }
//   };
//
//   return (
//     <>
//       <Navbar />
//       {/* <ToastContainer /> */}
//       <section className="signup-container">
//         <div className="signup-head">
//           <h2>Înscriere la ACS Hwarang Academy</h2>
//           <p className="subtitle">Completează detaliile și te contactăm noi pentru următorii pași.</p>
//         </div>
//
//         <form className="form-grid" onSubmit={handleSubmit}>
//           <label className="field">
//             <span>Nume</span>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               placeholder="Popescu"
//               required
//               value={formData.name}
//               onChange={handleChange}
//             />
//           </label>
//
//           <label className="field">
//             <span>Prenume</span>
//             <input
//               type="text"
//               id="prename"
//               name="prename"
//               placeholder="Ion"
//               required
//               value={formData.prename}
//               onChange={handleChange}
//             />
//           </label>
//
//           <label className="field">
//             <span>Email</span>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               placeholder="email@exemplu.com"
//               required
//               value={formData.email}
//               onChange={handleChange}
//             />
//           </label>
//
//           <label className="field">
//             <span>Telefon</span>
//             <input
//               type="tel"
//               id="phone"
//               name="phone"
//               placeholder="07xx xxx xxx"
//               required
//               value={formData.phone}
//               onChange={handleChange}
//             />
//           </label>
//
//           <label className="field field--full">
//             <span>Mesaj (opțional)</span>
//             <textarea
//               id="message"
//               name="message"
//               placeholder="Scrie-ne câteva detalii utile (program, obiective etc.)"
//               rows={4}
//               value={formData.message}
//               onChange={handleChange}
//             />
//           </label>
//
//           <label className="terms-checkbox field--full">
//             <input
//               type="checkbox"
//               id="acceptTerms"
//               checked={acceptTerms}
//               onChange={(e) => setAcceptTerms(e.target.checked)}
//               required
//             />
//             <span>
//               Am citit și accept{" "}
//               <a href="/termeni_si_conditii">Termenii și Condițiile</a>.
//             </span>
//           </label>
//
//           <div className="actions field--full">
//             <button className="btn btn-primary" type="submit" disabled={!acceptTerms || submitting}>
//               {submitting ? "Se trimite..." : "Înscrie-te"}
//             </button>
//           </div>
//
//           <p className="helper field--full">
//             Ai deja cont?{" "}
//             <a className="link" href="/autentificare">
//               Autentifică-te aici
//             </a>
//             .
//           </p>
//         </form>
//       </section>
//       <Footer />
//     </>
//   );
// };
//
// export default JoinForm;
