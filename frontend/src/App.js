import React, { useState, lazy, useEffect, Suspense } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import './App.scss';

const Answer = lazy(() => import('./pages/answer'));
const Login = lazy(() => import('./pages/login'));

function App() {

  const [authToken, setAuthToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [questionSubmitted, setQuestionSubmitted] = useState(false);
  const [response, setResponse] = useState(null);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  // Handle token from login
  const handleToken = (token, refresh_token) => {
    setAuthToken(token);
    setRefreshToken(refresh_token);
    setIsLoggedIn(true);

    // Save tokens to local storage
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refresh_token);
  }

  // Update the username whenever the user logs in
  useEffect (() => {
    // Trigger when authToken changes
    if (authToken){    
        // Decode the token to get the username
        const decodedToken = jwt_decode(authToken);
        setUsername(decodedToken.sub);
    } else {
        setUsername(null);
    }
  }, [authToken])


   // Refresh token if needed
   const handleRefreshToken = () => {
    // Check if the tokens are in local storage
    const authToken = localStorage.getItem('authToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (authToken && refreshToken){
      // Check if the token is expired
      // Decode the tokens to get the expiration time
      const decodedToken = jwt_decode(authToken);
      const decodedRefreshToken = jwt_decode(refreshToken);
      // Get the current time
      const currentTime = Date.now() / 1000;
      
      // Check if both tokens have expired
      if (decodedToken.exp < currentTime && decodedRefreshToken.exp < currentTime){
        // Both tokens are expired, logout
        handleLogout();
        return false;
        // Check if the auth token has expired, or has less than 5 minutes left
      } else if (decodedToken.exp < currentTime || decodedToken.exp - currentTime < 300){
        // Refresh the token
        axios.post('http://127.0.0.1:5000/refresh',{},{
          headers: {
            'Authorization': 'Bearer ' + refreshToken
          }
        })
        .then(res => {
          // Handle the new tokens and save to local storage
          setAuthToken(res.data.access_token);
          localStorage.setItem ('authToken', res.data.access_token);
        })
        .catch(error => {
          // Handle error
          console.log(error.response.data.msg);
        })
        return true;
      } else {
        // If neither token is expired, return true
        return true;
      }
    // If the tokens are not in local storage, return false
    } return false;
  }

  // Logout scripts
  const handleLogout = () => {
    setAuthToken(null);
    setRefreshToken(null);
    setIsLoggedIn(false);
    // Remove token from local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }

  // Check if token is in local storage and handle refreshes.
  useEffect(() => {
    setAuthToken(localStorage.getItem('authToken'));
    setRefreshToken(localStorage.getItem('refreshToken'));
    if (handleRefreshToken()){
      setIsLoggedIn(true);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [navigate])

  // Direct users when they arrive at the site
  useEffect (() => {
    if (isLoggedIn === false){
      navigate('/login');
    } else {
      navigate('/');
    }
  }, [isLoggedIn, navigate])

  // Handle answer submission
  const handleAnswer = (question, currentAnswer) => {
    // Check if the token is expired
    if (handleRefreshToken()){
      // Send the answer to the backend
      axios.post('http://127.0.0.1:5000/submitanswer', {
        question_id: question.id,
        answer: currentAnswer,
        marks: question.marks
      }, {
        headers: {
          "Authorization": "Bearer " + authToken
        }
      })
      .then(res => {
        // Display the response
        // Breakdown of code below:
        // data -> the content of the axios response
        // choices -> the choices array within the data
        // [0] -> the first choice in the choices array
        // message -> the message object within the choice
        // content -> the content of the message object
        //console.log(res.data.choices[0].message.content);
        setResponse(res.data.choices[0].message.content);
      })
      .catch(error => {
        // Handle error
        console.log(error.response.data.msg);
      })

      // Set the flag to show we've successfully submitted.
      setQuestionSubmitted(true);
    } else {
      // TODO - what if the token has expired?
      // If the token is expired, logout
      handleLogout();
    }
  }

  const clearAnswer = () => {
    setQuestionSubmitted(false);
  }
      


  return (
    <div className="page-container">
      <Routes>
        <Route path="/" element={
        <Suspense fallback={<div>Loading...</div>}>
          <Answer handleLogout={handleLogout} 
                  authToken={authToken} 
                  refreshToken={refreshToken} 
                  handleAnswer={handleAnswer}
                  username={username}
                  questionSubmitted={questionSubmitted}
                  clearAnswer={clearAnswer}
                  response={response}/>
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
