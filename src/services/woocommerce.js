import axios from "axios";

const WC_URL = "https://woo.xo.je/paul/";
const CONSUMER_KEY = "ck_2a6a5087fc626900052c06ff0adcd18a58164c3b";
const CONSUMER_SECRET = "cs_c9cb54dfacee1cceb4b44dc5b127dcae7ba80462";

// For local HTTP development, we can use query string authentication
const api = axios.create({
  baseURL: WC_URL,
});

export const getProducts = async (params = {}) => {
  try {
    const response = await api.get("/products", {
      params: {
        ...params,
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProduct = async (id) => {
  try {
    const response = await api.get(`/products/${id}`, {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get("/products/categories", {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getShippingZones = async () => {
  try {
    const response = await api.get("/shipping/zones", {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching shipping zones:", error);
    return [];
  }
};

export const getShippingZoneMethods = async (zoneId) => {
  try {
    const response = await api.get(`/shipping/zones/${zoneId}/methods`, {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching shipping methods:", error);
    return [];
  }
};

export const getShippingZoneLocations = async (zoneId) => {
  try {
    const response = await api.get(`/shipping/zones/${zoneId}/locations`, {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching zone locations:", error);
    return [];
  }
};

export const getCountryStates = async (countryCode) => {
  try {
    const response = await api.get(`/data/countries/${countryCode}`, {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
      },
    });
    return response.data.states || [];
  } catch (error) {
    console.error("Error fetching states:", error);
    return [];
  }
};

export const getPaymentGateways = async () => {
  try {
    const response = await api.get("/payment_gateways", {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching payment gateways:", error);
    return [];
  }
};

export const getCountries = async () => {
  try {
    const response = await api.get("/data/countries", {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await api.post("/orders", orderData, {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Customer Authentication & Management
export const registerCustomer = async (customerData) => {
  try {
    const response = await api.post("/customers", customerData, {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error registering customer:", error);
    throw error;
  }
};

export const getCustomer = async (customerId) => {
  try {
    const response = await api.get(`/customers/${customerId}`, {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
};

export const updateCustomer = async (customerId, customerData) => {
  try {
    const response = await api.put(`/customers/${customerId}`, customerData, {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

export const getCustomerOrders = async (customerId) => {
  try {
    const response = await api.get("/orders", {
      params: {
        customer: customerId,
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    return [];
  }
};

// Login function (WooCommerce doesn't have direct login API, so we validate by email)
export const loginCustomer = async (email, password) => {
  try {
    // Search for customer by email
    const response = await api.get("/customers", {
      params: {
        email: email,
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
      },
    });

    if (response.data && response.data.length > 0) {
      // Note: WooCommerce API doesn't validate password directly
      // In production, you should use WordPress authentication or JWT
      return response.data[0];
    } else {
      throw new Error("Customer not found");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export default api;
