import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import Logout from './Logout';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('userToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('userToken');
    setIsLoggedIn(false);
    setShowLogoutMessage(true);
  
    setTimeout(() => {
      // Überprüfe, ob das Element noch im DOM ist
      if (showLogoutMessage) {
        setShowLogoutMessage(false);
      }
      navigate("/links");
    }, 3000);
  };

  const handleLogin = () => {
    sessionStorage.setItem('userToken', 'yourTokenHere'); // Hier setzen Sie den Token, den Sie vom Server erhalten haben
    setIsLoggedIn(true);
  };

  return (
    <header className="sticky-header">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" style={{ textShadow: "2px 2px 2px black", color: "#fcf806f3" }} href="/">Knowledge<sup>App</sup></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/about"><b>About</b></a>
              </li>
              {isLoggedIn && (
                <li className="nav-item">
                  <a className="nav-link" href="/myspace"> <b>My space</b></a>
                </li>
              )}
              <li className="nav-item">
                <a className="nav-link" href="/addlink"><b>Add link</b></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/links"><b>Links</b></a>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto">
              {isLoggedIn ? (
                <li className="nav-item">
                  <button className="nav-link" onClick={handleLogout}><b>Logout</b></button>
                </li>
              ) : (
                <li className="nav-item">
                  <a className="nav-link" href={`${process.env.REACT_APP_API_BASE_URL}/auth/google`} onClick={handleLogin}><b>Login</b></a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      {/* Bootstrap-Meldung für den erfolgreichen Logout */}
      {showLogoutMessage && (
        <div className="alert alert-success alert-dismissible fade show d-flex justify-content-center" role="alert">
          You have been logged out successfully!
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
    </header>
  );
}

export default Header;
