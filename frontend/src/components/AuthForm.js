import React, { useState } from 'react';
import axios from 'axios';

const AuthForm = ({ type }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (type === 'register') {
        response = await axios.post(process.env.REACT_APP_API_BASE_URL + '/register', { username, email, password });
      } else if (type === 'login') {
        response = await axios.post(process.env.REACT_APP_API_BASE_URL + '/login', { email, password });
      }
      console.log(response.data);
      // handle success, e.g., redirect to dashboard
    } catch (error) {
      console.error(`Error ${type} user:`, error);
      setErrorMessage(`Error ${type} user`);
    }
  };

  return (
    <div>
      <h2>{type === 'register' ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {type === 'register' && (
          <div>
            <label>Username:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
        )}
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">{type === 'register' ? 'Register' : 'Login'}</button>
      </form>
      {errorMessage && <div>Error: {errorMessage}</div>}
    </div>
  );
};

export default AuthForm;