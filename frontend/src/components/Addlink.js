import React, { useState } from 'react';
import axios from 'axios';
// import Links from './Links';

const App = () => {
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const [metaTags, setMetaTags] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e, token) => {
    e.preventDefault();

    // Überprüfung, ob eine Kategorie ausgewählt wurde
    if (!category) {
      setErrorMessage('Please select a category');
      return;
    }

    try {
      const completedUrl = url.startsWith('http') ? url : `https://${url}`;
      const response = await axios.post(process.env.REACT_APP_API_BASE_URL + '/post-link', { url: completedUrl, category }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setMetaTags(response.data.metaTags);
        setErrorMessage('');
      } else {
        setErrorMessage(response.data.error);
      }
    } catch (error) {
// Fehlermeldung für eine ungültige Domain, bereits vorhandenen Link oder leeren String
console.error('Error posting link:', error.response.data);
if (error.response && error.response.status === 400) {
  if (error.response.data.error === 'Invalid domain') {
    setErrorMessage('Invalid domain. Please enter a valid URL.');
  } else if (error.response.data.error === 'Link already exists') {
    setErrorMessage('Link already exists in database.');
  } else if (error.response.data.error === 'Empty link') {
    setErrorMessage('Link cannot be empty. Please enter a valid URL.');
  } else {
    setErrorMessage('An error occurred while processing your request.');
  }
} else {
  setErrorMessage('Unauthorized access. Please log in.');
}

    }
  };

  return (
    <div className="container">
      <div className="text-center">
        <h1>Add your Link here</h1>
        <form onSubmit={(e) => handleSubmit(e, sessionStorage.getItem('userToken'))} className="mb-3">
          <div className="row align-items-center">
            <div className="col">
              <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="form-control" placeholder="Enter URL" />
            </div>
            <div className="col-auto ml-auto"> {/* Hier wird die Kategorieauswahl rechts ausgerichtet */}
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-control">
                <option value="">Select category</option>
                <option value="Linux">Linux</option>
                <option value="AWS">Amazon Web Services</option>
                <option value="Python">Python</option>
                <option value="DevOps">DevOps</option>
                <option value="Maschinelles Lernen (Machine Learning)">Machine Learning</option>
                <option value="Data Science">Data Science</option>
                <option value="Webentwicklung">Webentwicklung</option>
                <option value="Others">Others</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary">Send link</button>
            </div>
          </div>
        </form>
        {errorMessage && <div className="error mt-2">{errorMessage}</div>}
      </div>
      <div className="row justify-content-center">
        <div className="col-8">
          {Object.entries(metaTags).map(([name, content], index) => (
            <div key={index} className="meta-tag">
              <strong>{name}: </strong>
              {name === 'og:image' ? <img src={content} alt="" /> : content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
