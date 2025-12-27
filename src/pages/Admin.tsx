import React, { useState, useEffect } from 'react';
import Login from '../components/Login';
import AdminPanel from '../components/AdminPanel';

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      {isLoggedIn ? <AdminPanel /> : <Login onLogin={handleLogin} />}
    </div>
  );
};

export default AdminPage;
