import api from "@/api/api";
import { getRoute } from "@/lib/utils";

// To get Update requests (notification) from the users
// 1. Create a new update request (tenant)
export async function createUpdateRequest({ tenant_id, message }) {
  try {
    const res = await api.post(getRoute("update-requests", "create"), { tenant_id, message });
    return res.data;
  } catch (err) {
    const message = err.response?.data?.error || "Failed to submit request";
    throw new Error(message);
  }
}

// 2. Update status of a request (admin or tenant)
export async function updateUpdateRequest(id, status) {
  try {
    const res = await api.patch(getRoute("update-requests", "update", { id }), { status });
    return res.data;
  } catch (err) {
    const message = err.response?.data?.error || "Failed to update request status";
    throw new Error(message);
  }
}

// 3. Get all pending requests for admin
export async function getAllUpdateRequests(adminId) {
  try {
    const res = await api.get(getRoute("update-requests", "admin", { adminId }));
    return res.data?.requests;
  } catch (err) {
    const message = err.response?.data?.error || "Failed to fetch update requests";
    throw new Error(message);
  }
}

// 4. Get request for tenant (if not dismissed)
export async function getUpdateRequestTenant(tenantId) {
  try {
    const res = await api.get(getRoute("update-requests", "tenant", { tenantId }));
    return res.data?.request;
  } catch (err) {
    const message = err.response?.data?.error || "Failed to check update status";
    throw new Error(message);
  }
}
