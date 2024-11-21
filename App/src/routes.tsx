import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import App from "./routes/home/home"
import History from "./routes/history/history"

const Routing: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
};

export default Routing;