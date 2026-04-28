import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate, Outlet} from "react-router-dom";
import Home from "./pages/Home";
import "../static/css/style.css"
import "../static/css/Orar.css"
import "../static/css/Divider_Why_us.css"
import "../static/css/Navbar.css"
import "../static/css/Footer.css"
import About from "./pages/Documents&Calendar/About";
import LoginForm from "./pages/Login/LoginForm";
import Register from "./pages/Register/RegisterForm";
import CereriConturi from "./pages/Register/CereriCont";
import AdminDashboard from "./pages/Admins/AdminDashboard";
import AccessDenied from "./pages/Documents&Calendar/AccesDenied";
import TotiUtilizatorii from "./pages/AllUsers/AllUsers";
import Coaches from "./pages/Coaches/Coaches";
import Concursuri from "./pages/Competitions/Concursuri";
import Documente from "./pages/Documents&Calendar/Documente";
import TermeniSiConditii from "./pages/Documents&Calendar/TermeniSiConditii";
import AntrenorDashboard from "./pages/Coaches/AntrenorDashboard";
import ParinteCopii from "./pages/Parents/ParinteCopii";
import RegisterExtern from "./pages/Register/RegisterExtern";
// import ConcursuriExtern from "./pages/Competitions/ConcursuriExtern";
import AdminSetPermisiuni from "./pages/Admins/AdminSetPermisiuni";
import AdminTotiCopiiiSiParintii from "./pages/Admins/AdminTotiCopiiiSiParintii";
import AdminInscrisiConcurs from "./pages/Admins/AdminInscrisiConcurs";
import AdminAntrenoriGrupe from "./pages/Admins/AdminAntrenoriGrupe";
import CreeazaConcurs from "./pages/Competitions/CreeazaConcurs";
import InscrisiConcurs from "./pages/Competitions/InscrisiConcurs";
import AdminPlati from "./pages/Admins/AdminPlati";
import ResetareParolaForm from "./pages/ResetPassword/ResetareParolaForm";
import CerereResetareParola from "./pages/ResetPassword/CerereResetareParola";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Galerie from "./pages/Gallery/Galerie";
import Training from "./Kickbox/Trainings";
import ScannerPage from "./pages/ScannerPage";
import CalendarClub from "./pages/Documents&Calendar/CalendarClub";
// import PaginaPrezenta from './pages/PaginaPrezenta';
// import IstoricPrezenteCopil from './components/IstoricPrezenteCopil';
// import PaginaPrezentaFamilie from "./pages/PaginaPrezentaFamilie";
import ProtectedRoute from "./components/ProtectedRoute";


import "./styles/theme.css";          /* rename --border first */
import "./styles/mobile_overrides.css"; /* fix filename typo first */


