import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../scss/cart.scss"; 
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

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]); 
  const [products, setProducts] = useState<Product[]>([]); 
  const [email, setEmail] = useState<string | null>(null); 
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      alert("You need to be logged in to view your cart.");
      navigate("/login");
    } else {
      try {
        const decoded: any = JSON.parse(atob(userToken.split(".")[1]));
        if (decoded.role !== "user") {
          setErrorMessage("You are not authorized to view this page.");
          navigate("/");
        }
      } catch (error) {
        setErrorMessage("Error decoding token.");
        navigate("/login");
      }
    }
    const getUserEmail = () => {
      if (userToken) {
        try {
          const decodedToken: any = jwtDecode(userToken);
          return decodedToken?.email || null;
        } catch (err) {
          console.error("Failed to decode token", err);
        }
      }
      return null;
    };

    const userEmail = getUserEmail();
    setEmail(userEmail);

    if (userEmail) {
      const savedCart = localStorage.getItem(`cart-${userEmail}`);
      setCart(savedCart ? JSON.parse(savedCart) : []);
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await response.json();
        setProducts(data);
        localStorage.setItem("products", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const updateCartInLocalStorage = (updatedCart: CartItem[]) => {
    if (email) {
      setCart(updatedCart);
      localStorage.setItem(`cart-${email}`, JSON.stringify(updatedCart));
    }
  };

  const addOneItem = (id: string, price: number) => {
    const updatedCart = [...cart];
    const productIndex = updatedCart.findIndex((item) => item._id === id);
    if (productIndex !== -1) {
      updatedCart[productIndex].quantity += 1;
    } else {
      updatedCart.push({ _id: id, name: "Product Name", price, quantity: 1 });
    }
    updateCartInLocalStorage(updatedCart);
  };

  const removeOneItem = (id: string) => {
    const updatedCart = [...cart];
    const productIndex = updatedCart.findIndex((item) => item._id === id);
    if (productIndex !== -1) {
      if (updatedCart[productIndex].quantity > 1) {
        updatedCart[productIndex].quantity -= 1;
      } else {
        updatedCart.splice(productIndex, 1);
      }
      updateCartInLocalStorage(updatedCart);
    }
  };

  const removeItem = (id: string) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    updateCartInLocalStorage(updatedCart);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getProductImage = (id: string) => {
    const product = products.find((prod) => prod._id === id);
    return product?.image || "";
  };

  const handleBackToProducts = () => {
    navigate("/");
  };

  const handlePlaceOrder = async () => {
    if (!email) {
      alert("You need to be logged in to place an order.");
      return;
    }

    try {
      const orderData = {
        email,
        items: cart.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        totalPrice: calculateTotal(),
      };

      const response = await axios.post(`${API_URL}/orders`, orderData, {
        withCredentials: true, 
      });

      if (response.status === 201) {
        alert("Order placed successfully!");
        localStorage.removeItem(`cart-${email}`); 
        setCart([]); 
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order!");
    }
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul>
            {cart.map((item) => (
              <li key={item._id}>
                <div className="product-details">
                  <img src={getProductImage(item._id)} alt={item.name} className="product-image" />
                  <div className="info">
                    <h3>{item.name}</h3>
                    <p>
                      ${item.price.toFixed(2)} x {item.quantity} = $
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="actions">
                  <div className="quantity-controls">
                    <button className="remove-one" onClick={() => removeOneItem(item._id)}>
                      <i className="fa fa-minus" />
                    </button>
                    <span>{item.quantity}</span>
                    <button className="add-one" onClick={() => addOneItem(item._id, item.price)}>
                      <i className="fa fa-plus" />
                    </button>
                  </div>
                  <button className="remove-all" onClick={() => removeItem(item._id)}>
                    <i className="fa fa-trash" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <h2>Total: ${calculateTotal().toFixed(2)}</h2>
          <button className="place-order" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      )}
      <button className="back-to-products" onClick={handleBackToProducts}>
        Back to Products
      </button>
    </div>
  );
};

export default CartPage;
