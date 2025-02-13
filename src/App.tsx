import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import CartPage from "./pages/CartPage";
import SearchPage from "./pages/SearchPage";
import ProductDetails from "./pages/ProductDetailsPage";
import OrdersPage from "./pages/OrdersPage";
import ProductEditPage from "./pages/ProductEditPage";
import UserPage from "./pages/UserPage";
import MyAccountPage from "./pages/MyAccountPage";

const App: React.FC = () => {

  return (
    <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<HomePage  />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/products" element={<ProductEditPage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route path="/account" element={<MyAccountPage />} />
      </Routes>
    </Router>
  );
};

export default App;
