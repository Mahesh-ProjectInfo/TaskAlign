/**
 * Utility to parse and format error responses from Spring Boot backend APIs.
 * Handles:
 * 1. Field validation maps: { "email": "Invalid Email Address", ... }
 * 2. Exception maps: { "message": "Resource not found", "error": "Not Found", ... }
 * 3. ApiResponse format: { "success": false, "message": "Error details" }
 * 4. Plain text / fallback string errors
 */
export function parseApiError(error) {
  if (!error) return { message: "An unexpected error occurred.", fieldErrors: {} };

  if (error.response) {
    const data = error.response.data;

    // Case 1: Backend returns field validation errors map { email: "...", password: "..." }
    if (
      typeof data === "object" &&
      data !== null &&
      !data.message &&
      !data.error &&
      !data.success
    ) {
      const fieldErrors = {};
      let firstMessage = "";
      Object.keys(data).forEach((key) => {
        if (typeof data[key] === "string") {
          fieldErrors[key] = data[key];
          if (!firstMessage) firstMessage = data[key];
        }
      });
      if (Object.keys(fieldErrors).length > 0) {
        return {
          message: firstMessage || "Validation failed.",
          fieldErrors,
        };
      }
    }

    // Case 2: ApiResponse wrapper { success: false, message: "..." } or GlobalExceptionHandler { message: "..." }
    if (data && typeof data.message === "string") {
      return {
        message: data.message,
        fieldErrors: {},
      };
    }

    // Case 3: Raw string error
    if (typeof data === "string" && data.trim().length > 0) {
      return {
        message: data,
        fieldErrors: {},
      };
    }

    // Case 4: HTTP Status fallbacks
    if (error.response.status === 401) {
      return { message: "Invalid credentials or unauthorized session.", fieldErrors: {} };
    }
    if (error.response.status === 403) {
      return { message: "Access forbidden.", fieldErrors: {} };
    }
    if (error.response.status === 404) {
      return { message: "Requested resource not found.", fieldErrors: {} };
    }
    if (error.response.status === 409) {
      return { message: "Resource conflict or duplicate entry.", fieldErrors: {} };
    }
  }

  // Network / Client-side error
  return {
    message: error.message || "Network error. Please verify backend server connection.",
    fieldErrors: {},
  };
}
