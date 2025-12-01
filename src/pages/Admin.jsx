import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = () =>
    axios
      .get("http://localhost:8080/products/getAllProducts")
      .then((res) => setProducts(res.data))
      .catch(console.error);

  const handleDelete = (id) =>
    axios
      .get("http://localhost:8080/deleteProduct", { params: { id } })
      .then(fetchProducts)
      .catch(console.error);

  const handleUpdate = (product) =>
    navigate("/update_prod_page", { state: { product } });

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      
      <button
        className="btn btn-primary"
        onClick={() => navigate("/add_prod_page")}
      >
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
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <img src={p.image} alt={p.name} width="80" />
              </td>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.price}</td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleUpdate(p)}
                >
                  Update
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Link */}
      <p>
        <Link to="/admin_orders_page" className="link-btn">
          View All Orders
        </Link>
      </p>
    </div>
  );
}
