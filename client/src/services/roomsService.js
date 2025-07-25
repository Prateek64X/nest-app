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

export async function getRooms() {
    try {
        const res = await api.get('/rooms');
        return res.data;
    } catch (err) {
        const message = err.response?.data?.error || "Room fetching failed";
        throw new Error(message)
    }
}