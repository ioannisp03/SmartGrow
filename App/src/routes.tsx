import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Navbar from './components/navbar';

import App from './pages/home/home';
import Login from './pages/login/login';
import Register from './pages/register/register';

const Routing: React.FC = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
    
  );
};

export default Routing;