import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ toggleTheme }: { toggleTheme: () => void }) => {
  return (
    <header>
      <h1>
        <Link to="/">ChronoLog</Link>
      </h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/admin" className="admin-button">Admin</Link>
        <button onClick={toggleTheme} className="theme-toggle-button">Toggle Theme</button>
      </nav>
    </header>
  );
};

export default Header;
