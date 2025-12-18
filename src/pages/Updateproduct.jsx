import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function Updateproduct() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const prod = state?.product;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  // Load token once
  const token = localStorage.getItem("token");

  // Initialize safely
  useEffect(() => {
    if (!prod || !prod.id) {
      alert("Invalid product data. Redirecting.");
      navigate("/admin_page");
      return;
    }

    setName(prod.name || "");
    setDescription(prod.description || "");
    setPrice(prod.price?.toString() || "");
    setImage(prod.image || "");
  }, [prod, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!prod?.id) {
      alert("Product ID missing");
      return;
    }

    axios
      .put(
        "http://localhost:8080/products/updateProduct",
        {
          id: prod.id,
          name,
          description,
          price: parseFloat(price), // correct
          image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // JWT
          },
        }
      )
      .then(() => {
        alert("Product updated successfully");
        navigate("/admin_page");
      })
      .catch((err) => {
        console.error(err);
        alert("Error updating product");
      });
  };

  return (
    <div className="container">
      <form className="form-container" onSubmit={handleSubmit}>
        <h2>Update Product</h2>

        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Update Product
        </button>
      </form>
    </div>
  );
}
