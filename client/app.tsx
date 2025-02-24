import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import TasksPage from './components/TasksPage';

const App: React.FC = () => {
  // token stores the JWT returned by the backend upon login
  const [token, setToken] = useState<string | null>(null);
  // showRegister toggles between showing the login or register form.
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div>
        {token ? (
        // When authenticated, display the tasks page
        <TasksPage token={token} />
        ) : (
        // If not authenticated, display the auth forms
        <div>
            {showRegister ? (
            <div>
                <RegisterForm onRegister={setToken} />
                <p>
                Already have an account?{" "}
                <button onClick={() => setShowRegister(false)}>
                    Login here
                </button>
                </p>
            </div>
            ) : (
            <div>
                <LoginForm onLogin={setToken} />
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
