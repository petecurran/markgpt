import React, { useState, lazy, useEffect, Suspense } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
//import jwt from 'jsonwebtoken';
import axios from 'axios';
import './App.scss';

const Answer = lazy(() => import('./pages/answer'));
const Login = lazy(() => import('./pages/login'));

function App() {

  const [authToken, setAuthToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleToken = (token, refresh_token) => {
    setAuthToken(token);
    setRefreshToken(refresh_token);
    setIsLoggedIn(true);
    // Save tokens to local storage
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refresh_token);
  }

  const handleLogout = () => {
    setAuthToken(null);
    setRefreshToken(null);
    setIsLoggedIn(false);
    // Remove token from local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }

  // Check if token is in local storage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token){
      setAuthToken(token);
      setIsLoggedIn(true);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [navigate])

  // Refresh token if needed
  /*
  const handleRefreshToken = () => {
    if (authToken && refreshToken){
      // Check if the token is expired
      const decodedToken = jwt.decode(authToken);
      const currentTime = Date.now() / 1000;

      // Check if the refresh token is expired
      const decodedRefreshToken = jwt.decode(refreshToken);
      
      if (decodedToken.exp < currentTime && decodedRefreshToken.exp < currentTime){
        // Both tokens are expired
        handleLogout();
      } else if (decodedToken.exp < currentTime){
        // Auth token is expired, refresh
        axios.post('http://127.0.0.1:5000/refresh', {
          refresh_token: refreshToken
        })
        .then(res => {
          handleToken(res.data.access_token, res.data.refresh_token);
        })
        .catch(error => {
          console.log(error.response.data.msg);
        })
      }
    }
  }
  */






  useEffect (() => {
    if (isLoggedIn === false){
      navigate('/login');
    } else {
      navigate('/');
    }
  }, [isLoggedIn, navigate])

  return (
    <div className="page-container">
      <Routes>
        <Route path="/" element={
        <Suspense fallback={<div>Loading...</div>}>
          <Answer handleLogout={handleLogout} authToken={authToken} refreshToken={refreshToken} />
        </Suspense>
        } />
        
        <Route path="/login" element={
        <Suspense fallback={<div>Loading...</div>}>
          <Login handleToken={handleToken} />
        </Suspense>
        } />
        
      </Routes>
    </div>
  );
}

export default App;
