import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MeinBereich() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');
  const [userLinks, setUserLinks] = useState([]);
  const [error, setError] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editedLink, setEditedLink] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user login state
  const [currentPage, setCurrentPage] = useState(1);
  const [linksPerPage] = useState(7);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      sessionStorage.setItem('userToken', token);
      window.history.replaceState(null, null, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = sessionStorage.getItem('userToken');
      try {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/userData', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Fehler beim Abrufen der Nutzerdaten');
        }

        const data = await response.json();
        setUserName(data.name);
        setUserImage(data.profileImage);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchUserLinks = async () => {
      try {
        const token = sessionStorage.getItem('userToken');
        const response = await axios.get(process.env.REACT_APP_API_BASE_URL +'/userLinks', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserLinks(response.data);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error fetching user links:', error);
        setError('Error fetching user links.');
      }
    };

    fetchUserLinks();
  }, [isLoggedIn]);

  const handleEdit = (index, link) => {
    setEditIndex(index);
    setEditedLink(link);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedLink(prevState => ({
      ...prevState,
      [name]: value
    }));
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

  // Paginate function
  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = userLinks.slice(indexOfFirstLink, indexOfLastLink);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div>
      <h2>Mein Bereich</h2>
      {userName && <p>Willkommen, {userName}!</p>}
      {userImage && <img src={userImage} alt="Profilbild" />}
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
          {currentLinks.map((link, index) => (
            <tr key={index}>
              <td>{editIndex === index ? <input type="text" name="category" value={editedLink.category || ''} onChange={handleInputChange} /> : link.category}</td>
              <td>{editIndex === index ? <input type="text" name="link" value={editedLink.link || ''} onChange={handleInputChange} /> : <a href={link.link} target='_blank' rel='noreferrer'>{link.link}</a>}</td>
              <td>{editIndex === index ? <input type="text" name="title" value={editedLink.title || ''} onChange={handleInputChange} /> : link.title}</td>
              <td>{editIndex === index ? <input type="text" name="ogImage" value={editedLink.ogImage || ''} onChange={handleInputChange} /> : <img src={link.ogImage} alt="Bild" style={{ width: '80px', height: '40px' }} />}</td>
              <td>
                {isLoggedIn && (
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
      <Pagination
        linksPerPage={linksPerPage}
        totalLinks={userLinks.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
}

// Pagination component
const Pagination = ({ linksPerPage, totalLinks, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalLinks / linksPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className='pagination'>
        <li className={currentPage === 1 ? 'page-item disabled' : 'page-item'}>
          <button className='page-link' onClick={() => paginate(currentPage - 1)}>
            Vorherige
          </button>
        </li>
        {pageNumbers.map(number => (
          <li key={number} className={number === currentPage ? 'page-item active' : 'page-item'}>
            <button onClick={() => paginate(number)} className='page-link'>
              {number}
            </button>
          </li>
        ))}
        <li className={currentPage === Math.ceil(totalLinks / linksPerPage) ? 'page-item disabled' : 'page-item'}>
          <button className='page-link' onClick={() => paginate(currentPage + 1)}>
            Nächste
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default MeinBereich;
