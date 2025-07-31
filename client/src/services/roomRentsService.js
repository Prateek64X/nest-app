import api from "@/api/api";

export async function getUpcomingRoomRents() {
  try {
    const res = await api.get(`/room-rents/upcoming`);
    return res.data?.data;
  } catch (err) {
    const message = err.response?.data?.error || "Fetching upcoming room rents failed";
    throw new Error(message);
  }
}

export async function getRoomRents() {
  try {
    const res = await api.get('/room-rents');

    if (!res.data?.success) {
      throw new Error(res.data?.message || "Unexpected server response");
    }

    const data = res.data?.data;

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format: expected an array");
    }

    return data;
  } catch (err) {
    const message = err.response?.data?.message || err.message || "Fetching Room rent failed";
    throw new Error(message);
  }
}


export async function updateRoomRent({ id, roomId, roomCost, electricityCost, electricityUnits, maintenanceCost, paidAmount }) {
  try {
    const res = await api.patch(`/room-rents/${id}`, {
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
