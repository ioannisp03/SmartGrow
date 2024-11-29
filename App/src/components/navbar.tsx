import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import axios from 'axios';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import LoginIcon from '@mui/icons-material/Login';

import { useAuth } from '../services/authcontext';

function ResponsiveAppBar() {
  const navigate = useNavigate();

  const { isAuthenticated, logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/logout');

      if (response.status === 200) {
        logout();
      } else {
        enqueueSnackbar('You are currently not logged in.', { variant: 'error' });
      }
    } catch {
      enqueueSnackbar('Cannot logout at this moment. Try again later.', { variant: 'error' });
    }

    handleCloseUserMenu();
  }

  return (
    <AppBar position="static" sx={{ background: "#00AF3A" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >SmartGrow</Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            ><MenuIcon /></IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              <MenuItem key="Home" onClick={() => navigate("/")}>
                <Typography sx={{ textAlign: 'center' }}>Home</Typography>
              </MenuItem>

              <MenuItem key="About" onClick={() => navigate("/About")}>
                <Typography sx={{ textAlign: 'center' }}>About</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >SmartGrow</Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              key="Home"
              onClick={() => navigate("/")}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >Home</Button>
            <Button
              key="About"
              onClick={() => navigate("/About")}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >About</Button>
          </Box>
          {isAuthenticated ? (<Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User Avatar" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key="Account" onClick={() => navigate("/account")}><Typography sx={{ textAlign: 'center' }}>Account</Typography></MenuItem>
              <MenuItem key="Dashboard" onClick={() => navigate("/dashboard")}><Typography sx={{ textAlign: 'center' }}>Dashboard</Typography></MenuItem>
              <MenuItem key="Logout" onClick={handleLogout}><Typography sx={{ textAlign: 'center' }}>Logout</Typography></MenuItem>
            </Menu>
          </Box>) : (
            <Button
              key="Login"
              onClick={() => navigate("/login")}
              sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center' }}
            >
              <LoginIcon sx={{ mr: .5 }} />Login
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;