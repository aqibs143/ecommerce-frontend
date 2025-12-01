// src/pages/OrderHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OrderHistory() {
  const [username] = useState(localStorage.getItem("username") || "");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!username) return;
    axios
      .get("http://localhost:8080/orders/history", {
        params: { username },
      })
      .then((res) => setOrders(res.data))
      .catch(console.error);
  }, [username]);

  return (
    <div className="container">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.orderId}>
                <td>{o.orderId}</td>
                <td>₹ {o.totalAmount}</td>
                <td>{o.status}</td>
                <td>{o.paymentMode}</td>
                <td>{new Date(o.orderDate).toLocaleString()}</td>
                <td>{o.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
