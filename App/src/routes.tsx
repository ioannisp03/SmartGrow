import React from 'react';
import { Route, Routes } from 'react-router-dom';

import App from './pages/home/home';
import History from './pages/history/history';

const Routing: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/history" element={<History />} />
    </Routes>
  );
};

export default Routing;