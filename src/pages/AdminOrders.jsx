// src/pages/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const allowedStatuses = ["PENDING", "SHIPPED", "DELIVERED"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const normalizeOrders = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.orders)) return data.orders;
    if (Array.isArray(data.data)) return data.data;
    return [];
  };

  const fetchOrders = () => {
    axios
      .get("http://localhost:8080/orders/all")
      .then((res) => {
        console.log("Orders:", res.data);
        setOrders(normalizeOrders(res.data));
      })
      .catch((err) => {
        console.error("Error loading orders:", err);
        setOrders([]);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const changeStatus = (orderId, status) => {
    axios
      .put("http://localhost:8080/orders/updateStatus", null, {
        params: { orderId, status },
      })
      .then((res) => {
        console.log("Status update response:", res.data);
        fetchOrders();
      })
      .catch((err) => {
        console.error("Error updating status:", err);
        alert("Failed to update status. Check console.");
      });
  };

  return (
    <div className="container">
      <h2>Admin – All Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Change Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.orderId}>
                <td>{o.orderId}</td>

                {/* User won't exist unless you REMOVE @JsonIgnore on user */}
                <td>{o.user?.username ?? "N/A"}</td>

                <td>₹ {o.totalAmount}</td>
                <td>{o.status}</td>

                <td>
                  {allowedStatuses.map((st) => (
                    <button
                      key={st}
                      disabled={st === o.status}
                      onClick={() => changeStatus(o.orderId, st)}
                    >
                      {st}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
