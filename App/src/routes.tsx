import React from 'react';
import { Route, Routes } from 'react-router-dom';

import App from './pages/home/home';
import Login from './pages/login/login';
import Register from './pages/register/register';

const Routing: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default Routing;