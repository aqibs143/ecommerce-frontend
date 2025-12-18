import React from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h3 className="title">Welcome to Sales-Savvy</h3>
      <h5 className="subtitle">Your 1-stop shopping solution</h5>

      <p className="description">
        Discover top deals, hand-picked products, and a seamless shopping
        journey. Start saving time and money today.
      </p>

      <button
        className="btn btn-primary"
        onClick={() => navigate("/sign_in_page")}
      >
        SIGN IN
      </button>

      <button
        className="btn btn-secondary"
        onClick={() => navigate("/sign_up_page")}
      >
        SIGN UP
      </button>
    </div>
  );
}
