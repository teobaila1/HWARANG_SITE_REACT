import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import "../static/css/style.css";
import "../static/css/Orar.css";
import "../static/css/Divider_Why_us.css";
import "../static/css/Navbar.css";
import "../static/css/Footer.css";

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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Galerie from "./pages/Gallery/Galerie";
import Training from "./Kickbox/Trainings";
import FooterKickbox from "./components/FooterKickbox";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/acasa" element={<Home />} />
          <Route path="/desprenoi" element={<About />} />
          <Route path="/calendar2025" element={<CalendarPage />} />
          <Route path="/termeni_si_conditii" element={<TermeniSiConditii />} />
          <Route path="/inscriere" element={<JoinForm />} />
          <Route path="/autentificare" element={<LoginForm />} />
          <Route path="/inregistrare" element={<Register />} />
          <Route path="/inregistrare-extern" element={<RegisterExtern />} />
          <Route path="/resetare-parola" element={<CerereResetareParola />} />
          <Route path="/resetare-parola/:token" element={<ResetareParolaForm />} />
          <Route path="/galerie" element={<Galerie />} />
          <Route path="/training" element={<Training />} />
          <Route path="/access-denied" element={<AccessDenied />} />

          {/* Doar autentificați (indiferent de rol) */}
          <Route
            path="/documente"
            element={
              <ProtectedRoute allow="any">
                <Documente />
              </ProtectedRoute>
            }
          />
          <Route
            path="/concursuri"
            element={
              <ProtectedRoute allow="any">
                <Concursuri />
              </ProtectedRoute>
            }
          />

          {/* Antrenor & Admin */}
          <Route
            path="/antrenor_dashboard"
            element={
              <ProtectedRoute allow="roles" roles={["Antrenor", "admin"]}>
                <AntrenorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inscrisi/:numeConcurs"
            element={
              <ProtectedRoute allow="roles" roles={["Antrenor", "admin"]}>
                <InscrisiConcurs />
              </ProtectedRoute>
            }
          />

          {/* Părinte (& Admin, dacă vrei să aibă acces) */}
          <Route
            path="/copiii-mei"
            element={
              <ProtectedRoute allow="roles" roles={["Parinte", "admin"]}>
                <ParinteCopii />
              </ProtectedRoute>
            }
          />

          {/* Antrenor Extern (& Admin) */}
          <Route
            path="/concursuri-extern"
            element={
              <ProtectedRoute allow="roles" roles={["AntrenorExtern", "admin"]}>
                <ConcursuriExtern />
              </ProtectedRoute>
            }
          />

          {/* Admin only */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allow="roles" roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-set-permisiuni"
            element={
              <ProtectedRoute allow="roles" roles={["admin"]}>
                <AdminSetPermisiuni />
              </ProtectedRoute>
            }
          />
          <Route
            path="/toti-copiii"
            element={
              <ProtectedRoute allow="roles" roles={["admin"]}>
                <AdminTotiCopiiiSiParintii />
              </ProtectedRoute>
            }
          />
          <Route
            path="/toti-utilizatorii"
            element={
              <ProtectedRoute allow="roles" roles={["admin"]}>
                <TotiUtilizatorii />
              </ProtectedRoute>
            }
          />
          <Route
            path="/antrenori-grupe"
            element={
              <ProtectedRoute allow="roles" roles={["admin"]}>
                <AdminAntrenoriGrupe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/toti-inscrisi-concurs"
            element={
              <ProtectedRoute allow="roles" roles={["admin"]}>
                <AdminInscrisiConcurs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/creeaza-concurs"
            element={
              <ProtectedRoute allow="roles" roles={["admin"]}>
                <CreeazaConcurs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plati"
            element={
              <ProtectedRoute allow="roles" roles={["admin"]}>
                <AdminPlati />
              </ProtectedRoute>
            }
          />

          {/* Pagini publice despre antrenori (dacă vrei public, lasă fără ProtectedRoute) */}
          <Route path="/antrenori" element={<Coaches />} />


          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>

      <ToastContainer
        position="top-center"
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

      {/* Dacă folosești un footer global */}
      {/* <FooterKickbox /> */}
    </>
  );
}

export default App;
