import React, { useState } from 'react';
import ERRORS from '../errors'

interface RegisterFormProps {
    onRegister: (token: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
    // Setup registration form states
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure passwords match
        if (password !== confirmPassword) {
            alert(ERRORS.PASSWORD_NOT_MATCHING_CONFIRM);
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                alert(ERRORS.DEFAULT_REGISTER_ERROR);
                return;
            }

            alert("Registration successful! Please log in.");

        } catch (error) {
            alert(ERRORS.DEFAULT_REGISTER_ERROR);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input 
            type="text"
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
        <input 
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
        />
        <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;
