import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('/register', { username, email, password }, { headers: { 'Content-Type': 'application/json', } });

            if (response.status === 201) {
                enqueueSnackbar('Successfully created account!', { variant: 'success' });
                navigate('/login');
            } else {
                enqueueSnackbar("Email already registered.", { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Failed to register. Please try again.', { variant: 'error' });
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
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

                <button type="submit">Register</button>
            </form>
            
            <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
    );
};

export default RegisterPage;