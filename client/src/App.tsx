import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import TasksPage from './components/TasksPage';

const App: React.FC = () => {
    // Stores the JWT returned by the backend upon login
    const [token, setToken] = useState<string | null>(null);
    // showRegister toggles between showing the login or register form.
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        // On initial load, check localStorage for an existing token.
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const handleLogin = (token: string) => {
        // Save the token to localStorage and update state
        localStorage.setItem('token', token);
        setToken(token);
    };

    const handleLogout = () => {
        // Remove the token from localStorage and update state
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <div>
            {token ? (
                <>
                    <button onClick={handleLogout}>Logout</button>
                    {/* TasksPage is rendered when authenticated */}
                    <TasksPage token={token} />
                </>
            ) : (
                // If not authenticated, display the auth forms
                <div>
                    {showRegister ? (
                        <div>
                            <RegisterForm onRegister={handleLogin} />
                            <p>
                                Already have an account?{" "}
                                <button onClick={() => setShowRegister(false)}>
                                    Login here
                                </button>
                            </p>
                        </div>
                    ) : (
                        <div>
                            <LoginForm onLogin={handleLogin} />
                            <p>
                                Don't have an account?{" "}
                                <button onClick={() => setShowRegister(true)}>
                                    Register here
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default App;
