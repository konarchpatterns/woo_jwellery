import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCustomerOrders,
  getCustomer,
  updateCustomer,
} from "../services/woocommerce";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const customerData = JSON.parse(localStorage.getItem("customer") || "{}");

    if (!isLoggedIn || !customerData.id) {
      navigate("/login");
      return;
    }

    setCustomer(customerData);
    setProfileData({
      firstName: customerData.first_name || "",
      lastName: customerData.last_name || "",
      email: customerData.email || "",
      phone: customerData.billing?.phone || "",
    });

    fetchOrders(customerData.id);
  }, [navigate]);

  const fetchOrders = async (customerId) => {
    try {
      const ordersData = await getCustomerOrders(customerId);
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("customer");
    localStorage.removeItem("isLoggedIn");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedCustomer = await updateCustomer(customer.id, {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email,
        billing: {
          ...customer.billing,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          email: profileData.email,
          phone: profileData.phone,
        },
      });

      localStorage.setItem("customer", JSON.stringify(updatedCustomer));
      setCustomer(updatedCustomer);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f39c12",
      processing: "#3498db",
      "on-hold": "#95a5a6",
      completed: "#27ae60",
      cancelled: "#e74c3c",
      refunded: "#e67e22",
      failed: "#c0392b",
    };
    return colors[status] || "#95a5a6";
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <div className="user-info">
            <div className="user-avatar">
              {customer?.first_name?.charAt(0) || "U"}
            </div>
            <h3>
              {customer?.first_name} {customer?.last_name}
            </h3>
            <p>{customer?.email}</p>
          </div>

          <nav className="dashboard-nav">
            <button
              className={activeTab === "orders" ? "active" : ""}
              onClick={() => setActiveTab("orders")}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 2H4L6 14H16L18 6H5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Orders
            </button>
            <button
              className={activeTab === "profile" ? "active" : ""}
              onClick={() => setActiveTab("profile")}
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
                />
                <path
                  d="M1 19C1 15.134 4.13401 12 8 12H12C15.866 12 19 15.134 19 19"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Profile
            </button>
            <button onClick={handleLogout} className="logout-btn">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 19H3C2.46957 19 1.96086 18.7893 1.58579 18.4142C1.21071 18.0391 1 17.5304 1 17V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 15L19 10L14 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 10H7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Logout
            </button>
          </nav>
        </div>

        <div className="dashboard-content">
          {activeTab === "orders" && (
            <div className="orders-section">
              <h2>Order History</h2>
              {orders.length === 0 ? (
                <div className="empty-orders">
                  <p>You haven't placed any orders yet.</p>
                  <button onClick={() => navigate("/")} className="shop-btn">
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <h3>Order #{order.number}</h3>
                          <p className="order-date">
                            {new Date(order.date_created).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className="order-status"
                          style={{
                            backgroundColor: getStatusColor(order.status),
                          }}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="order-items">
                        {order.line_items.map((item, index) => (
                          <div key={index} className="order-item">
                            <span>
                              {item.name} × {item.quantity}
                            </span>
                            <span>${item.total}</span>
                          </div>
                        ))}
                      </div>

                      <div className="order-footer">
                        <span className="order-total">
                          Total: <strong>${order.total}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="profile-section">
              <div className="profile-header">
                <h2>Profile Information</h2>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="edit-profile-btn"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                  />
                </div>

                {editMode && (
                  <div className="form-actions">
                    <button type="submit" className="save-btn">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setProfileData({
                          firstName: customer.first_name || "",
                          lastName: customer.last_name || "",
                          email: customer.email || "",
                          phone: customer.billing?.phone || "",
                        });
                      }}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
