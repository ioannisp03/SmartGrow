import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";

import { SnackbarProvider } from 'notistack'

import './index.css'

import { AuthProvider } from './services/authcontext';

import Routing from './routes.tsx'

createRoot(document.getElementById('root')!).render(
  <SnackbarProvider autoHideDuration={3000} maxSnack={5}>
    <BrowserRouter>
      <AuthProvider>
        <Routing />
      </AuthProvider>
    </BrowserRouter>
  </SnackbarProvider>
)
