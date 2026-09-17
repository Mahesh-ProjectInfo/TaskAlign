import apiClient from "./apiClient.js";

/**
 * Minimal Phase 1 Connectivity Test Utility
 * Tests the communication bridge: React Frontend -> Axios -> Spring Boot Backend.
 * Uses the read-only test endpoint identified during Phase 0 Audit: GET /api/assignment-types.
 */
export async function testBackendConnectivity() {
  const testEndpoint = "/api/assignment-types";
  try {
    const response = await apiClient.get(testEndpoint);
    return {
      success: true,
      status: response.status,
      endpoint: testEndpoint,
      baseUrl: apiClient.defaults.baseURL,
      message: "HTTP connection to Spring Boot backend successful.",
      data: response.data,
    };
  } catch (error) {
    if (error.response) {
      // Backend responded with an HTTP status code (e.g., 401 Unauthorized)
      return {
        success: true, // Communication bridge successfully reached the backend
        status: error.response.status,
        endpoint: testEndpoint,
        baseUrl: apiClient.defaults.baseURL,
        message: `HTTP connection established. Backend returned status ${error.response.status} (${error.response.statusText || "Auth Required"}).`,
        data: error.response.data,
      };
    }
    return {
      success: false,
      status: null,
      endpoint: testEndpoint,
      baseUrl: apiClient.defaults.baseURL,
      message: `Network error or backend unreachable: ${error.message}`,
      data: null,
    };
  }
}
