import apiClient from "@/services/apiClient.js";

export const assignmentResourceService = {
  /**
   * Add Resources to Assignment
   * @param {number} assignmentId
   * @param {Object} payload { resourceIds: Array<number> }
   * @returns {Promise<Array>} List of AssignmentResourceResponse
   */
  async add(assignmentId, payload) {
    const res = await apiClient.post(`/api/v1/assignments/${assignmentId}/resources`, payload);
    return res.data;
  },

  /**
   * Get Resources by Assignment ID
   * @param {number} assignmentId
   * @returns {Promise<Array>} List of AssignmentResourceResponse
   */
  async getByAssignmentId(assignmentId) {
    const res = await apiClient.get(`/api/v1/assignments/${assignmentId}/resources`);
    return res.data;
  },

  /**
   * Update Assignment Resources
   * @param {number} assignmentId
   * @param {Object} payload { resourceIds: Array<number> }
   * @returns {Promise<Array>} List of AssignmentResourceResponse
   */
  async update(assignmentId, payload) {
    const res = await apiClient.put(`/api/v1/assignments/${assignmentId}/resources`, payload);
    return res.data;
  },

  /**
   * Remove Resources from Assignment
   * @param {number} assignmentId
   * @param {Object} payload { resourceIds: Array<number> }
   * @returns {Promise<Array>} List of AssignmentResourceResponse
   */
  async remove(assignmentId, payload) {
    const res = await apiClient.delete(`/api/v1/assignments/${assignmentId}/resources`, {
      data: payload,
    });
    return res.data;
  },
};
