import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: ""
  });

  const handleClick = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:5000/token', {
      username: loginForm.username,
      password: loginForm.password
    })
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
  }

  return (
    <div>
      {/*login form*/}
      <form>
        <input type="text" placeholder="username" onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })} />
        <input type="password" placeholder="password" onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
        <button type="submit" onClick={handleClick}>Login</button>
      </form>
    </div>
  );
}

export default App;
