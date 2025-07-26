import api from "@/api/api";

export async function createRoom({ name, floor, price }) {
    try {
        const res = await api.post('/rooms/create', {
            name, floor, price
        });

        return res.data;
    } catch (err) {
        const message = err.response?.data?.error || "Room creation failed";
        throw new Error(message)
    }
}

export async function getRooms() {
    try {
        const res = await api.get('/rooms');
        return res.data.rooms || [];
    } catch (err) {
        const message = err.response?.data?.error || "Room fetching failed";
        throw new Error(message)
    }
}

export async function getRoomById({ id }) {
    try {
        const res = await api.get(`/rooms/${id}`);
        return res.data;
    } catch (err) {
        const message = err.response?.data?.error || "Room fetching failed";
        throw new Error(message)
    }
}

export async function getRoomsByTenantId(tenantId) {
  try {
    const res = await api.get(`/rooms/by-tenant/${tenantId}`);
    return res.data.rooms || [];
  } catch (err) {
    console.warn(`No room found for tenant ID ${tenantId}:`, err.response?.data?.error || err.message);
    return [];
  }
}


// Get all available (unoccupied) rooms for current admin
export async function getAvailableRooms() {
  try {
    const res = await api.get('/rooms/available'); // Your route should filter only unoccupied
    return res.data.rooms;
  } catch (err) {
    const message = err.response?.data?.error || "Failed to fetch available rooms";
    throw new Error(message);
  }
}

export async function updateRoom({ id, name, floor, price }) {
    try {
        const res = await api.patch(`/rooms/${id}`, {
            name, floor, price
        });

        return res.data;
    } catch (err) {
        const message = err.response?.data?.error || "Room update failed";
        throw new Error(message)
    }
}