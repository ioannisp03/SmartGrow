import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userData, setUserData] = useState({});

  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/user');

      setIsAuthenticated(true);
      setUserData(response);

      console.log(userData);
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