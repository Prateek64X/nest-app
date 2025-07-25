// Using fetch

import api from "@/api/api";

export async function registerAdmin({ name, phone, email, password, home_name }) {
    try {
        const res = await api.post("/admin/register", {
            name, phone, email, password, home_name
        });

        return res.data;
    } catch (err) {
        const message = err.response?.data?.error || "Registration failed";
        throw new Error(message)
    }
}

export async function loginAdmin({ phone, password }) {
    try {
        const res = await api.post("/admin/login", {
            phone, password
        });

        return res.data;
    } catch (err) {
        const message = err.response?.data?.error || "Could not login";
        throw new Error(message);
    }
}