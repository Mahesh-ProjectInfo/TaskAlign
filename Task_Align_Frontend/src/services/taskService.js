import apiClient from "@/services/apiClient.js";

export const taskService = {
  /**
   * Create Task under Assignment
   * @param {number} assignmentId
   * @param {Object} payload { taskName: string, estimatedDays: number }
   * @returns {Promise<Object>} TaskResponse
   */
  async create(assignmentId, payload) {
    const res = await apiClient.post(`/api/v1/assignments/${assignmentId}/tasks`, payload);
    return res.data;
  },

  /**
   * Get Tasks by Assignment ID
   * @param {number} assignmentId
   * @returns {Promise<Array>} List of TaskResponse
   */
  async getByAssignmentId(assignmentId) {
    const res = await apiClient.get(`/api/v1/assignments/${assignmentId}/tasks`);
    return res.data;
  },

  /**
   * Update Task
   * @param {number} assignmentId
   * @param {number} taskId
   * @param {Object} payload { taskName: string, estimatedDays: number }
   * @returns {Promise<Object>} TaskResponse
   */
  async update(assignmentId, taskId, payload) {
    const res = await apiClient.put(`/api/v1/assignments/${assignmentId}/tasks/${taskId}`, payload);
    return res.data;
  },

  /**
   * Delete Task
   * @param {number} assignmentId
   * @param {number} taskId
   * @returns {Promise<string>} Success message
   */
  async delete(assignmentId, taskId) {
    const res = await apiClient.delete(`/api/v1/assignments/${assignmentId}/tasks/${taskId}`);
    return res.data;
  },

  /**
   * Bulk Save/Create Tasks under Assignment
   * @param {number} assignmentId
   * @param {Object} payload { tasks: Array<{ taskId?: number, taskName: string, estimatedDays: number, skillIds: Array<number> }> }
   * @returns {Promise<Array>} List of BulkTaskResponse
   */
  async createBulk(assignmentId, payload) {
    const res = await apiClient.post(`/api/v1/assignments/${assignmentId}/tasks/bulk`, payload);
    return res.data;
  },
};
