import React, { useState } from 'react';
import ERRORS from '../errors'

interface LoginFormProps {
    onLogin: (token: string) => void;
};

interface LoginResponse {
    token: string,
    error?: string
};

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
    // Setup username and password states
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // Send login request to server
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json() as LoginResponse;
            if (data.token) {
                onLogin(data.token);
            } else {
                setError(data.error || ERRORS.DEFAULT_LOGIN_ERROR);
            }
        } catch (err) {
            setError(ERRORS.DEFAULT_LOGIN_ERROR);
        }
    }

    return (
        <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Username" 
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
        />
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>        
    );
};

export default LoginForm;