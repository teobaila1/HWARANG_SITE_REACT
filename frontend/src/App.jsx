import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Home from "./pages/Home";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/style.css"
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Orar.css"
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Divider_Why_us.css"
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Navbar.css"
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Footer.css"
import JoinForm from "./pages/JoinForm";
import CalendarPage from "./pages/CalendarPage";
import About from "./pages/About";
import LoginForm from "./pages/LoginForm";
import Register from "./pages/RegisterForm";
import CereriConturi from "./pages/CereriCont";
import AdminDashboard from "./pages/AdminDashboard";
import AccessDenied from "./pages/AccesDenied";
import TotiUtilizatorii from "./pages/AllUsers";
import Coaches from "./pages/Coaches";
import Concursuri from "./pages/Concursuri";
import Documente from "./pages/Documente";
import ScrollToTop from "./components/ScrollToTop";
import TermeniSiConditii from "./pages/TermeniSiConditii";
import AntrenorDashboard from "./pages/AntrenorDashboard";
import ParinteCopii from "./pages/ParinteCopii";
import RegisterExtern from "./pages/RegisterExtern";
// import AntrenorExternDashboard from "./pages/AntrenorExternDashboard";
// import AdminEditareAntrenoriExterni from "./pages/AdminEditareAntrenoriExterni";
import ConcursuriExtern from "./pages/ConcursuriExtern";
import AdminSetPermisiuni from "./pages/AdminSetPermisiuni";
import AdminTotiCopiiiSiParintii from "./pages/AdminTotiCopiiiSiParintii";
import AdminInscrisiConcurs from "./pages/AdminInscrisiConcurs";
import AdminAntrenoriGrupe from "./pages/AdminAntrenoriGrupe";
import CreeazaConcurs from "./pages/CreeazaConcurs";
import InscrisiConcurs from "./pages/InscrisiConcurs";
import AdminPlati from "./pages/AdminPlati";


function App() {
    const rol = localStorage.getItem("rol");

    return (
        <>
            <Router>
                <ScrollToTop/>

                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/calendar2025" element={<CalendarPage/>}/>
                    <Route path="/acasa" element={<Home/>}/>
                    <Route path="/desprenoi" element={<About/>}/>
                    <Route path="/inscriere" element={<JoinForm/>}/>
                    <Route path="/autentificare" element={<LoginForm/>}/>
                    <Route path="/inregistrare" element={<Register/>}/>
                    <Route path="/cereri-conturi" element={<CereriConturi/>}/>
                    <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
                    <Route path="/access-denied" element={<AccessDenied/>}/>
                    <Route path="/toti-utilizatorii" element={<TotiUtilizatorii/>}/>
                    <Route path="/antrenori" element={<Coaches/>}/>
                    <Route path="/concursuri" element={<Concursuri/>}/>
                    <Route path="/documente" element={<Documente/>}/>
                    <Route path="/termeni_si_conditii" element={<TermeniSiConditii/>}/>
                    <Route path="/antrenor_dashboard" element={<AntrenorDashboard/>}/>
                    <Route path="/copiii-mei" element={<ParinteCopii/>}/>
                    <Route path="/toti-copiii" element={<AdminTotiCopiiiSiParintii/>}/>
                    <Route path="/inregistrare-extern" element={<RegisterExtern/>}/>
                    {/*<Route path="/antrenor_extern_dashboard" element={<AntrenorExternDashboard />} />*/}
                    {/*<Route path="/admin-concursuri-antrenori" element={<AdminEditareAntrenoriExterni/>}/>*/}
                    <Route path="/concursuri-extern" element={<ConcursuriExtern/>}/>
                    <Route path="/admin-set-permisiuni" element={<AdminSetPermisiuni/>}/>
                    <Route path="/toti-inscrisi-concurs" element={<AdminInscrisiConcurs/>}/>
                    <Route path="/antrenori-grupe" element={<AdminAntrenoriGrupe/>}/>
                    <Route path="/creeaza-concurs" element={<CreeazaConcurs/>}/>
                    <Route path="/inscrisi/:numeConcurs" element={<InscrisiConcurs/>}/>
                    <Route path="/plati" element={<AdminPlati/>}/>


                    <Route
                        path="/admin_dashboard"
                        element={rol === 'admin' ? <AdminDashboard/> : <Navigate to="/access-denied"/>}
                    />

                    <Route
                        path="/antrenor_dashboard"
                        element={rol === 'Antrenor' ? <AntrenorDashboard/> : <Navigate to="/access-denied"/>}
                    />


                    <Route
                        path="/concursuri-extern"
                        element={rol === 'AntrenorExtern' ? <ConcursuriExtern/> : <Navigate to="/access-denied"/>}
                    />

                </Routes>
            </Router>
        </>
    );
}

export default App;