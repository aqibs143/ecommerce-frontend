import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/requests";
import PaymentButton from "../pages/PaymentButton";

export default function ViewCart() {
  const navigate = useNavigate();

  const [username] = useState(localStorage.getItem("username") || "");
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState("");
  const [paymentMode, setPaymentMode] = useState("COD");
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/signin");
    }
  }, [navigate]);

  // Fetch cart
  const fetchCart = useCallback(() => {
    if (!username) return;

    api
      .get("/viewCart", { params: { username } })
      .then((res) => setItems(res.data))
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 403) {
          alert("Session expired. Login again.");
          navigate("/signin");
        }
      });
  }, [username, navigate]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Update quantity
  const updateQuantity = (item, newQty) => {
    if (newQty < 1) return;

    api
      .post("/updateCartItem", {
        username,
        productId: item.productId,
        quantity: newQty,
      })
      .then(fetchCart)
      .catch(console.error);
  };

  // Remove item
  const deleteItem = (productId) => {
    api
      .delete("/cart/remove", {
        params: { username, productId },
      })
      .then(fetchCart)
      .catch(console.error);
  };

  // Clear cart
  const clearCart = () => {
    api
      .delete("/cart/clear", {
        params: { username },
      })
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

    api
      .post("/orders/checkout", {
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

          {/* CHECKOUT */}
          <div className="checkout-box">
            <h3>Checkout</h3>

            <textarea
              placeholder="Enter delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

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
                Online Payment
              </label>
            </div>

            {paymentMode === "COD" && (
              <button
                className="btn btn-primary"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            )}

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