function App() {
    // NOTĂ: Am eliminat calcularea rolului aici.
    // Verificarea se face acum în timp real în componentele Guard de jos.

    return (
        <>
            <Router>
                <Routes>
                    {/* ==================================================== */}
                    {/* ZONA PUBLICĂ (Accesibilă oricui, fără login)         */}
                    {/* ==================================================== */}
                    <Route path="/" element={<Home/>}/>
                    <Route path="/acasa" element={<Home/>}/>
                    <Route path="/desprenoi" element={<About/>}/>
                    <Route path="/autentificare" element={<LoginForm/>}/>
                    <Route path="/inregistrare" element={<Register/>}/>
                    <Route path="/inregistrare-extern" element={<RegisterExtern/>}/>
                    <Route path="/termeni_si_conditii" element={<TermeniSiConditii/>}/>
                    <Route path="/resetare-parola" element={<CerereResetareParola/>}/>
                    <Route path="/resetare-parola/:token" element={<ResetareParolaForm/>}/>
                    <Route path="/access-denied" element={<AccessDenied/>}/>
                    <Route path="/training" element={<Training/>} />
                    <Route path="/galerie" element={<Galerie/>}/>
                    <Route path="/antrenori" element={<Coaches/>}/>

                    {/* ==================================================== */}
                    {/* ZONA PROTEJATĂ (Trebuie să fii LOGAT)                */}
                    {/* ==================================================== */}
                    <Route element={<ProtectedRoute />}>

                        {/* 1. PAGINI COMUNE (Accesibile oricărui user logat: Sportiv, Părinte, Antrenor) */}
                        <Route path="/concursuri" element={<Concursuri/>}/>
                        <Route path="/documente" element={<Documente/>}/>
                        <Route path="/calendar" element ={<CalendarClub/>} />
                        <Route path="/antrenori" element={<Coaches/>}/>
                        <Route path="/inscrisi/:numeConcurs" element={<InscrisiConcurs/>}/>
                        {/* Unele rute pot fi accesate de toți, dar conținutul diferă (ex: scan) */}
                        <Route path="/scan" element={<ScannerPage />} />
                        <Route path="/prezenta/grupa/:id" element={<PaginaPrezenta />} />
                        <Route path="/prezenta/copil/:id" element={<IstoricPrezenteCopil />} />

                        {/* 2. RUTE SPECIFICE PĂRINȚI (Protejate de ParinteGuard) */}
                        <Route element={<ParinteGuard />}>
                            <Route path="/copiii-mei" element={<ParinteCopii/>}/>
                            <Route path="/prezenta/familie" element={<PaginaPrezentaFamilie />} />
                        </Route>

                        {/* 3. RUTE SPECIFICE ANTRENORI (Protejate de AntrenorGuard) */}
                        <Route element={<AntrenorGuard />}>
                            <Route path="/antrenor_dashboard" element={<AntrenorDashboard/>}/>
                        </Route>

                        {/* 4. RUTE SPECIFICE ADMIN (Protejate de AdminGuard) */}
                        <Route element={<AdminGuard />}>
                            <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
                            <Route path="/toti-utilizatorii" element={<TotiUtilizatorii/>}/>
                            <Route path="/cereri-conturi" element={<CereriConturi/>}/>
                            <Route path="/toti-copiii" element={<AdminTotiCopiiiSiParintii/>}/>
                            <Route path="/admin-set-permisiuni" element={<AdminSetPermisiuni/>}/>
                            <Route path="/toti-inscrisi-concurs" element={<AdminInscrisiConcurs/>}/>
                            <Route path="/antrenori-grupe" element={<AdminAntrenoriGrupe/>}/>
                            <Route path="/creeaza-concurs" element={<CreeazaConcurs/>}/>
                            <Route path="/plati" element={<AdminPlati/>}/>
                        </Route>

                        {/* RUTE EXTERN (Dacă ai nevoie în viitor) */}
                        {/* <Route path="/concursuri-extern" element={<ConcursuriExtern/>} /> */}

                    </Route>

                </Routes>
            </Router>

            <ToastContainer
                position="bottom-center"
                autoClose={2000}
                theme="dark"
                limit={3}
                style={{ zIndex: 999999 }}
            />
        </>
    );
}

// =========================================================
// COMPONENTE GUARD (PAZNICI)
// Acestea citesc rolul din LocalStorage în momentul accesării
// =========================================================

const AdminGuard = () => {
    const rawRol = localStorage.getItem("rol");
    const rol = (rawRol || "").trim().toLowerCase();

    // Doar ADMIN are voie
    return rol === 'admin' ? <Outlet /> : <Navigate to="/access-denied" replace />;
};

const AntrenorGuard = () => {
    const rawRol = localStorage.getItem("rol");
    const rol = (rawRol || "").trim().toLowerCase();

    // ANTRENOR sau ADMIN au voie
    if (rol === 'antrenor' || rol === 'admin') {
        return <Outlet />;
    }
    return <Navigate to="/access-denied" replace />;
};

const ParinteGuard = () => {
    const rawRol = localStorage.getItem("rol");
    const rol = (rawRol || "").trim().toLowerCase();

    // PĂRINTE sau ADMIN au voie (Adminul are voie oriunde pentru debug)
    if (rol === 'parinte' || rol === 'admin') {
        return <Outlet />;
    }
    return <Navigate to="/access-denied" replace />;
};

export default App;