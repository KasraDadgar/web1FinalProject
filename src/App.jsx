import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import BasketPage from './pages/BasketPage';
import AdminPage from './pages/AdminPage';
import './styles.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>

          
          <Route
            path="/"
            element={
              <div className="home-container">
                <h1 className="home-heading">Welcome to the Kasra Restaurant</h1>
                <p className="home-description">Please choose an option:</p>
                <div className="home-buttons-container">
                  <Link to="/signup">
                    <button className="home-button">Sign Up</button>
                  </Link>
                  <Link to="/login">
                    <button className="home-button">Log In</button>
                  </Link>
                </div>
              </div>
            }
          />

          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/basket" element={<BasketPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
