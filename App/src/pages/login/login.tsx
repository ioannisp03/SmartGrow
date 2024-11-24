import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('/login', { email, password });

            if (response.status === 200) {
                enqueueSnackbar('Successfully logged in!', { variant: 'success' });
                navigate('/dashboard');
            } else {
                enqueueSnackbar('That account does not exist.', { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Invalid email or password.', { variant: 'error' });
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <a href="/register">Register here</a>
            </p>
        </div>
    );
};

export default LoginPage;