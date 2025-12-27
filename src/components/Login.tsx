import React, { useState } from 'react';

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would want to use a more secure way to handle passwords.
    if (password === 'admin') {
      sessionStorage.setItem('isLoggedIn', 'true');
      onLogin();
    } else {
      alert('Wrong password');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;