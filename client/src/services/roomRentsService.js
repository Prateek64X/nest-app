import api from "@/api/api";
import { getRoute } from "@/lib/utils";

// Create monthly rent entries for all active tenants
export async function createRoomRentEntries() {
  try {
    const res = await api.post(getRoute("room-rents", ""));

    const { success, message } = res.data;

    if (!success) {
      throw new Error(message || "Room rent creation failed");
    }

    return { success, message };
  } catch (err) {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      "Creating Room Rent Entries failed";
    throw new Error(message);
  }
}

// Fetch upcoming (unpaid/pending) rents
export async function getUpcomingRoomRents() {
  try {
    const res = await api.get(getRoute("room-rents", "upcoming"));
    return res.data?.data || [];
  } catch (err) {
    const message = err.response?.data?.error || "Fetching upcoming room rents failed";
    throw new Error(message);
  }
}

// Fetch all room rent records (admin)
export async function getRoomRents() {
  try {
    const res = await api.get(getRoute("room-rents", ""));

    if (!res.data?.success) {
      throw new Error(res.data?.message || "Fetching Room rents failed");
    }

    const data = res.data?.data;

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format: expected an array");
    }

    return data;
  } catch (err) {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      "Fetching Room rents failed";
    throw new Error(message);
  }
}

// Fetch rents for a tenant (when logged in as user)
export async function getRoomRentByTenant() {
  try {
    const res = await api.get(getRoute("room-rents", "tenant"));

    if (!res.data?.success) {
      throw new Error(res.data?.message || "Fetching tenant room rent failed");
    }

    const data = res.data?.data;

    if (!data || typeof data !== "object") {
      throw new Error("Invalid data format: expected an object");
    }

    return data;
  } catch (err) {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      "Fetching tenant room rent failed";
    throw new Error(message);
  }
}

// Update a rent record (admin updates payment/electricity/etc.)
export async function updateRoomRent({
  id,
  roomId,
  roomCost,
  electricityCost,
  electricityUnits,
  maintenanceCost,
  paidAmount,
}) {
  try {
    const res = await api.patch(getRoute("room-rents", `${id}`), {
      roomId,
      roomCost,
      electricityCost,
      electricityUnits,
      maintenanceCost,
      paidAmount,
    });

    return res.data;
  } catch (err) {
    const message = err.response?.data?.error || "Rent update failed";
    throw new Error(message);
  }
}
