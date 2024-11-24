import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    try {
      await axios.get('/api/dashboard');
    } catch (error) {
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (!isAuthenticated) return <div>Redirecting...</div>;

  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardPage;