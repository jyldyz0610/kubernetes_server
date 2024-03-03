// export default UserLinks;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserLinks = () => {
  const [userLinks, setUserLinks] = useState([]);
  const [error, setError] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editedLink, setEditedLink] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user login state

  useEffect(() => {
    const fetchUserLinks = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_BASE_URL + '/userLinks', {
          // Annahme: Sie haben einen gültigen Token im sessionStorage gespeichert
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('userToken')}`
          }
        });
        setUserLinks(response.data);
      } catch (error) {
        console.error('Error fetching user links:', error);
        setError('Error fetching user links.');
      }
    };

    fetchUserLinks();
  }, []);

  useEffect(() => {
    // Prüfen, ob der Benutzer eingeloggt ist
    const token = sessionStorage.getItem('userToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleEdit = (index, link) => {
    setEditIndex(index);
    setEditedLink(link);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedLink({ ...editedLink, [name]: value });
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditedLink({});
  };

  const handleUpdate = async () => {
    try {
      const token = sessionStorage.getItem('userToken');
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/userLinks/${editedLink.id}`, editedLink, {

        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const updatedLinks = [...userLinks];
      updatedLinks[editIndex] = editedLink;
      setUserLinks(updatedLinks);
      setEditIndex(null);
      setEditedLink({});
    } catch (error) {
      console.error('Error updating user link:', error);
      setError('Error updating user link.');
    }
  };

  const handleDelete = async (id, index) => {
    try {
      const token = sessionStorage.getItem('userToken');
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/userLinks/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const updatedLinks = [...userLinks];
      updatedLinks.splice(index, 1);
      setUserLinks(updatedLinks);
    } catch (error) {
      console.error('Error deleting user link:', error);
      setError('Error deleting user link.');
    }
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <h3>Meine Links</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Kategorie</th>
            <th>Link</th>
            <th>Titel</th>
            <th>Bild</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {userLinks.map((link, index) => (
            <tr key={index}>
              <td>{editIndex === index ? <input type="text" name="category" value={editedLink.category} onChange={handleInputChange} /> : link.category}</td>
              <td>{editIndex === index ? <input type="text" name="link" value={editedLink.link} onChange={handleInputChange} /> : <a href={link.link} target='blank'>{link.link}</a>}</td>
              <td>{editIndex === index ? <input type="text" name="ogTitle" value={editedLink.title} onChange={handleInputChange} /> : link.ogTitle}</td>
              <td><img src={link.ogImage} alt="Bild" style={{ width: '100px', height: '100px' }} /></td>
              <td>
                {isLoggedIn && ( // Nur anzeigen, wenn der Benutzer eingeloggt ist
                  editIndex === index ? (
                    <>
                      <button className="btn btn-success" onClick={handleUpdate}>Speichern</button>
                      <button className="btn btn-secondary" onClick={handleCancelEdit}>Abbrechen</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-primary" onClick={() => handleEdit(index, link)}>Bearbeiten</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(link.id, index)}>Löschen</button>
                    </>
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserLinks;
