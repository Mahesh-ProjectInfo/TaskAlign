import apiClient from "./apiClient.js";

/**
 * Service for /api/roles REST endpoints.
 */
export const roleService = {
  async getAll() {
    const res = await apiClient.get("/api/roles");
    return res.data;
  },

  async getById(id) {
    const res = await apiClient.get(`/api/roles/${id}`);
    return res.data;
  },

  async create(payload) {
    // payload: { assignmentTypeId, roleName }
    const res = await apiClient.post("/api/roles", payload);
    return res.data;
  },

  async update(id, payload) {
    // payload: { assignmentTypeId, roleName }
    const res = await apiClient.put(`/api/roles/${id}`, payload);
    return res.data;
  },

  async delete(id) {
    const res = await apiClient.delete(`/api/roles/${id}`);
    return res.data;
  },
};
