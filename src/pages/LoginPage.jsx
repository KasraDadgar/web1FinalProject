import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { loginUser } from "../api";
import "../styles.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/menu");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-heading">Log In</h1>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>

        <div className="input-group">
          <label className="input-label" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-button">Log In</button>
      </form>

      <p className="signup-link">
        Don't have an account? <Link to="/signup" className="signup-link-text">Sign Up</Link>
      </p>

    </div>
  );
};

export default LoginPage;
