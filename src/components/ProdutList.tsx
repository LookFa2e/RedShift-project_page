import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../scss/productList.scss";
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

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
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
        console.error("Invalid user token");
      }
    }
    return [];
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
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

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="product-list">
      <h1>Our Products</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div
            className="product-card"
            key={product._id}
            onClick={() => navigate(`/products/${product._id}`)}
          >
            <div className="product-image">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image-img"
                />
              )}
            </div>
            <div className="product-info">
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>{product.category}</p>
              <div className="product-footer">
                <p className="product-price">Price: ${product.price.toFixed(2)}</p>
                <p className="product-stock">
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </p>
                <p className="product-added">
                  Added on: {new Date(product.createdAt).toLocaleDateString()}
                </p>
                <button
                  onClick={(event) => addToCart(product, event)}
                  disabled={!product.inStock}
                >
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
