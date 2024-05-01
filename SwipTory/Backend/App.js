
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import Dashboard from './components/Dashboard/Dashboard';
import RegistrationPage from './components/RegistrationPage/RegistrationPage';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const username = localStorage.getItem('username');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Dashboard username={username} />} />
        <Route path='/' element={<LoginPage />}></Route>
        <Route path='/dashboard' element={<Dashboard />}></Route>
        <Route path='/register' element={<RegistrationPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;