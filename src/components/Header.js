import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <h1>Interview Experience Platform</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/submissions">Submissions</Link>
        <Link to="/submit-experience">Submit Experience</Link>
      </nav>
    </header>
  );
};

export default Header;
