// src/pages/OrderHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OrderHistory() {
  const [username] = useState(localStorage.getItem("username") || "");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!username) return;

    axios
      .get("http://localhost:8080/orders/history", { params: { username } })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        } else {
          setOrders([]);
        }
      })
      .catch(console.error);
  }, [username]);

  return (
    <div className="container">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.orderId} className="order-box">
            <h3>Order #{order.orderId}</h3>

            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Payment Mode:</strong> {order.paymentMode}
            </p>
            <p>
              <strong>Total Amount:</strong> ₹{order.totalAmount}
            </p>
            <p>
              <strong>Address:</strong> {order.address}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.orderDate).toLocaleString()}
            </p>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}
