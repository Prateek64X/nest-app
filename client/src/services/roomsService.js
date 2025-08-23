import api from "@/api/api";
import { getRoute } from "@/lib/utils";

// Create a new room
export async function createRoom({ name, floor, price }) {
  try {
    const res = await api.post(getRoute("rooms", "create"), { name, floor, price });
    return res.data;
  } catch (err) {
    const message = err.response?.data?.error || "Room creation failed";
    throw new Error(message);
  }
}

// Get all rooms
export async function getRooms() {
  try {
    const res = await api.get(getRoute("rooms", "all"));
    return res.data.rooms || [];
  } catch (err) {
    const message = err.response?.data?.error || "Room fetching failed";
    throw new Error(message);
  }
}

// Get single room by ID
export async function getRoomById(id) {
  try {
    const res = await api.get(getRoute("rooms", "byId", { id }));
    return res.data;
  } catch (err) {
    const message = err.response?.data?.error || "Room fetching failed";
    throw new Error(message);
  }
}

// Get all rooms for a tenant
export async function getRoomsByTenantId(tenantId) {
  try {
    const res = await api.get(getRoute("rooms", "byTenant", { tenantId }));
    return res.data.rooms || [];
  } catch (err) {
    console.warn(
      `No room found for tenant ID ${tenantId}:`,
      err.response?.data?.error || err.message
    );
    return [];
  }
}

// Get all available (unoccupied) rooms for current admin
export async function getAvailableRooms() {
  try {
    const res = await api.get(getRoute("rooms", "available"));
    return res.data.rooms || [];
  } catch (err) {
    const message = err.response?.data?.error || "Failed to fetch available rooms";
    throw new Error(message);
  }
}

// Update a room
export async function updateRoom({ id, name, floor, price }) {
  try {
    const res = await api.patch(getRoute("rooms", "update", { id }), {
      name,
      floor,
      price,
    });
    return res.data;
  } catch (err) {
    const message = err.response?.data?.error || "Room update failed";
    throw new Error(message);
  }
}

// Delete a room
export async function deleteRoom(id) {
  try {
    const res = await api.delete(getRoute("rooms", "delete", { id }));
    return res.data;
  } catch (err) {
    const message = err.response?.data?.error || "Room delete failed";
    throw new Error(message);
  }
}
