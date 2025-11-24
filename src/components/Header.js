import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
      setCartItems(cart);
    };

    const updateAuthState = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const customerData = JSON.parse(
        localStorage.getItem("customer") || "null"
      );
      setIsLoggedIn(loggedIn);
      setCustomer(customerData);
    };

    handleScroll();
    updateCartCount();
    updateAuthState();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("authChanged", updateAuthState);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("authChanged", updateAuthState);
    };
  }, []);

  const removeFromCart = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const getCartSubtotal = () => {
    return cartItems
      .reduce(
        (total, item) => total + parseFloat(item.price) * item.quantity,
        0
      )
      .toFixed(2);
  };

  const toggleCart = (e) => {
    e.preventDefault();
    setIsCartOpen(!isCartOpen);
  };

  const toggleSearch = (e) => {
    e.preventDefault();
    setIsSearchOpen(!isSearchOpen);
    setSearchQuery("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <div className="promo-banner">
        <p>BLACK FRIDAY STARTS NOW | 20% OFF SITEWIDE | No code required</p>
      </div>
      <header className={`header ${isScrolled ? "scrolled" : ""}`}>
        <div className="header-container">
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>

          <Link to="/" className="logo">
            <h1>Maison Miru</h1>
          </Link>

          <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
            <Link to="/shop">Shop</Link>
            <a href="#bestsellers">Bestsellers</a>
            <a href="#new-arrivals">New Arrivals</a>
            <a href="#nap-earrings">Nap Earrings</a>
            <a href="#about">About</a>
          </nav>

          <div className="header-actions">
            <button className="icon-btn" aria-label="Search" onClick={toggleSearch}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 19L14.65 14.65"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="icon-btn" aria-label="Account">
              <Link
                to={isLoggedIn ? "/dashboard" : "/login"}
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  display: "flex",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 11C12.7614 11 15 8.76142 15 6C15 3.23858 12.7614 1 10 1C7.23858 1 5 3.23858 5 6C5 8.76142 7.23858 11 10 11Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1 19C1 15.134 4.13401 12 8 12H12C15.866 12 19 15.134 19 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </button>
            <button
              className="icon-btn cart-btn"
              aria-label="Cart"
              onClick={toggleCart}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1H4L6.68 14.39C6.77144 14.8504 7.02191 15.264 7.38755 15.5583C7.75318 15.8526 8.2107 16.009 8.68 16H16.4C16.8693 16.009 17.3268 15.8526 17.6925 15.5583C18.0581 15.264 18.3086 14.8504 18.4 14.39L20 6H5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="8.5" cy="18.5" r="1.5" fill="currentColor" />
                <circle cx="16.5" cy="18.5" r="1.5" fill="currentColor" />
              </svg>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* Mini Cart Dropdown */}
        {isCartOpen && (
          <div
            className="mini-cart-overlay"
            onClick={() => setIsCartOpen(false)}
          >
            <div className="mini-cart" onClick={(e) => e.stopPropagation()}>
              <div className="mini-cart-header">
                <h3>Shopping Cart ({cartCount})</h3>
                <button
                  className="close-cart"
                  onClick={() => setIsCartOpen(false)}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 5L5 15M5 5L15 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="mini-cart-items">
                {cartItems.length === 0 ? (
                  <div className="empty-cart">
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  cartItems.map((item, index) => (
                    <div key={index} className="mini-cart-item">
                      <div className="mini-cart-item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="mini-cart-item-details">
                        <h4>{item.name}</h4>
                        {item.variations &&
                          Object.keys(item.variations).length > 0 && (
                            <p className="mini-cart-item-variations">
                              {Object.entries(item.variations)
                                .map(([key, value]) => value)
                                .join(" / ")}
                            </p>
                          )}
                        <div className="mini-cart-item-price">
                          <span className="quantity">Qty: {item.quantity}</span>
                          <span className="price">
                            $
                            {(parseFloat(item.price) * item.quantity).toFixed(
                              2
                            )}
                          </span>
                        </div>
                      </div>
                      <button
                        className="remove-item"
                        onClick={() => removeFromCart(index)}
                        aria-label="Remove item"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 4L4 12M4 4L12 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="mini-cart-footer">
                  <div className="mini-cart-subtotal">
                    <span>Subtotal:</span>
                    <span className="subtotal-amount">
                      ${getCartSubtotal()}
                    </span>
                  </div>
                  <Link
                    to="/cart"
                    className="view-cart-btn"
                    onClick={() => setIsCartOpen(false)}
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    className="checkout-btn"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Checkout
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Modal */}
        {isSearchOpen && (
          <div className="search-modal" onClick={() => setIsSearchOpen(false)}>
            <div className="search-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-search" onClick={() => setIsSearchOpen(false)}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <h2>Search Products</h2>
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit" disabled={!searchQuery.trim()}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19 19L14.65 14.65"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Search
                </button>
              </form>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
