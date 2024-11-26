import { Button, CircularProgress, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { useAuth } from '../../services/authcontext';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, logout, checkAuthStatus } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await checkAuthStatus();
      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (loading) return <CircularProgress color="success" />;
  if (!isAuthenticated) return <div>Redirecting...</div>;

  return (
    <Container maxWidth="xl">
      <Typography variant='h2' component="h3">Welcome, {user?.username}!</Typography>
      
      <Button
        type="button"
        variant="contained"
        color="primary"
        style={{ padding: "10px 20px", fontSize: "16px" }}
        onClick={logout}
      >Logout</Button>
    </Container>
  );
};

export default DashboardPage;
