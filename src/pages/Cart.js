import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = [...cartItems];
    updatedCart[index].quantity = newQuantity;
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const getSubtotal = () => {
    return cartItems
      .reduce((total, item) => {
        return total + parseFloat(item.price) * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-content">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M9 2L7.17 4H3C2.45 4 2 4.45 2 5V19C2 19.55 2.45 20 3 20H21C21.55 20 22 19.55 22 19V5C22 4.45 21.55 4 21 4H16.83L15 2H9Z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started</p>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1>Shopping Cart</h1>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  {item.variations &&
                    Object.keys(item.variations).length > 0 && (
                      <div className="cart-item-variations">
                        {Object.entries(item.variations).map(([key, value]) => (
                          <span key={key}>
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                  <p className="cart-item-price">
                    ${parseFloat(item.price).toFixed(2)}
                  </p>
                </div>

                <div className="cart-item-quantity">
                  <button
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-total">
                  <p>${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                </div>

                <button
                  className="cart-item-remove"
                  onClick={() => removeItem(index)}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${getSubtotal()}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>${getSubtotal()}</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>

            <Link to="/" className="continue-shopping-link">
              Continue Shopping
            </Link>

            <div className="cart-benefits">
              <div className="benefit-item">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Free shipping over $100</span>
              </div>
              <div className="benefit-item">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span>30-day return policy</span>
              </div>
              <div className="benefit-item">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="8" width="18" height="13" rx="2" />
                  <path d="M3 10h18M7 15h.01M11 15h2" />
                </svg>
                <span>Secure payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
