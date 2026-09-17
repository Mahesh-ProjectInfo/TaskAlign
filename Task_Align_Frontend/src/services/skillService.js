import apiClient from "./apiClient.js";

/**
 * Service for /api/skills REST endpoints.
 */
export const skillService = {
  async getAll() {
    const res = await apiClient.get("/api/skills");
    return res.data;
  },

  async getById(id) {
    const res = await apiClient.get(`/api/skills/${id}`);
    return res.data;
  },

  async create(payload) {
    // payload: { assignmentTypeId, skillName }
    const res = await apiClient.post("/api/skills", payload);
    return res.data;
  },

  async update(id, payload) {
    // payload: { assignmentTypeId, skillName }
    const res = await apiClient.put(`/api/skills/${id}`, payload);
    return res.data;
  },

  async delete(id) {
    const res = await apiClient.delete(`/api/skills/${id}`);
    return res.data;
  },
};
