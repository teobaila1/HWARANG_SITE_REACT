import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Home from "./pages/Home";
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/style.css"
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Orar.css"
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Divider_Why_us.css"
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Navbar.css"
import "C:/Users/Teo/Desktop/Site_Hwarang/vite_hwarang_react/frontend/static/css/Footer.css"
import JoinForm from "./pages/Login/JoinForm";
import CalendarPage from "./pages/Documents&Calendar/CalendarPage";
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
// import ScrollToTop from "./components/ScrollToTop";
import TermeniSiConditii from "./pages/Documents&Calendar/TermeniSiConditii";
import AntrenorDashboard from "./pages/Coaches/AntrenorDashboard";
import ParinteCopii from "./pages/Parents/ParinteCopii";
import RegisterExtern from "./pages/Register/RegisterExtern";
// import AntrenorExternDashboard from "./pages/AntrenorExternDashboard";
// import AdminEditareAntrenoriExterni from "./pages/AdminEditareAntrenoriExterni";
import ConcursuriExtern from "./pages/Competitions/ConcursuriExtern";
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
import FooterKickbox from "./components/FooterKickbox";


function App() {
    const rol = localStorage.getItem("rol");

    return (
        <>
            <Router>

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
                    <Route path="/resetare-parola/:token" element={<ResetareParolaForm/>}/>
                    <Route path="/resetare-parola" element={<CerereResetareParola/>}/>
                    <Route path="/galerie" element={<Galerie/>}/>
                    <Route path="/training" element={<Training/>} />



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

            <ToastContainer
                position="top-center"     // mijloc sus
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss={false}
                pauseOnHover={false}
                draggable={false}
                theme="dark"
                limit={1}
            />

        </>
    );
}

export default App;