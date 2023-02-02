import React, { useState, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.scss';

const Answer = lazy(() => import('./pages/answer'));
const Login = lazy(() => import('./pages/login'));

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Answer />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
