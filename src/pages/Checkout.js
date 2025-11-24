import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCountries,
  getShippingZones,
  getShippingZoneMethods,
  getShippingZoneLocations,
  getCountryStates,
  getPaymentGateways,
  createOrder,
} from "../services/woocommerce";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    country: "",
    state: "",
    zipCode: "",
    phone: "",
    shippingMethod: "",
    paymentMethod: "",
  });

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.length === 0) {
      navigate("/cart");
    }
    setCartItems(cart);

    // Auto-fill customer data if logged in
    const customer = JSON.parse(localStorage.getItem("customer") || "null");
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        email: customer.email || "",
        firstName: customer.first_name || "",
        lastName: customer.last_name || "",
        address: customer.billing?.address_1 || "",
        apartment: customer.billing?.address_2 || "",
        city: customer.billing?.city || "",
        country: customer.billing?.country || prev.country,
        state: customer.billing?.state || "",
        zipCode: customer.billing?.postcode || "",
        phone: customer.billing?.phone || "",
      }));
    }

    fetchCheckoutData();
  }, [navigate]);

  const fetchCheckoutData = async () => {
    try {
      // Fetch all countries first
      const allCountriesData = await getCountries();
      console.log("All countries data:", allCountriesData);

      // Fetch shipping zones and methods
      const zones = await getShippingZones();
      console.log("Shipping zones:", zones);
      let zoneCountries = [];

      if (zones.length > 0) {
        // Find the USA zone (zone name contains "usa" case-insensitive)
        const usaZone = zones.find(
          (zone) => zone.name && zone.name.toLowerCase().includes("usa")
        );

        // Use USA zone if found, otherwise use the first zone
        const targetZone = usaZone || zones[0];
        console.log("Target zone:", targetZone);

        // Fetch zone locations to get allowed countries
        const locations = await getShippingZoneLocations(targetZone.id);
        console.log("Zone locations:", locations);

        // Extract country codes from zone locations
        const zoneCountryCodes = [];
        const zoneContinents = [];

        locations.forEach((loc) => {
          if (loc.type === "country") {
            zoneCountryCodes.push(loc.code);
          } else if (loc.type === "continent") {
            zoneContinents.push(loc.code);
          }
        });

        console.log("Zone country codes:", zoneCountryCodes);
        console.log("Zone continents:", zoneContinents);

        // If continents are specified, get all countries from WooCommerce data
        if (zoneContinents.length > 0 && typeof allCountriesData === "object") {
          // Just include all countries if continent is specified
          // WooCommerce doesn't provide continent mapping, so we include all
          zoneCountries = Object.entries(allCountriesData).map(
            ([code, name]) => ({
              code,
              name: typeof name === "object" ? name.name || code : name,
            })
          );
        } else if (
          zoneCountryCodes.length > 0 &&
          typeof allCountriesData === "object"
        ) {
          // Filter by specific countries
          zoneCountries = Object.entries(allCountriesData)
            .filter(([code]) => zoneCountryCodes.includes(code))
            .map(([code, name]) => ({
              code,
              name: typeof name === "object" ? name.name || code : name,
            }));
        } else if (typeof allCountriesData === "object") {
          // Show all countries if no restrictions
          zoneCountries = Object.entries(allCountriesData).map(
            ([code, name]) => ({
              code,
              name: typeof name === "object" ? name.name || code : name,
            })
          );
        }

        console.log("Final zone countries:", zoneCountries);

        const methods = await getShippingZoneMethods(targetZone.id);
        const enabledMethods = methods.filter((m) => m.enabled);
        setShippingMethods(enabledMethods);
        
        // Set first shipping method as default
        if (enabledMethods.length > 0) {
          setFormData((prev) => ({
            ...prev,
            shippingMethod: enabledMethods[0].id.toString(),
          }));
        }
      }

      setCountries(zoneCountries);

      // Fetch payment gateways
      const gateways = await getPaymentGateways();
      setPaymentGateways(gateways.filter((g) => g.enabled));

      // Check if customer is logged in and has a country set
      const customer = JSON.parse(localStorage.getItem("customer") || "null");
      const customerCountry = customer?.billing?.country;

      // Set default values
      if (
        customerCountry &&
        zoneCountries.find((c) => c.code === customerCountry)
      ) {
        // Use customer's country if available
        setFormData((prev) => ({ ...prev, country: customerCountry }));
        await fetchStates(customerCountry);
      } else if (zoneCountries.length > 0) {
        // Otherwise use first country from zone
        const firstCountry = zoneCountries[0].code;
        setFormData((prev) => ({
          ...prev,
          country: prev.country || firstCountry,
        }));
        await fetchStates(firstCountry);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching checkout data:", error);
      setLoading(false);
    }
  };

  const fetchStates = async (countryCode) => {
    if (!countryCode) return;
    setLoadingStates(true);
    try {
      const statesData = await getCountryStates(countryCode);
      let statesList = [];
      if (Array.isArray(statesData)) {
        statesList = statesData;
      } else if (typeof statesData === "object" && statesData !== null) {
        statesList = Object.entries(statesData).map(([code, name]) => ({
          code,
          name: typeof name === "string" ? name : code,
        }));
      }
      setStates(statesList);

      // Set first state as default if available
      if (statesList.length > 0) {
        setFormData((prev) => ({ ...prev, state: statesList[0].code }));
      } else {
        setFormData((prev) => ({ ...prev, state: "" }));
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      setStates([]);
    }
    setLoadingStates(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Fetch states when country changes
    if (name === "country") {
      fetchStates(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Get customer ID if logged in
      const customer = JSON.parse(localStorage.getItem("customer") || "null");
      const customerId = customer?.id || 0;

      // Prepare order data for WooCommerce
      const orderData = {
        payment_method: formData.paymentMethod,
        payment_method_title:
          paymentGateways.find((g) => g.id === formData.paymentMethod)?.title ||
          "",
        set_paid: false,
        customer_id: customerId,
        billing: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.address,
          address_2: formData.apartment,
          city: formData.city,
          state: formData.state,
          postcode: formData.zipCode,
          country: formData.country,
          email: formData.email,
          phone: formData.phone,
        },
        shipping: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.address,
          address_2: formData.apartment,
          city: formData.city,
          state: formData.state,
          postcode: formData.zipCode,
          country: formData.country,
        },
        line_items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        shipping_lines: [
          {
            method_id: formData.shippingMethod,
            method_title:
              shippingMethods.find(
                (m) => m.id === parseInt(formData.shippingMethod)
              )?.title || "Shipping",
            total: getShipping().toString(),
          },
        ],
      };

      // Create order in WooCommerce
      const order = await createOrder(orderData);

      alert(`Order placed successfully! Order ID: ${order.id}`);
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getSubtotal = () => {
    return cartItems
      .reduce((total, item) => {
        return total + parseFloat(item.price) * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const getShipping = () => {
    if (!formData.shippingMethod || shippingMethods.length === 0) return 0;
    const selectedMethod = shippingMethods.find(
      (m) => m.id === parseInt(formData.shippingMethod)
    );
    return selectedMethod
      ? parseFloat(selectedMethod.settings?.cost?.value || 0)
      : 0;
  };

  const getTotal = () => {
    return (parseFloat(getSubtotal()) + getShipping()).toFixed(2);
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-form-section">
          <h1>Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="checkout-section">
              <h2>Contact Information</h2>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="checkout-section">
              <h2>Shipping Address</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Street address"
                />
              </div>

              <div className="form-group">
                <label>Apartment, suite, etc. (optional)</label>
                <input
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {String(country.name)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>State</label>
                  {loadingStates ? (
                    <input type="text" value="Loading..." disabled />
                  ) : states.length > 0 ? (
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a state</option>
                      {states.map((state) => (
                        <option key={state.code} value={state.code}>
                          {String(state.name)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  )}
                </div>
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="checkout-section">
              <h2>Shipping Method</h2>
              {loading ? (
                <p>Loading shipping methods...</p>
              ) : shippingMethods.length > 0 ? (
                <div className="shipping-options">
                  {shippingMethods.map((method) => (
                    <label key={method.id} className="shipping-option">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={method.id}
                        checked={
                          formData.shippingMethod === method.id.toString()
                        }
                        onChange={handleChange}
                        required
                      />
                      <div className="shipping-details">
                        <span className="shipping-name">{method.title}</span>
                        {method.method_description && (
                          <span
                            className="shipping-time"
                            dangerouslySetInnerHTML={{
                              __html: method.method_description.replace(
                                /<\/?p>/g,
                                ""
                              ),
                            }}
                          />
                        )}
                      </div>
                      <span className="shipping-price">
                        $
                        {parseFloat(method.settings?.cost?.value || 0).toFixed(
                          2
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p>No shipping methods available</p>
              )}
            </div>

            <div className="checkout-section">
              <h2>Payment Method</h2>
              {loading ? (
                <p>Loading payment methods...</p>
              ) : paymentGateways.length > 0 ? (
                <div className="payment-options">
                  {paymentGateways.map((gateway) => (
                    <label key={gateway.id} className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={gateway.id}
                        checked={formData.paymentMethod === gateway.id}
                        onChange={handleChange}
                        required
                      />
                      <div className="payment-details">
                        <span className="payment-name">{gateway.title}</span>
                        {gateway.description && (
                          <span className="payment-description">
                            {gateway.description}
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p>No payment methods available</p>
              )}
            </div>

            <button
              type="submit"
              className="place-order-btn"
              disabled={submitting || loading}
            >
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>

        <div className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="summary-items">
            {cartItems.map((item, index) => (
              <div key={index} className="summary-item">
                <div className="summary-item-image">
                  <img src={item.image} alt={item.name} />
                  <span className="item-quantity">{item.quantity}</span>
                </div>
                <div className="summary-item-details">
                  <h4>{item.name}</h4>
                  {item.variations &&
                    Object.keys(item.variations).length > 0 && (
                      <p className="item-variations">
                        {Object.entries(item.variations)
                          .map(([key, value]) => value)
                          .join(" / ")}
                      </p>
                    )}
                </div>
                <div className="summary-item-price">
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${getSubtotal()}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>${getShipping().toFixed(2)}</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span className="total-amount">${getTotal()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
