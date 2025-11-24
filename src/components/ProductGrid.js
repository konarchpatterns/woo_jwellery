import React, { useState } from "react";
import { Link } from "react-router-dom";
import Toast from "./Toast";
import "./ProductGrid.css";

const ProductSkeleton = () => (
  <div className="product-card skeleton">
    <div className="product-image skeleton-image">
      <div className="skeleton-shimmer"></div>
    </div>
    <div className="product-info">
      <div className="skeleton-title"></div>
      <div className="skeleton-badge"></div>
      <div className="skeleton-price"></div>
      <div className="skeleton-options"></div>
    </div>
  </div>
);

const ProductGrid = ({
  title,
  products,
  viewAllLink,
  loading = false,
  skeletonCount = 6,
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [toast, setToast] = useState(null);

  const openQuickView = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProduct(product);
    setSelectedColor(product.options?.[0] || null);
    setCurrentImageIndex(0);
  };

  const closeQuickView = () => {
    setSelectedProduct(null);
    setSelectedColor(null);
    setCurrentImageIndex(0);
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log("Adding to cart:", selectedProduct, selectedColor);
    closeQuickView();
  };

  const addToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.salePrice,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    
    // Show toast notification
    setToast(`${product.name} added to cart!`);
  };  return (
    <section
      className="product-grid-section"
      id={title.toLowerCase().replace(/\s+/g, "-")}
    >
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <div className="product-grid">
          {loading || products.length === 0
            ? [...Array(skeletonCount)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            : products.map((product, index) => (
                <div key={product.id || index} className="product-card">
                  <Link
                    to={`/product/${product.id || index}`}
                    className="product-link"
                  >
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                      <div className="product-actions">
                        <button
                          className="add-to-cart-icon"
                          onClick={(e) => addToCart(product, e)}
                          aria-label="Add to cart"
                          title="Add to cart"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                        <button
                          className="quick-view-icon"
                          onClick={(e) => openQuickView(product, e)}
                          aria-label="Quick view"
                          title="Quick view"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 5V19M5 12H19"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      {product.badge && (
                        <span className="product-badge">{product.badge}</span>
                      )}
                      <div className="product-price">
                        <span className="sale-price">${product.salePrice}</span>
                        {product.regularPrice && (
                          <span className="regular-price">
                            ${product.regularPrice}
                          </span>
                        )}
                      </div>
                      {product.options && (
                        <div className="product-options">
                          {product.options.map((option, i) => (
                            <span key={i} className="option-dot"></span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
        </div>
        {viewAllLink && !loading && (
          <div className="view-all">
            <button className="view-all-btn">{viewAllLink}</button>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <div className="quick-view-modal" onClick={closeQuickView}>
          <div
            className="quick-view-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-modal" onClick={closeQuickView}>
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

            <div className="modal-layout">
              <div className="modal-image-section">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
                <div className="image-dots">
                  {[...Array(10)].map((_, i) => (
                    <span
                      key={i}
                      className={`dot ${
                        i === currentImageIndex ? "active" : ""
                      }`}
                      onClick={() => setCurrentImageIndex(i)}
                    ></span>
                  ))}
                </div>
              </div>

              <div className="modal-details-section">
                <h2>{selectedProduct.name}</h2>
                <div className="modal-price">
                  <span className="modal-sale-price">
                    ${selectedProduct.salePrice}
                  </span>
                  {selectedProduct.regularPrice && (
                    <span className="modal-regular-price">
                      ${selectedProduct.regularPrice}
                    </span>
                  )}
                </div>

                <div className="modal-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span className="review-count">760 Reviews</span>
                </div>

                {selectedProduct.options && (
                  <div className="modal-color-selection">
                    <label>Color: {selectedColor || "Gold"}</label>
                    <div className="color-options">
                      {selectedProduct.options.map((option, i) => (
                        <button
                          key={i}
                          className={`color-option ${
                            selectedColor === option ? "selected" : ""
                          }`}
                          onClick={() => setSelectedColor(option)}
                          style={{
                            backgroundColor:
                              i === 0
                                ? "#ffd700"
                                : i === 1
                                ? "#c0c0c0"
                                : "#ffb6c1",
                          }}
                        ></button>
                      ))}
                    </div>
                  </div>
                )}

                <button className="modal-add-to-cart" onClick={handleAddToCart}>
                  ADD TO CART
                </button>

                <Link
                  to={`/product/${selectedProduct.id}`}
                  className="view-details-link"
                  onClick={closeQuickView}
                >
                  View details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </section>
  );
};

export default ProductGrid;
