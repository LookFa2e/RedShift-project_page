import React, { useEffect, useState } from "react";
import axios from "axios";
import "../scss/product-edit.scss";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  description: string;
  image: string;
}

const ProductEditPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    inStock: "true",
    description: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
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
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      setErrorMessage("Error fetching products.");
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`${API_URL}/products/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      setErrorMessage("Error deleting product.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProduct({ ...newProduct, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddProduct = async () => {
    const price = parseFloat(newProduct.price);
    const inStock = newProduct.inStock === "true";

    if (!newProduct.name || isNaN(price) || !newProduct.category || !newProduct.description || !newProduct.image) {
      setErrorMessage("All fields are required and must be valid.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", price.toString());
      formData.append("category", newProduct.category);
      formData.append("inStock", inStock.toString());
      formData.append("description", newProduct.description);
      formData.append("image", newProduct.image);

      const response = await axios.post(`${API_URL}/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProducts([...products, response.data]);
      setNewProduct({ name: "", price: "", category: "", inStock: "true", description: "", image: null });
      setImagePreview(null);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Error adding product.");
      console.error(error);
    }
  };

  const handleStockChange = async (productId: string, newStock: boolean) => {
    try {
      await axios.put(`${API_URL}/products/${productId}`, { inStock: newStock });
      setProducts(
        products.map((product) =>
          product._id === productId ? { ...product, inStock: newStock } : product
        )
      );
    } catch (error) {
      setErrorMessage("Error updating stock status.");
    }
  };

  return (
    <div className="product-edit-container">
      <h1>Product Management</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}

      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-img"
                />
              </td>
              <td>{product.name}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.category}</td>
              <td>
                <select
                  className="stock-select"
                  value={product.inStock.toString()}
                  onChange={(e) => handleStockChange(product._id, e.target.value === "true")}
                >
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
              </td>
              <td>{product.description}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(product._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="add-product">
        <h2>Add New Product</h2>
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />

      <div className="input-group">
        <select className="stock-select" value={newProduct.inStock} onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.value })}>
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>

        <div className="browse-btn-wrapper">
          <button className="browse-btn">Select photo</button>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
      </div>

      {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
        <button className="add-btn" onClick={handleAddProduct}>
          Add Product
        </button>
      </div>
    </div>
  );
};

export default ProductEditPage;
