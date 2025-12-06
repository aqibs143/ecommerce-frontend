import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PaymentButton from "../pages/PaymentButton";

export default function ViewCart() {
  const [username] = useState(localStorage.getItem("username") || "");
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState("");
  const [paymentMode, setPaymentMode] = useState("COD");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch Cart Items
  const fetchCart = useCallback(() => {
    if (!username) return;

    axios
      .get("http://localhost:8080/viewCart", { params: { username } })
      .then((res) => setItems(res.data))
      .catch(console.error);
  }, [username]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Update Quantity
  const updateQuantity = (item, newQty) => {
    if (newQty < 1) return;

    axios
      .post("http://localhost:8080/updateCartItem", {
        username,
        productId: item.productId,
        quantity: newQty,
      })
      .then(fetchCart)
      .catch(console.error);
  };

  // Delete item
  const deleteItem = (productId) => {
    axios
      .delete("http://localhost:8080/cart/remove", {
        params: { username, productId },
      })
      .then(fetchCart)
      .catch(console.error);
  };

  // Clear Cart
  const clearCart = () => {
    axios
      .delete("http://localhost:8080/cart/clear", { params: { username } })
      .then(fetchCart)
      .catch(console.error);
  };

  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  // COD Checkout
  const handleCheckout = () => {
    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }

    if (items.length === 0) {
      alert("Cart is empty");
      return;
    }

    setLoading(true);

    axios
      .post("http://localhost:8080/orders/checkout", {
        username,
        address,
        paymentMode,
      })
      .then((res) => {
        alert(`Order placed successfully. Order ID: ${res.data.orderId}`);
        setAddress("");
        fetchCart();
        navigate("/order_history_page");
      })
      .catch((err) => {
        console.error(err);
        alert("Checkout failed");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container">
      <h2>{username}'s Cart</h2>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {/* CART TABLE */}
          <table className="cart-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((it) => (
                <tr key={it.productId}>
                  <td>
                    <img src={it.image} alt={it.name} width="80" />
                  </td>
                  <td>{it.name}</td>
                  <td>₹{it.price}</td>

                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => updateQuantity(it, it.quantity + 1)}
                    >
                      +
                    </button>

                    <span style={{ margin: "0 10px" }}>{it.quantity}</span>

                    <button
                      className="btn btn-secondary"
                      disabled={it.quantity <= 1}
                      onClick={() => updateQuantity(it, it.quantity - 1)}
                    >
                      −
                    </button>
                  </td>

                  <td>₹{it.price * it.quantity}</td>

                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteItem(it.productId)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* CART SUMMARY */}
          <div className="cart-summary">
            <h3>Total: ₹{total}</h3>
            <button className="btn btn-danger" onClick={clearCart}>
              Clear Cart
            </button>
          </div>

          {/* CHECKOUT BOX */}
          <div className="checkout-box">
            <h3>Checkout</h3>

            <textarea
              placeholder="Enter delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            {/* PAYMENT OPTIONS */}
            <div>
              <label>
                <input
                  type="radio"
                  value="COD"
                  checked={paymentMode === "COD"}
                  onChange={(e) => setPaymentMode(e.target.value)}
                />
                Cash on Delivery
              </label>

              <label style={{ marginLeft: "20px" }}>
                <input
                  type="radio"
                  value="ONLINE"
                  checked={paymentMode === "ONLINE"}
                  onChange={(e) => setPaymentMode(e.target.value)}
                />
                Online Payment (Razorpay)
              </label>
            </div>

            {/* COD BUTTON */}
            {paymentMode === "COD" && (
              <button
                className="btn btn-primary"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? "Placing Order..." : "Place COD Order"}
              </button>
            )}

            {/* RAZORPAY BUTTON */}
            {paymentMode === "ONLINE" && (
              <div style={{ marginTop: "20px" }}>
                <PaymentButton username={username} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
