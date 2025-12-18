import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/requests";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  useEffect(() => {
    // Not logged in → redirect
    if (!localStorage.getItem("token")) {
      navigate("/signin");
      return;
    }

    api
      .get("/orders/history", {
        params: { username },
      })
      .then((res) => {
        setOrders(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error(err);

        if (err.response?.status === 403) {
          alert("Session expired. Please login again.");
          navigate("/signin");
        }
      });
  }, [username, navigate]);

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
