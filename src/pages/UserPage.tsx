import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../scss/userpage.scss";
import { API_URL } from "../api/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
  }, [navigate]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get<User[]>(`${API_URL}/users`);
      setUsers(data);
    } catch (err) {
      setError("Error loading users.");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchUsers();
      } else {
        console.error("Error deleting user");
      }
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  return (
    <div className="user-page">
      <h1>User List</h1>
      {error && <p className="error">{error}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.role === "admin" ? "Yes" : "No"}</td>
                <td>
                  <button className="delete-btn" onClick={() => deleteUser(user._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserPage;
