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

// For profiles page
export async function getAdminProfile() {
    try {
        const res = await api.get("/admin/profile");
        return res.data;
    } catch (err) {
        const message = err.response?.data?.error || "Failed to fetch admin profile";
        throw new Error(message);
    }
}

export async function verifyAdminPassword(old_password) {
  try {
    const res = await api.post("/admin/verify-password", { old_password });
    return res.success;
  } catch (err) {
    const message = err.response?.data?.error || "Password verification failed";
    throw new Error(message);
  }
}

export async function updateAdminProfile({ full_name, phone_number, email, home_name, old_password, password }) {
  try {
    const res = await api.put("/admin/profile", {
      full_name,
      phone_number,
      email,
      home_name,
      old_password,
      password
    });
    return res.data;
  } catch (err) {
    const message = err.response?.data?.error || "Profile update failed";
    throw new Error(message);
  }
}

// Deletes all data in tables which is related to admin_id
export async function deleteAdminAccount() {
    try {
        const res = await api.delete("/admin/delete");
        return res.data;
    } catch (err) {
        const message = err.response?.data?.error || "Account deletion failed";
        throw new Error(message);
    }
}
