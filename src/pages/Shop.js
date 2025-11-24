import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getProducts, getCategories } from "../services/woocommerce";
import Toast from "../components/Toast";
import "./Shop.css";

function Shop() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState("default");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Get search query from URL
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    setSearchQuery(search);
  }, [location.search]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, selectedCategories, priceRange, sortBy, searchQuery]);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts({ per_page: 100 }),
        getCategories(),
      ]);
      console.log("Products fetched:", productsData);
      console.log("Categories fetched:", categoriesData);
      setProducts(productsData);
      setFilteredProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        product.categories.some((cat) =>
          selectedCategories.includes(cat.id.toString())
        )
      );
    }

    // Filter by price range
    filtered = filtered.filter((product) => {
      const price = parseFloat(product.price);
      if (isNaN(price)) return true; // Include products with no price
      return price >= priceRange.min && price <= priceRange.max;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.date_created) - new Date(a.date_created)
        );
        break;
      default:
        break;
    }

    console.log("Filtered products:", filtered);
    setFilteredProducts(filtered);
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 10000 });
    setSortBy("default");
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
        price: product.price,
        image: product.images[0]?.src || "",
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    setToast(`${product.name} added to cart!`);
  };

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : "Shop All Products"}
        </h1>
        <p>
          {searchQuery
            ? `Showing results for your search`
            : "Discover our complete collection"}
        </p>
      </div>

      <div className="shop-container">
        {/* Sidebar Toggle for Mobile */}
        <button
          className="filter-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 4H18M2 10H18M2 16H18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Filters & Sort
        </button>

        {/* Sidebar */}
        <aside className={`shop-sidebar ${isSidebarOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button
              className="close-sidebar"
              onClick={() => setIsSidebarOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Sort By */}
          <div className="filter-section">
            <h4>Sort By</h4>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="default">Default</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>

          {/* Categories */}
          <div className="filter-section">
            <h4>Categories</h4>
            <div className="category-list">
              {categories.map((category) => (
                <label key={category.id} className="category-item">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(
                      category.id.toString()
                    )}
                    onChange={() => toggleCategory(category.id.toString())}
                  />
                  <span>{category.name}</span>
                  <span className="category-count">({category.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="price-inputs">
              <input
                type="number"
                name="min"
                value={priceRange.min}
                onChange={handlePriceChange}
                placeholder="Min"
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                name="max"
                value={priceRange.max}
                onChange={handlePriceChange}
                placeholder="Max"
                min="0"
              />
            </div>
          </div>

          {/* Clear Filters */}
          <button className="clear-filters" onClick={clearFilters}>
            Clear All Filters
          </button>
        </aside>

        {/* Products Grid */}
        <div className="shop-content">
          <div className="shop-results-info">
            <p>
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {loading ? (
            <div className="shop-loading">
              <p>Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No products found matching your filters.</p>
              <button onClick={clearFilters} className="reset-btn">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="shop-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="shop-product-card">
                  <Link
                    to={`/product/${product.id}`}
                    className="shop-product-link"
                  >
                    <div className="shop-product-image">
                      <img
                        src={product.images[0]?.src || ""}
                        alt={product.name}
                      />
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
                      </div>
                    </div>
                    <div className="shop-product-info">
                      <h3>{product.name}</h3>
                      {product.categories.length > 0 && (
                        <span className="product-category">
                          {product.categories[0].name}
                        </span>
                      )}
                      <div className="shop-product-price">
                        <span className="price">${product.price}</span>
                        {product.regular_price &&
                          product.regular_price !== product.price && (
                            <span className="regular-price">
                              ${product.regular_price}
                            </span>
                          )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default Shop;
