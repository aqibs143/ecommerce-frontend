import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/requests";

export default function PaymentButton({ address }) {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  // Load Razorpay SDK
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const startPayment = async () => {
    if (!username) {
      alert("User not logged in");
      return;
    }

    // Load Razorpay SDK
    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    try {
      // Create order (JWT automatically attached)
      const orderRes = await api.post("/payment/create-order", null, {
        params: { username },
      });

      const { orderId, amount, currency } = orderRes.data;

      const options = {
        key: "rzp_test_A0pogOFt1fVWQe", // your Razorpay key
        amount,
        currency,
        name: "Sales Savvy",
        description: "Order Payment",
        order_id: orderId,

        handler: async function (response) {
          try {
            // Confirm payment (JWT attached)
            await api.post("/payment/confirm", {
              username,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              address: address || "N/A",
            });

            alert("Payment successful!");
            navigate("/order_history_page");
          } catch (err) {
            console.error(err);
            alert("Payment captured but backend confirmation failed");
          }
        },

        theme: { color: "#3399cc" },
      };

      const paymentWindow = new window.Razorpay(options);
      paymentWindow.open();
    } catch (err) {
      console.error(err);

      if (err.response?.status === 403) {
        alert("Session expired. Please login again.");
      } else {
        alert("Failed to create payment order");
      }
    }
  };

  return (
    <button className="btn btn-success" onClick={startPayment}>
      Pay Now (Razorpay)
    </button>
  );
}
