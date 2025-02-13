import React, { useState } from "react";
import "../../scss/authForm.scss"; 

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true); 

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-form-container">
      {isLogin ? (
        <div className="login-form">
          <h2>Login</h2>
          <form>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit" className="btn btn-login">
              Login
            </button>
          </form>
          <p>
            Don't have an account?{" "}
            <span onClick={toggleForm} className="link">
              Register here
            </span>
          </p>
        </div>
      ) : (
        <div className="register-form">
          <h2>Register</h2>
          <form>
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit" className="btn btn-login">
              Register
            </button>
          </form>
          <p>
            Already have an account?{" "}
            <span onClick={toggleForm} className="link">
              Login here
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
