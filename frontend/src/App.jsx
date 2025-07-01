import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
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


function App() {

    return (
        <>
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
                </Routes>
        </>
    );
}

export default App;