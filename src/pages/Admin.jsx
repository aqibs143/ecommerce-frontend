import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:8080"; // optional

export default function Admin() {
  const [products, setProducts] = useState([]); // must start as array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const normalizeProducts = (payload) => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.products)) return payload.products;
    if (Array.isArray(payload.data)) return payload.data;
    if (typeof payload === "object") return [payload];
    return [];
  };

  const fetchProducts = () =>
    axios
      .get("/products/getAllProducts")
      .then((res) => {
        console.log("GET PRODUCTS RESPONSE:", res.data);
        setProducts(normalizeProducts(res.data));
      })
      .catch((err) => {
        console.error("fetchProducts error:", err);
        setError(err.message || "Failed to load products");
      })
      .finally(() => setLoading(false));

  const handleDelete = (id) =>
    axios
      .delete("/products/deleteProduct", { params: { id } })
      .then(() => fetchProducts())
      .catch((err) => {
        console.error("delete error", err);
        setError("Delete failed");
      });

  const handleUpdate = (product) =>
    navigate("/update_prod_page", { state: { product } });

  if (loading) return <div>Loading products…</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      <button className="btn btn-primary" onClick={() => navigate("/add_prod_page")}>
        Add New Product
      </button>

      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Ops</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(products) && products.length > 0 ? (
            products.map((p) => (
              <tr key={p.id ?? p.productId ?? Math.random()}>
                <td>
                  <img src={p.image} alt={p.name} width="80" />
                </td>
                <td>{p.name}</td>
                <td>{p.description}</td>
                <td>{p.price}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleUpdate(p)}>
                    Update
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <p>
        <Link to="/admin_orders_page" className="link-btn">
          View All Orders
        </Link>
      </p>
    </div>
  );
}
