import { FC } from 'react';

import { Route, Routes } from 'react-router-dom';

import Navbar from './components/navbar';
import Footer from './components/footer'

import App from './pages/home/home';
import Login from './pages/login/login';
import Register from './pages/register/register';
import Dashboard from './pages/dashboard/dashboard';
import Devices from './pages/devices/devices';
import Error from './pages/error/error';

const Routing: FC = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/devices' element={<Devices />} />
        <Route path='/devices/:id' element={<Dashboard />} />
        <Route path="*" element={<Error />} />
      </Routes>

      <Footer />
    </>
  );
};


export default Routing;