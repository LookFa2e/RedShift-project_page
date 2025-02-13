import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 
import LogoImage from "../images/red.logo.webp";
import CartIcon from "../images/svg/cart.svg";
import "../scss/nav.scss";

interface DecodedToken {
  id: string;
  email: string;
  exp: number;
  role: string; 
}

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    if (userToken) {
      try {
        const decoded: DecodedToken = jwtDecode(userToken);

        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("userToken"); 
          setIsLoggedIn(false);
          setUsername(null);
          setUserRole(null);
          return;
        }

        const firstName = decoded.email.split("@")[0];
        setUsername(firstName);
        setUserRole(decoded.role);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("userToken"); 
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setUsername(null);
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/login"); 
  };

  const handleMouseEnter = () => setIsDropdownOpen(true);
  const handleMouseLeave = () => setIsDropdownOpen(false);

  const [searchTerm, setSearchTerm] = useState<string>(""); 
    const handleSearch = () => {
      if (searchTerm.trim()) {
        navigate(`/search?name=${encodeURIComponent(searchTerm.trim())}`);
      }
    }

  return (
    <header className="header">
      <div className="header-logo">
        <div className="navbar-logo">
          <Link to="/">
            <img className="nav-logo" src={LogoImage} alt="Logo" />
          </Link>
        </div>
        <div className="logo">
          <samp className="logo-red">Red</samp>Shift
        </div>
      </div>

      <div className="header-action-search">
      <input
           className="search-input"
           type="text"
           placeholder="Search..."
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           onKeyDown={(e) => {
           if (e.key === "Enter") {
          handleSearch();
        }
      }}
      />
        <button className="btn btn-search" onClick={handleSearch}>Search</button>
      </div>
      
      <Link to="/cart">
      <button className="btn btn-cart">
        <img className="cart-icon" src={CartIcon} alt="Cart" />
      </button>
      </Link>

      <div
        className="login-dropdown"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="dropdown">
          <button className="btn btn-login" onClick={toggleDropdown}>
            {username || "Account"} <span className="arrow">&#9660;</span>
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              {isLoggedIn ? (
                <>
                  {userRole === "user" && (
                    <Link to="/account" className="dropdown-item">
                      My Account
                    </Link>
                  )}
                  {userRole === "admin" && (
                   <>
                    <Link to="/dashboard" className="dropdown-item">Dashboard</Link>
                    <Link to ="/products" className="dropdown-item">Products</Link>
                    <Link to="/orders" className="dropdown-item">Orders</Link>
                    <Link to="/users" className="dropdown-item">Users</Link>
                  </>
                  )}
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="dropdown-item">
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;