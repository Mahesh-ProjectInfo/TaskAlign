import apiClient from "./apiClient.js";

/**
 * Authentication Service
 * Interfaces directly with Task_Align_Backend /api/auth/* REST endpoints.
 */
export const authService = {
  /**
   * User Email/Password Login
   * @param {Object} payload { email, password, rememberme }
   * @returns {Promise<Object>} LoginResponse data
   */
  async login(payload) {
    const res = await apiClient.post("/api/auth/login", payload);
    // Backend returns ApiResponse<LoginResponse> { success, message, data: { userId, fullName, email, mobileNumber, token, tokenType } }
    return res.data?.data || res.data;
  },

  /**
   * Register User
   * @param {Object} payload { fullName, email, mobileNumber, gender, state, country, password, confirmPassword }
   * @returns {Promise<Object>} RegisterResponse data
   */
  async register(payload) {
    const res = await apiClient.post("/api/auth/register", payload);
    return res.data?.data || res.data;
  },

  /**
   * Send Mobile OTP
   * @param {Object} payload { mobileNumber }
   * @returns {Promise<string>} Success message
   */
  async sendMobileOtp(payload) {
    const res = await apiClient.post("/api/auth/send-mobile-otp", payload);
    return res.data?.data || res.data;
  },

  /**
   * Mobile Login with OTP
   * @param {Object} payload { mobileNumber, otp }
   * @returns {Promise<Object>} LoginResponse data
   */
  async mobileLogin(payload) {
    const res = await apiClient.post("/api/auth/mobile-login", payload);
    return res.data?.data || res.data;
  },

  /**
   * Forgot Password - Send OTP to Email
   * @param {Object} payload { email }
   * @returns {Promise<string>} Success message
   */
  async forgotPassword(payload) {
    const res = await apiClient.post("/api/auth/forgot-password", payload);
    return res.data?.data || res.data;
  },

  /**
   * Verify OTP for Password Reset
   * @param {Object} payload { email, otp }
   * @returns {Promise<string>} Success message
   */
  async verifyOtp(payload) {
    const res = await apiClient.post("/api/auth/verify-otp", payload);
    return res.data?.data || res.data;
  },

  /**
   * Reset Password
   * @param {Object} payload { email, otp, newPassword, confirmPassword }
   * @returns {Promise<string>} Success message
   */
  async resetPassword(payload) {
    const res = await apiClient.post("/api/auth/reset-password", payload);
    return res.data?.data || res.data;
  },

  /**
   * Edit User Profile (Protected)
   * @param {Object} payload { fullName, mobileNumber, state, country }
   * @returns {Promise<Object>} ProfileResponse data
   */
  async editProfile(payload, profilePicture = null) {
  const formData = new FormData();

  formData.append("fullName", payload.fullName);
  formData.append("mobileNumber", payload.mobileNumber);
  formData.append("gender", payload.gender);
  formData.append("state", payload.state);
  formData.append("country", payload.country);

  if (profilePicture) {
    formData.append("profilePicture", profilePicture);
  }

  const res = await apiClient.put(
    "/api/auth/edit-profile",
    formData
  );

  return res.data?.data || res.data;
},

  /**
   * Change Password (Protected)
   * @param {Object} payload { currentPassword, newPassword, confirmPassword }
   * @returns {Promise<string>} Success message
   */
  async changePassword(payload) {
    const res = await apiClient.put("/api/auth/change-password", payload);
    return res.data?.data || res.data;
  },
  /**
 * Get Current User Profile (Protected)
 * @returns {Promise<Object>} ProfileResponse data
 */
async getProfile() {
  const res = await apiClient.get("/api/auth/profile");
  return res.data?.data || res.data;
},
};
