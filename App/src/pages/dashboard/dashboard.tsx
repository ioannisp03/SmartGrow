import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);  // Assume true, will be checked on mount
  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    try {
      // Check if the user is authenticated
      await axios.get('/api/dashboard');  // Replace with your actual auth check API
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