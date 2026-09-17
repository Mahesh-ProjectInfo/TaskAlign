import apiClient from "@/services/apiClient.js";

export const taskSkillService = {
  /**
   * Add Skills to Task
   * @param {number} taskId
   * @param {Object} payload { skillIds: Array<number> }
   * @returns {Promise<Array>} List of TaskSkillResponse
   */
  async add(taskId, payload) {
    const res = await apiClient.post(`/api/v1/tasks/${taskId}/skills`, payload);
    return res.data;
  },

  /**
   * Get Skills by Task ID
   * @param {number} taskId
   * @returns {Promise<Array>} List of TaskSkillResponse
   */
  async getByTaskId(taskId) {
    const res = await apiClient.get(`/api/v1/tasks/${taskId}/skills`);
    return res.data;
  },

  /**
   * Update Task Skills
   * @param {number} taskId
   * @param {Object} payload { skillIds: Array<number> }
   * @returns {Promise<Array>} List of TaskSkillResponse
   */
  async update(taskId, payload) {
    const res = await apiClient.put(`/api/v1/tasks/${taskId}/skills`, payload);
    return res.data;
  },

  /**
   * Remove Skills from Task
   * @param {number} taskId
   * @param {Object} payload { skillIds: Array<number> }
   * @returns {Promise<Array>} List of TaskSkillResponse
   */
  async remove(taskId, payload) {
    const res = await apiClient.delete(`/api/v1/tasks/${taskId}/skills`, {
      data: payload,
    });
    return res.data;
  },
};
