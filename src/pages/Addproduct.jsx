import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/requests"; // JWT-enabled axios

export default function Addproduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [sku, setSku] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    api
      .post("/products/addProduct", {
        name,
        description,
        price: parseFloat(price),
        sku,
        stockQuantity: parseInt(stockQuantity, 10),
        image,
      }) // token attached automatically
      .then(() => {
        alert("Product added!");
        navigate("/admin_page");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error adding product");
      });
  };

  return (
    <div className="container">
      <form className="form-container" onSubmit={handleSubmit}>
        <h2>Add New Product</h2>

        <div className="form-group">
          <label>Product Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>SKU:</label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Stock Quantity:</label>
          <input
            type="number"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Image URL:</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Add Product
        </button>
      </form>
    </div>
  );
}
