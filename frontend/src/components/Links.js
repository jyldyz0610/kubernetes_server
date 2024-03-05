import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LinksTable = () => {
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [error, setError] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editedLink, setEditedLink] = useState({});
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user login state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7); // Number of items per page
  const maxPagesToShow = 6; // Maximum number of page buttons to show

  useEffect(() => {
    const token = sessionStorage.getItem('userToken');
    if (token) {
      setIsLoggedIn(true); // If token exists in session storage, user is logged in
    }

    const fetchLinks = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_BASE_URL + '/links', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setLinks(response.data);
        setFilteredLinks(response.data); // Initialize filteredLinks with all links
      } catch (error) {
        console.error('Fehler beim Abrufen der Links:', error);
        setError('Fehler beim Abrufen der Links.');
      }
    };

    fetchLinks();
  }, []);

  useEffect(() => {
    // Apply sorting whenever sortBy or sortOrder changes
    if (sortBy) {
      const sortedLinks = [...filteredLinks].sort((a, b) => {
        if (sortOrder === 'asc') {
          return a[sortBy].localeCompare(b[sortBy]);
        } else {
          return b[sortBy].localeCompare(a[sortBy]);
        }
      });
      setFilteredLinks(sortedLinks);
    }
  }, [sortBy, sortOrder, filteredLinks]);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedLink(filteredLinks[index]);
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
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/links/${editedLink.id}`, editedLink, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const updatedLinks = [...filteredLinks];
      updatedLinks[editIndex] = editedLink;
      setLinks(updatedLinks);
      setFilteredLinks(updatedLinks);
      setEditIndex(null);
      setEditedLink({});
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Links:', error);
      setError('Fehler beim Aktualisieren des Links.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem('userToken');
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/links/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const updatedLinks = filteredLinks.filter(link => link.id !== id);
      setLinks(updatedLinks);
      setFilteredLinks(updatedLinks);
    } catch (error) {
      console.error('Fehler beim Löschen des Links:', error);
      setError('Fehler beim Löschen des Links.');
    }
  };

  const handleSort = (columnName) => {
    if (columnName !== 'id') {
      if (sortBy === columnName) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(columnName);
        setSortOrder('asc');
      }
    }
  };

  const handleFilter = (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = links.filter(link =>
      link.category.toLowerCase().includes(keyword) ||
      link.link.toLowerCase().includes(keyword) ||
      link.ogTitle.toLowerCase().includes(keyword) ||
      link.ogDescription.toLowerCase().includes(keyword)
    );
    setFilteredLinks(filtered);
    setCurrentPage(1); // Reset current page to 1 when filtering
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);

  // Calculate index of the first and last item to be displayed
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Get current items to be displayed
  const currentItems = filteredLinks.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate which pages to show
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  const pagesToShow = [...Array(endPage - startPage + 1).keys()].map(i => startPage + i);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <input type="text" className="form-control" placeholder="Search..." onChange={handleFilter} />
      <table className="table table-striped" style={{ backgroundColor: "silver" }}>
        <thead style={{ backgroundColor: "silver", color: "black" }}>
          <tr>
            <th style={{ color: "silver" }} onClick={() => handleSort('id')}>ID</th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('category')}>Kategorie</th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('link')}>Link</th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('ogTitle')}>Titel</th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('ogDescription')}>Beschreibung</th>
            <th>Bild</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((link, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{editIndex === index ? <input type="text" name="category" value={editedLink.category} onChange={handleInputChange} /> : link.category}</td>
              <td>{editIndex === index ? <input type="text" name="link" value={editedLink.link} onChange={handleInputChange} /> : <a href={link.link} target='blank'>{link.link}</a>}</td>
              <td>{editIndex === index ? <input type="text" name="ogTitle" value={editedLink.ogTitle} onChange={handleInputChange} /> : link.ogTitle}</td>
              <td>{editIndex === index ? <input type="text" name="ogDescription" value={editedLink.ogDescription} onChange={handleInputChange} /> : link.ogDescription}</td>
              <td>
                {editIndex === index ?
                  <input type="text" name="ogImage" value={editedLink.ogImage} onChange={handleInputChange} />
                  :
                  link.ogImage && <img src={link.ogImage} alt="Bild" style={{ width: '80px', height: '40px' }} />
                }
              </td>
              <td>
                {isLoggedIn && (
                  editIndex === index ? (
                    <>
                      <button className="btn btn-success" onClick={handleUpdate}>Speichern</button>
                      <button className="btn btn-secondary" onClick={handleCancelEdit}>Abbrechen</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-primary" onClick={() => handleEdit(index)}>Bearbeiten</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(link.id)}>Löschen</button>
                    </>
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="pagination">
        <li className={currentPage === 1 ? 'page-item disabled' : 'page-item'}>
          <button className="page-link" onClick={() => paginate(1)}>Vorherige</button>
        </li>
        {pagesToShow.map(page => (
          <li key={page} className={currentPage === page ? 'page-item active' : 'page-item'}>
            <button className="page-link" onClick={() => paginate(page)}>{page}</button>
          </li>
        ))}
        <li className={currentPage === totalPages ? 'page-item disabled' : 'page-item'}>
          <button className="page-link" onClick={() => paginate(totalPages)}>Nächste</button>
        </li>
      </ul>
    </div>
  );
};

export default LinksTable;
