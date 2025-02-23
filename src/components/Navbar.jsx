import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const Navbar = () => {
  return (
    <nav className="navbar-container">
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/menu" className="navbar-link">Menu</Link>
        <Link to="/login" className="navbar-link">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
