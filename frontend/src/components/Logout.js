import React from 'react';
import axios from 'axios';

const Logout = () => {
  const handleLogout = async () => {
    const token = sessionStorage.getItem('userToken');

    if (!token) {
      console.error('Token not found');
      return;
    }

    try {
      // Senden Sie eine POST-Anfrage an die Logout-Route auf dem Server
      const response = await axios.post(process.env.REACT_APP_API_BASE_URL + '/logout', null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Logout successful:', response.data);
      
      // Löschen Sie das Token aus dem sessionStorage
      sessionStorage.removeItem('userToken');

      // Optional: Weiterleitung zur Startseite oder eine andere Seite nach erfolgreichem Logout
      window.location.href = '/links'; // Beispiel: Weiterleitung zur Startseite
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <a href="#" onClick={handleLogout} className="nav-link"><b>Logout</b></a>
  );
};

export default Logout;
