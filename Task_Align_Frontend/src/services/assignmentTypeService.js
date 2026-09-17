import apiClient from "./apiClient.js";

/**
 * Service for /api/assignment-types REST endpoints.
 */
export const assignmentTypeService = {
  async getAll() {
    const res = await apiClient.get("/api/assignment-types");
    return res.data;
  },

  async getById(id) {
    const res = await apiClient.get(`/api/assignment-types/${id}`);
    return res.data;
  },

  async create(payload) {
    const res = await apiClient.post("/api/assignment-types", payload);
    return res.data;
  },

  async update(id, payload) {
    const res = await apiClient.put(`/api/assignment-types/${id}`, payload);
    return res.data;
  },

  async delete(id) {
    const res = await apiClient.delete(`/api/assignment-types/${id}`);
    return res.data;
  },
};
