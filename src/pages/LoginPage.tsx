import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 
import "../scss/authForm.scss";
import { API_URL } from "../api/api";

interface CustomJwtPayload {
  email: string;
  exp: number;
  role: string; 
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      const decodedToken = jwtDecode<CustomJwtPayload>(userToken);
      const userRole = decodedToken.role;

      if (userRole === "admin") {
        navigate("/dashboard"); 
      } else {
        navigate("/"); 
      }
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "email") {
      setEmail(value);
    } else if (id === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userToken", data.token);

        const decodedToken = jwtDecode<CustomJwtPayload>(data.token);
        const userRole = decodedToken.role;

        if (userRole === "admin") {
          setTimeout(() => {
            navigate("/dashboard");
            window.location.reload(); 
          }, 100); 
        } else {
          setTimeout(() => {
            navigate("/");
            window.location.reload();
          }, 100);
        }
      } else {
        setErrorMessage(data.message || "Invalid email or password.");
      }
    } catch (error) {
      setErrorMessage("Error connecting to the server. Please try again later.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Login</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="email">
            Email:
          </label>
          <input
            className="login-input"
            type="email"
            id="email"
            value={email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
          <label className="login-label" htmlFor="password">
            Password:
          </label>
          <input
            className="login-input"
            type="password"
            id="password"
            value={password}
            onChange={handleInputChange}
            placeholder="Enter your password"
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button className="login-button" type="submit">
            Login
          </button>
        </form>
        <p className="login-footer-text">
          Don't have an account?{" "}
          <a className="login-register-link" href="/register">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
