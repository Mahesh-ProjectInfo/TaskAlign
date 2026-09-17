import apiClient from "@/services/apiClient.js";

export const assignmentConstraintService = {
  /**
   * Create Assignment Constraint
   * @param {number} assignmentId
   * @param {Object} payload { budget: number, timelineDays: number, workingDaysPerMonth: number }
   * @returns {Promise<Object>} AssignmentConstraintResponse
   */
  async create(assignmentId, payload) {
    const res = await apiClient.post(`/api/v1/assignments/${assignmentId}/constraints`, payload);
    return res.data;
  },

  /**
   * Get Constraint by Assignment ID
   * @param {number} assignmentId
   * @returns {Promise<Object>} AssignmentConstraintResponse
   */
  async getByAssignmentId(assignmentId) {
    const res = await apiClient.get(`/api/v1/assignments/${assignmentId}/constraints`);
    return res.data;
  },

  /**
   * Update Constraint
   * @param {number} assignmentId
   * @param {number} constraintId
   * @param {Object} payload { budget: number, timelineDays: number, workingDaysPerMonth: number }
   * @returns {Promise<Object>} AssignmentConstraintResponse
   */
  async update(assignmentId, constraintId, payload) {
    const res = await apiClient.put(
      `/api/v1/assignments/${assignmentId}/constraints/${constraintId}`,
      payload,
    );
    return res.data;
  },

  /**
   * Delete Constraint
   * @param {number} assignmentId
   * @param {number} constraintId
   * @returns {Promise<Object>} Response object
   */
  async delete(assignmentId, constraintId) {
    const res = await apiClient.delete(
      `/api/v1/assignments/${assignmentId}/constraints/${constraintId}`,
    );
    return res.data;
  },
};
