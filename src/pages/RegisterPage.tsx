import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../scss/regiForm.scss";
import { API_URL } from "../api/api";

interface CustomJwtPayload {
  email: string;
  exp: number;
}

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      navigate("/");
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
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setErrorMessage(data.message || "Failed to register.");
      }
    } catch (error) {
      setErrorMessage("Error connecting to the server. Please try again later.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1 className="register-title">Register</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          <label className="register-label" htmlFor="email">
            Email:
          </label>
          <input
            className="register-input"
            type="email"
            id="email"
            value={email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
          <label className="register-label" htmlFor="password">
            Password:
          </label>
          <input
            className="register-input"
            type="password"
            id="password"
            value={password}
            onChange={handleInputChange}
            placeholder="Enter your password"
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button className="register-button" type="submit">
            Register
          </button>
        </form>
        <p className="register-footer-text">
          Already have an account?{" "}
          <a className="register-login-link" href="/login">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
