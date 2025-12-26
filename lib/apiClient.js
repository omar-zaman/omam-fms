const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// API request helper
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
    }

    if (!response.ok) {
      // Handle 401 (unauthorized) - redirect to login or clear token
      if (response.status === 401) {
        // Optionally redirect to login page
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    // If it's already an Error with a message, throw it as is
    if (error instanceof Error) {
      console.error("API Error:", error.message);
      throw error;
    }
    // Otherwise wrap it
    console.error("API Error:", error);
    throw new Error(error.message || "Network error. Please check if the backend server is running.");
  }
}

// HTTP methods
export const api = {
  get: (endpoint, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return apiRequest(url, { method: "GET" });
  },

  post: (endpoint, data) => {
    return apiRequest(endpoint, {
      method: "POST",
      body: data,
    });
  },

  put: (endpoint, data) => {
    return apiRequest(endpoint, {
      method: "PUT",
      body: data,
    });
  },

  delete: (endpoint) => {
    return apiRequest(endpoint, {
      method: "DELETE",
    });
  },
};

export default api;
