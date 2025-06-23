import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ setSearchQuery, auth, username, onLogout, theme, toggleTheme }) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(search);
  };

  const textColor = theme === "light" ? "text-success" : "text-light";

  const handleLogoutClick = () => {
    if (onLogout) onLogout();
    navigate("/");
  };

  // Movies link: go to /customer if logged in, /login if not
  const handleMoviesClick = (e) => {
    e.preventDefault();
    if (auth) {
      navigate("/customer");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg bg-${theme} shadow-sm py-2`}>
      <div className="container-fluid">
        {/* Brand/Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/" style={{ fontWeight: 700 }}>
          {/* <img
            src={logo}
            alt="TicketNest Logo"
            width="33"
            height="33"
            className="me-2"
            style={{ objectFit: "contain", borderRadius: "8px" }}
          /> */}
          <span className={`fs-4 ${textColor}`}> Tickets Nest 🎬</span>
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          {/* Menu Links */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${textColor}`} to="/">
                <i className="bi bi-house-door-fill me-1"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${textColor}`}
                href="#"
                onClick={handleMoviesClick}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-film me-1"></i> Movies
              </a>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${textColor}`} to="/contact">
                <i className="bi bi-envelope-fill me-1"></i> Contact Us
              </Link>
            </li>
          </ul>

          {/* Search Bar */}
          <form className="d-flex me-3" role="search" onSubmit={handleSearch}>
            <input
              type="search"
              className={`form-control me-2 bg-${theme} ${textColor} border-success`}
              placeholder="Search movies"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ minWidth: "180px", borderRadius: "20px" }}
            />
            {/* <button
              className={`btn ${theme === "light" ? "btn-outline-success" : "btn-success"}`}
              type="submit"
              style={{ borderRadius: "20px", fontWeight: 500 }}
            > */}
              <i class="bi bi-search"></i>
            {/* </button> */}
          </form>
              
          {/* Notification & Auth Buttons */}
          <div className="d-flex align-items-center gap-2">
            <button className="btn position-relative btn-link p-0 me-2" style={{ fontSize: "1.3rem" }}>
              <i className="bi bi-bell"></i>
              {/* Example notification dot */}
              {/* <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span> */}
            </button>
            {auth ? (
              <>
                <span className={`me-2`}>
                  Hi, <strong>{username}</strong>
                </span>
                <button className="btn btn-outline-secondary me-2" onClick={handleLogoutClick}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`btn btn-outline-success me-2 ${textColor}`}>
                  Login
                </Link>
                <Link to="/register" className={`btn btn-success me-2 `}>
                  Register
                </Link>
              </>
            )}
            {/* <button
              className={`btn btn-sm ${theme === "light" ? "btn-dark" : "btn-light"}`}
              onClick={toggleTheme}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              style={{ borderRadius: "50%" }}
            >
              {theme === "light" ? "🌙" : "🔆"}
            </button> */}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

