import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PaymentButton({ address }) {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  // load Razorpay script
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

    // load SDK
    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    // 1️⃣ Create order from backend
    let orderRes;
    try {
      orderRes = await axios.post(
        "http://localhost:8080/payment/create-order",
        null,
        { params: { username } }
      );
    } catch (err) {
      console.error(err);
      alert("Failed to create payment order");
      return;
    }

    const { orderId, amount, currency } = orderRes.data;

    // 2️⃣ Razorpay UI config
    const options = {
      key: "rzp_test_A0pogOFt1fVWQe", // YOUR KEY
      amount,
      currency,
      name: "Sales Savvy",
      description: "Order Payment",
      order_id: orderId,

      // 3️⃣ Payment success handler
      handler: async function (response) {
        try {
          await axios.post("http://localhost:8080/payment/confirm", {
            username,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            address: address || "N/A",
          });

          alert("Payment successful!");
          navigate("/order_history_page");
        } catch (err) {
          console.error(err);
          alert("Payment captured but backend failed!");
        }
      },

      theme: { color: "#3399cc" },
    };

    const paymentWindow = new window.Razorpay(options);
    paymentWindow.open();
  };

  return (
    <button className="btn btn-success" onClick={startPayment}>
      Pay Now (Razorpay)
    </button>
  );
}
