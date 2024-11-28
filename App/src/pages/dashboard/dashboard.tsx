import { CircularProgress, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { useAuth } from '../../services/authcontext';

import "./dashboard.css";

export default function Dashboard(){
  const { user, isAuthenticated, checkAuthStatus } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await checkAuthStatus();
      setLoading(false);
    };

    fetchData();
  }, [user !== null]);

  if (loading || !isAuthenticated) return <CircularProgress color="success" />;

  return (
    <Container maxWidth="xl">
      <Typography variant='h2' component="h3">Welcome, {user?.username}!</Typography>
    </Container>
    
  );
};


