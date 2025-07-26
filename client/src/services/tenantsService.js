import api from "@/api/api";

export async function createTenant({ full_name, phone, move_in_date, photo_url, rooms, documents }) {
    try {
        const res = await api.post('/tenants/create', {
            full_name, phone, move_in_date, photo_url, rooms, documents
        });

        return res.data;
    } catch (err) {
        const message = err.response?.data?.error || "Tenant creation failed";
        throw new Error(message)
    }
}

export async function getTenants() {
    try {
        const res = await api.get('/tenants');
        return res.data;
    } catch (err) {
        const message = err.response?.data?.error || "Tenant fetching failed";
        throw new Error(message)
    }
}

// Get by Id
export async function getTenantById(tenant_id) {
    try {
        const res = await api.get(`/tenants/${tenant_id}`);
        return res.data.tenant;
    } catch (err) {
        const message = err.response?.data?.error || "Tenant fetching failed";
        throw new Error(message)
    }
}

// Get multiple tenants by an array of IDs
export async function getTenantsByIds(tenant_ids) {
  try {
    const res = await api.post("/tenants/by-ids", tenant_ids); // raw array
    return res.data;
  } catch (err) {
    const message = err.response?.data?.error || "Tenant fetching failed";
    throw new Error(message);
  }
}

export async function updateTenant({ id, full_name, phone, move_in_date, move_out_date, photo_url, rooms, documents }) {
    try {
        const res = await api.patch(`/tenants/${id}`, {
            full_name, phone, move_in_date, move_out_date, photo_url, rooms, documents
        });

        return res.success;
    } catch (err) {
        const message = err.response?.data?.error || "Tenant update failed";
        throw new Error(message)
    }
}