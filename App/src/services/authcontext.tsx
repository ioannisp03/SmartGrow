import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import { UserInterface } from '../types/User';

interface AuthContextType {
    user: UserInterface | null;
    isAuthenticated: boolean;
    login: (userData: UserInterface) => void;
    logout: () => void;
    checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { enqueueSnackbar } = useSnackbar();

    const [user, setUser] = useState<UserInterface | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const navigate = useNavigate();

    const checkAuthStatus = async () => {
        try {
            const response = await axios.get('/api/user', { withCredentials: true });
            
            if (response.data.authorized) {
                setUser(response.data.data);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
                navigate('/login');
            }
        } catch (err) {
            setUser(null);
            setIsAuthenticated(false);
            navigate('/login');
        }
    };

    const login = (userData: UserInterface) => {
        setUser(userData);
        setIsAuthenticated(true);
        enqueueSnackbar("Logged into user!", { variant: "success" });
        navigate('/dashboard');
    };

    const logout = async () => {
        setUser(null);
        setIsAuthenticated(false);
        enqueueSnackbar("Logged out of user!", { variant: "success" });

        try {
            await axios.post('/api/logout');
        } catch (err) {
            console.error("Error logging out", err);
        }

        navigate('/login');
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
