import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/requests"; // USE JWT-AWARE AXIOS

export default function Customer() {
  const [username, setUsername] = useState("");
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // Load all products
  const loadProducts = useCallback(() => {
    api
      .get("/products/getAllProducts")
      .then((res) => {
        setProducts(res.data);

        const q = {};
        res.data.forEach((p) => (q[p.id] = 1));
        setQuantities(q);
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 403) {
          alert("Session expired. Please login again.");
          navigate("/signin");
        }
      });
  }, [navigate]);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (!storedUser) {
      navigate("/signin");
      return;
    }
    setUsername(storedUser);
    loadProducts();
  }, [loadProducts, navigate]);

  // Search products
  const searchProducts = useCallback(() => {
    if (!query.trim()) {
      loadProducts();
      return;
    }

    api
      .get("/products/search", { params: { query } })
      .then((res) => {
        setProducts(res.data);

        const q = {};
        res.data.forEach((p) => (q[p.id] = 1));
        setQuantities(q);
      })
      .catch(console.error);
  }, [query, loadProducts]);

  // Debounced search
  useEffect(() => {
    const delay = setTimeout(searchProducts, 300);
    return () => clearTimeout(delay);
  }, [query, searchProducts]);

  const handleQuantityChange = (pid, val) => {
    setQuantities((prev) => ({
      ...prev,
      [pid]: Math.max(1, parseInt(val, 10) || 1),
    }));
  };

  // Add to cart
  const handleCart = (p) => {
    api
      .post("/addToCart", {
        username,
        productId: p.id,
        quantity: quantities[p.id],
      })
      .then(() => alert("Added to cart!"))
      .catch((err) => {
        console.error(err);
        alert("Failed to add to cart");
      });
  };

  return (
    <div className="container">
      <h2>Welcome, {username}</h2>

      <button
        className="btn btn-primary"
        onClick={() => navigate("/view_cart_page")}
      >
        View Cart
      </button>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" onClick={searchProducts}>
          Search
        </button>
      </div>

      <h2>Available Products</h2>

      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <img src={p.image} alt={p.name} width="80" />
              </td>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>₹{p.price}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={quantities[p.id] || 1}
                  onChange={(e) => handleQuantityChange(p.id, e.target.value)}
                />
              </td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleCart(p)}
                >
                  Add to Cart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
