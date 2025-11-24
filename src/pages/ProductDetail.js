import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../services/woocommerce";
import Toast from "../components/Toast";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [variations, setVariations] = useState([]);
  const [currentVariation, setCurrentVariation] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);

        // Initialize selected variations
        if (data && data.attributes) {
          const initialVariations = {};
          data.attributes.forEach((attr) => {
            if (attr.options && attr.options.length > 0) {
              initialVariations[attr.name] = attr.options[0];
            }
          });
          setSelectedVariations(initialVariations);
        }

        // Fetch variations if product is variable
        if (data && data.type === "variable") {
          try {
            const response = await fetch(
              `https://localhost/paul/wp-json/wc/v3/products/${id}/variations?consumer_key=ck_26ea8083ff6d66989f499ea234d65f1aab8d8ee3&consumer_secret=cs_96f87484f484c4d16e30c967b23189136cf9d01d&per_page=100`
            );
            const variationsData = await response.json();
            setVariations(variationsData);
          } catch (error) {
            console.error("Error fetching variations:", error);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Update current variation and image when selection changes
  useEffect(() => {
    if (variations.length > 0 && Object.keys(selectedVariations).length > 0) {
      // Find matching variation
      const matchingVariation = variations.find((variation) => {
        return variation.attributes.every((attr) => {
          const selectedValue = selectedVariations[attr.name];
          return !selectedValue || attr.option === selectedValue;
        });
      });

      if (matchingVariation) {
        setCurrentVariation(matchingVariation);
        // Update image if variation has an image
        if (matchingVariation.image && matchingVariation.image.src) {
          // Find the index of this image in product images or use it directly
          const imageIndex = product.images.findIndex(
            (img) => img.id === matchingVariation.image.id
          );
          if (imageIndex !== -1) {
            setSelectedImage(imageIndex);
          } else {
            // If variation image is not in main images, we'll update the main image src later
            setSelectedImage(0);
          }
        }
      }
    }
  }, [selectedVariations, variations, product]);

  const handleAddToCart = () => {
    const displayImage =
      currentVariation?.image?.src ||
      product.images[selectedImage]?.src ||
      product.images[0]?.src;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: currentVariation?.price || product.sale_price || product.price,
      image: displayImage,
      quantity,
      variations: selectedVariations,
    };

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Check if item already exists
    const existingItemIndex = existingCart.findIndex(
      (item) =>
        item.id === cartItem.id &&
        JSON.stringify(item.variations) === JSON.stringify(cartItem.variations)
    );

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Trigger custom event to update cart count
    window.dispatchEvent(new Event("cartUpdated"));

    setToast(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="product-detail">
        <div className="product-detail-container">
          <div className="product-gallery">
            <div className="gallery-main skeleton-gallery-main">
              <div className="skeleton-shimmer"></div>
            </div>
            <div className="gallery-thumbnails">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="thumbnail skeleton-thumbnail">
                  <div className="skeleton-shimmer"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="product-details">
            <div className="skeleton-title"></div>
            <div className="skeleton-price-section">
              <div className="skeleton-price"></div>
              <div className="skeleton-price-small"></div>
            </div>
            <div className="skeleton-description"></div>
            <div className="skeleton-description-line"></div>
            <div className="skeleton-description-line"></div>

            <div className="skeleton-attribute">
              <div className="skeleton-label"></div>
              <div className="skeleton-options">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="skeleton-option"></div>
                ))}
              </div>
            </div>

            <div className="skeleton-attribute">
              <div className="skeleton-label"></div>
              <div className="skeleton-quantity"></div>
            </div>

            <div className="skeleton-add-to-cart"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <div className="product-gallery">
          <div className="gallery-main">
            <img
              src={
                currentVariation?.image?.src ||
                product.images[selectedImage]?.src ||
                product.images[0]?.src
              }
              alt={product.name}
            />
          </div>
          {product.images.length > 1 && (
            <div className="gallery-thumbnails">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${
                    selectedImage === index ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image.src} alt={`${product.name} ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-details">
          <h1>{product.name}</h1>

          <div className="product-price-detail">
            {currentVariation ? (
              <>
                {currentVariation.sale_price ? (
                  <>
                    <span className="price-sale">
                      ${currentVariation.sale_price}
                    </span>
                    <span className="price-regular">
                      ${currentVariation.regular_price}
                    </span>
                  </>
                ) : (
                  <span className="price-sale">${currentVariation.price}</span>
                )}
              </>
            ) : product.sale_price ? (
              <>
                <span className="price-sale">${product.sale_price}</span>
                <span className="price-regular">${product.regular_price}</span>
              </>
            ) : (
              <span className="price-sale">${product.price}</span>
            )}
          </div>

          <div
            className="product-description"
            dangerouslySetInnerHTML={{
              __html: product.description || product.short_description,
            }}
          />

          {product.attributes &&
            product.attributes.map((attribute, index) => (
              <div key={index} className="product-attribute">
                <label>{attribute.name}</label>
                <div className="attribute-options">
                  {attribute.options.map((option, optIndex) => (
                    <button
                      key={optIndex}
                      className={`attribute-btn ${
                        selectedVariations[attribute.name] === option
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedVariations({
                          ...selectedVariations,
                          [attribute.name]: option,
                        })
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

          <div className="product-quantity">
            <label>Quantity</label>
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>

          {product.categories && product.categories.length > 0 && (
            <div className="product-meta">
              <p>
                <strong>Categories:</strong>{" "}
                {product.categories.map((cat) => cat.name).join(", ")}
              </p>
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="product-meta">
              <p>
                <strong>Tags:</strong>{" "}
                {product.tags.map((tag) => tag.name).join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default ProductDetail;
