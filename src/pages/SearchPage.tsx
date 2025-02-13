import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../scss/search.scss";
import SideAds from "../components/SideAds";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "../api/api";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  createdAt: string;
  image?: string;
}

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [cart, setCart] = useState<any[]>(() => {
  const userToken = localStorage.getItem("userToken");

    if (userToken) {
      try {
        const decodedToken: any = jwtDecode(userToken);
        const email = decodedToken?.email;

        if (email) {
          const savedCart = localStorage.getItem(`cart-${email}`);
          return savedCart ? JSON.parse(savedCart) : [];
        }
      } catch (err) {
        console.error("Failed to decode user token:", err);
      }
    }

    return [];
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const name = searchParams.get("name");
      if (!name || name.trim() === "") return;

      setLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/products/search?name=${encodeURIComponent(name)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const addToCart = (product: Product) => {
    const userToken = localStorage.getItem("userToken");

    if (userToken) {
      try {
        const decodedToken: any = jwtDecode(userToken);
        const email = decodedToken?.email;

        if (email) {
          setCart((prevCart) => {
            const updatedCart = [...prevCart];
            const existingItemIndex = updatedCart.findIndex(
              (item) => item._id === product._id
            );

            if (existingItemIndex > -1) {
              updatedCart[existingItemIndex].quantity += 1;
            } else {
              updatedCart.push({
                _id: product._id,
                name: product.name,
                price: product.price,
                quantity: 1,
              });
            }

            localStorage.setItem(`cart-${email}`, JSON.stringify(updatedCart));
            alert("Product added to cart!");
            return updatedCart;
          });
        }
      } catch (err) {
        alert("Failed to decode user token");
      }
    } else {
      alert("You must be logged in to add items to your cart.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="search-page">
      <SideAds />
      <h1>Search Results</h1>
      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="product-grid-search">
          {products.map((product) => (
            <div
              className="product-card"
              key={product._id}
              onClick={() => navigate(`/products/${product._id}`)}
            >
              <div className="product-image">
                {product.image && <img src={product.image} alt={product.name} />}
              </div>
              <div className="product-info">
                <div className="product-header">
                  <p className="product-price">${product.price.toFixed(2)}</p>
                  <p className="product-stock">
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </p>
                </div>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <button
                  className="add-to-cart"
                  disabled={!product.inStock}
                  onClick={() => addToCart(product)} 
                >
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
