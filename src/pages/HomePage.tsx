import React from "react";
import "../scss/home.scss"; 
import WallImage from "../images/wall.shop red.webp"
import ProductList from "../components/ProdutList";

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <main className="main">
        <div className="main-image">
          <img src={WallImage} alt="Shop" />
        </div>
        <section className="home-central-section">
          <ProductList />
        </section>
      </main>
      <footer className="footer">
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </div>
        <p>© 2024 My RedShift. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
