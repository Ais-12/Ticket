import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Customer from "./components/Customer/Customer";
import RoleBased from "./components/RoleBased";
import Unauthorized from "./components/Unauthorized";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";
import BookTickets from "./components/Customer/BookTickets";
import AdminDashboard from "./components/Admin/AdminDashBoard";
import MovieManagement from "./components/Admin/MovieManagement";
import TheaterManagement from "./components/Admin/TheaterManagement";
import ShowManagement from "./components/Admin/ShowManagement";
import Seat from "./components/Customer/Seat"; 
import UserManagement from "./components/Admin/UserManagement";
import BookingConfirmation from './components/Customer/BookingConfirmation';
import Contact from "./components/Contact";
import ContactQueries from "./components/Admin/ContactQueries";


function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") || "light"
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const handleLogin = (username, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    setAuth(true);
    setUsername(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setAuth(false);
    setUsername("");
  };

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Navbar
          auth={auth}
          username={username}
          onLogout={handleLogout}
          theme={theme}
          toggleTheme={toggleTheme}
          setSearchQuery={setSearchQuery}
        />
        <div className="card shadow-sm flex-grow-1">
          <div className="card-body">
            <Routes>
              <Route path="/" element={<Home searchQuery={searchQuery} />} />
              <Route path="/customer" element={<Customer searchQuery={searchQuery} />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login setAuth={setAuth} onLogin={handleLogin} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route
                path="/admin"
                element={
                  <RoleBased allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </RoleBased>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <RoleBased allowedRoles={["admin"]}>
                    <UserManagement />
                  </RoleBased>
                }
              />
              <Route
                path="/admin/movies"
                element={
                  <RoleBased allowedRoles={["admin"]}>
                    <MovieManagement />
                  </RoleBased>
                }
              />
              <Route
                path="/admin/theaters"
                element={
                  <RoleBased allowedRoles={["admin"]}>
                    <TheaterManagement />
                  </RoleBased>
                }
              />
              <Route
                path="/admin/shows"
                element={
                  <RoleBased allowedRoles={["admin"]}>
                    <ShowManagement />
                  </RoleBased>
                }
              />
              <Route 
              path="/admin/contact-queries" 
              element={<RoleBased allowedRoles={["admin"]}>
                    <ContactQueries />
                  </RoleBased>
              } 
              />

              <Route
                path="/book/:id"
                element={
                  <RoleBased allowedRoles={["customer"]}>
                    <BookTickets />
                  </RoleBased>
                }
              />
              <Route
                path="/select-seats/:showId"
                element={
                  <RoleBased allowedRoles={["customer"]}>
                    <Seat />
                  </RoleBased>
                }
              />
              <Route
                path="/booking-confirmation"
                element={
                  <RoleBased allowedRoles={["customer"]}>
                    <BookingConfirmation />
                  </RoleBased>
                }
              />
            </Routes>
          </div>
        </div>
        <Footer theme={theme} />
      </div>
    </BrowserRouter>
  );
}

export default App;

