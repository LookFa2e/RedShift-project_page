import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../scss/productDetails.scss";
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

const ProductDetails: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const addToCart = (product: Product) => {
    const userToken = localStorage.getItem("userToken");

    if (userToken) {
      try {
        const decodedToken: any = jwtDecode(userToken);
        const email = decodedToken?.email;

        if (email) {
          const cartKey = `cart-${email}`; 
          const cart: CartItem[] = JSON.parse(localStorage.getItem(cartKey) || "[]");

          const existingItemIndex = cart.findIndex((item) => item._id === product._id);

          if (existingItemIndex >= 0) {
            cart[existingItemIndex].quantity += 1;
          } else {
            cart.push({
              _id: product._id,
              name: product.name,
              price: product.price,
              quantity: 1,
            });
          }

          localStorage.setItem(cartKey, JSON.stringify(cart));
          alert("Product added to cart!"); 
        }
      } catch (err) {
        alert("Failed to decode user token");
      }
    } else {
      alert("You must be logged in to add items to your cart.");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/products/${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setProduct(data);
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

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="detail-product-details">
      <h1>{product.name}</h1>
      {product.image && <img src={product.image} alt={product.name} className="detail-product-image" />}
      <div className="detail-product-info">
        <p>{product.description}</p>
        <p>Category: {product.category}</p>
        <p>Price: ${product.price.toFixed(2)}</p>
        <p>In Stock: {product.inStock ? "Yes" : "No"}</p>
        <p>Added on: {new Date(product.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="detail-actions">
        <button className="detail-back-button" onClick={() => navigate(-1)}>
          Back
        </button>
        <button
          className="detail-add-to-cart"
          onClick={() => addToCart(product)}
          disabled={!product.inStock}
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
