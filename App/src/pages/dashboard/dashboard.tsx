import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { UserInterface } from '../../types/User';
import { Container } from '@mui/material';

import axios from 'axios';

const DashboardPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userData, setUserData] = useState<UserInterface | null>(null);

  const { enqueueSnackbar } = useSnackbar();
  
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      enqueueSnackbar("Logout failed. Please try again.", { variant: "error" });
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('/api/user', {
          withCredentials: true,
        });

        const data = response.data;

        if (data.authorized) {
          setUserData(data.data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate('/login');
        }
      } catch (err) {
        enqueueSnackbar("Failed to authenticate. Please try again.", { variant: "error" });
        setIsAuthenticated(false);
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [enqueueSnackbar, navigate]);

  if (!isAuthenticated) return <div>Redirecting...</div>;

  return (
    <Container maxWidth="xl">
      <h1>Welcome, {userData?.username}!</h1>
      <button onClick={handleLogout}>Logout</button>
    </Container>
  );
};

export default DashboardPage;
