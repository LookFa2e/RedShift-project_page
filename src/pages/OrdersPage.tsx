import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../scss/orders.scss";
import { API_URL } from "../api/api";

interface Order {
  _id: string;
  email: string;
  items: Array<{ productId: { _id: string; name: string; price: number }; quantity: number }>;
  totalPrice: number;
  status: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]); 
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      navigate("/login");
    } else {
      try {
        const decoded: any = JSON.parse(atob(userToken.split(".")[1]));
        if (decoded.role !== "admin") {
          setErrorMessage("You are not authorized to view this page.");
          navigate("/");
        }
      } catch (error) {
        setErrorMessage("Error decoding token.");
        navigate("/login");
      }
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        setErrorMessage("Error fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleChangeStatus = async (orderId: string, status: string) => {
    try {
      const response = await axios.put(
        `${API_URL}/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: response.data.status } : order
        )
      );
    } catch (error) {
      setErrorMessage("Error updating order status.");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this order?");
    if (confirmed) {
      try {
        await axios.delete(`${API_URL}/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });
        setOrders(orders.filter(order => order._id !== orderId)); 
      } catch (error) {
        setErrorMessage("Error deleting order.");
      }
    }
  };

  return (
    <div className="orders-container">
      <h1>Orders </h1>
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
                  <th>Email</th>
                  <th>Products</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.email}</td>
                    <td>
                      {order.items.map((item, index) => (
                        <div key={index}>
                          {item.quantity}x {item.productId.name} - ${item.productId.price}
                        </div>
                      ))}
                    </td>
                    <td>${order.totalPrice}</td>
                    <td>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) => handleChangeStatus(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="actions-column">
                      <button onClick={() => handleDeleteOrder(order._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
