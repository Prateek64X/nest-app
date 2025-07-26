import api from "@/api/api";

export async function createTenant({ full_name, phone, move_in_date, rooms, documents }) {
    try {
        const res = await api.post('/tenants/create', {
            full_name, phone, move_in_date, rooms, documents
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

// Get all available (unoccupied) tenants for current admin
export async function getAvailableTenants() {
  try {
    const res = await api.get('/tenants/available'); // Your route should filter only unoccupied
    return res.data.tenants;
  } catch (err) {
    const message = err.response?.data?.error || "Failed to fetch available tenants";
    throw new Error(message);
  }
}

export async function updateTenant({ id, name, floor, price }) {
    try {
        const res = await api.patch(`/tenants/${id}`, {
            name, floor, price
        });

        return res.data;
    } catch (err) {
        const message = err.response?.data?.error || "Tenant update failed";
        throw new Error(message)
    }
}