import apiClient from "@/services/apiClient.js";

export const assignmentService = {
  /**
   * Create a new Assignment
   * @param {Object} payload { assignmentName: string, assignmentTypeId: number, optimizationType: string }
   * @returns {Promise<Object>} AssignmentResponse
   */
  async create(payload) {
    const res = await apiClient.post("/api/v1/assignments", payload);
    return res.data;
  },

  /**
   * Get all Assignments
   * @returns {Promise<Array>} List of AssignmentResponse
   */
  async getAll() {
    const res = await apiClient.get("/api/v1/assignments");
    return res.data;
  },

  /**
   * Get Assignment by ID
   * @param {number} assignmentId
   * @returns {Promise<Object>} AssignmentResponse
   */
  async getById(assignmentId) {
    const res = await apiClient.get(`/api/v1/assignments/${assignmentId}`);
    return res.data;
  },

  /**
   * Update Assignment
   * @param {number} assignmentId
   * @param {Object} payload { assignmentName: string, assignmentTypeId: number, optimizationType: string, assignmentStatus: string }
   * @returns {Promise<Object>} AssignmentResponse
   */
  async update(assignmentId, payload) {
    const res = await apiClient.put(`/api/v1/assignments/${assignmentId}`, payload);
    return res.data;
  },

  /**
   * Delete Assignment
   * @param {number} assignmentId
   * @returns {Promise<string>} Success message
   */
  async delete(assignmentId) {
    const res = await apiClient.delete(`/api/v1/assignments/${assignmentId}`);
    return res.data;
  },
};
