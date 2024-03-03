import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LatestLinks = () => {
  const [latestLinks, setLatestLinks] = useState([]);

  useEffect(() => {
    const fetchLatestLinks = async () => {
      try {
        const token = sessionStorage.getItem('userToken'); // Token aus dem sessionStorage abrufen
        const response = await axios.get(process.env.REACT_APP_API_BASE_URL + '/latestlinks', {
          headers: {
            'Authorization': `Bearer ${token}` // Token im Authorization-Header senden
          }
        });
        setLatestLinks(response.data);
      } catch (error) {
        console.error('Error fetching latest links:', error);
      }
    };

    fetchLatestLinks();
  }, []);

  return (
    <div>
      <h3>Neueste Links</h3>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        {latestLinks.map((link, index) => (
          <div key={index} style={{ margin: '0 10px' }}>
            <p>{link.ogTitle}</p>
            <p><a href={link.link} target="_blank" rel="noopener noreferrer">{link.link}</a></p>
            <p>{link.category}</p>
            <img src={link.ogImage} alt="Bild" style={{ width: '100px', height: '100px' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestLinks;

