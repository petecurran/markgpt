import React, { useState, lazy, useEffect, Suspense } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import './App.scss';

const Answer = lazy(() => import('./pages/answer'));
const Login = lazy(() => import('./pages/login'));

function App() {

  const [authToken, setAuthToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleToken = (token) => {
    setAuthToken(token);
    setIsLoggedIn(true);
    // Save token to local storage
    localStorage.setItem('authToken', token);
  }

  const handleLogout = () => {
    setAuthToken(null);
    setIsLoggedIn(false);
    // Remove token from local storage
    localStorage.removeItem('authToken');
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
          <Answer handleLogout={handleLogout} authToken={authToken}/>
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
