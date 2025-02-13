import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../scss/myaccount.scss";
import Profile from "../images/profile.webp"
import { API_URL } from "../api/api";

interface Order {
  _id: string;
  email: string;
  items: Array<{ productId: { _id: string; name: string; price: number }; quantity: number }>;
  totalPrice: number;
  status: string;
}

interface DecodedToken {
  email: string;
}

const MyAccountPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      navigate("/login");
      return;
    }

    let decoded: DecodedToken | null = null;

    try {
      decoded = JSON.parse(atob(userToken.split(".")[1])) as DecodedToken;
      if (!decoded || !decoded.email) {
        throw new Error("Invalid token data");
      }
      setUserEmail(decoded.email);
    } catch (error) {
      setErrorMessage("Error decoding token.");
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        
        const filteredOrders = response.data.filter((order: Order) => order.email === decoded?.email);
        setOrders(filteredOrders);
      } catch (error) {
        setErrorMessage("Error fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="my-account-container">
      <h1>Welcome, {userEmail}</h1>
      <div className="profile-section">
        <img src= {Profile} alt="Profile" className="profile-picture" />
      </div>
      <div className="orders-section">
        <h2>My Orders</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {loading ? (
          <p>Loading orders...</p>
        ) : (
          <div>
            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Products</th>
                    <th>Total Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>
                        {order.items.map((item, index) => (
                          <div key={index}>
                            {item.quantity}x {item.productId.name} - ${item.productId.price}
                          </div>
                        ))}
                      </td>
                      <td>${order.totalPrice}</td>
                      <td>{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccountPage;
