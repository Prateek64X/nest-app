import api from "@/api/api";
import { getRoute } from "@/lib/utils";

// Register a new admin
export async function registerAdmin({ name, phone, email, password, home_name }) {
  try {
    const res = await api.post(getRoute("admin", "register"), {
      name,
      phone,
      email,
      password,
      home_name,
    });

    if (!res.data?.success) {
      throw new Error(res.data?.message || "Registration failed");
    }

    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      "Registration failed";
    throw new Error(message);
  }
}

// Login as admin
export async function loginAdmin({ phone, password }) {
  try {
    const res = await api.post(getRoute("admin", "login"), { phone, password });

    if (!res.data?.success) {
      throw new Error(res.data?.message || "Login failed");
    }

    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      "Could not login";
    throw new Error(message);
  }
}

// Get profile details of logged-in admin
export async function getAdminProfile() {
  try {
    const res = await api.get(getRoute("admin", "profile"));

    if (!res.data?.success) {
      throw new Error(res.data?.message || "Fetching profile failed");
    }

    return res.data || {};
  } catch (err) {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch admin profile";
    throw new Error(message);
  }
}

// Verify admin's old password
export async function verifyAdminPassword(old_password) {
  try {
    const res = await api.post(getRoute("admin", "verify-password"), {
      old_password,
    });

    return res.success || false;
  } catch (err) {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      "Password verification failed";
    throw new Error(message);
  }
}

// Update profile details
export async function updateAdminProfile({
  full_name,
  phone_number,
  email,
  home_name,
  old_password,
  password,
}) {
  try {
    const res = await api.put(getRoute("admin", "profile"), {
      full_name,
      phone_number,
      email,
      home_name,
      old_password,
      password,
    });

    if (!res.data?.success) {
      throw new Error(res.data?.message || "Profile update failed");
    }

    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      "Profile update failed";
    throw new Error(message);
  }
}

// Delete admin account + related data
export async function deleteAdminAccount() {
  try {
    const res = await api.delete(getRoute("admin", "delete"));

    if (!res.data?.success) {
      throw new Error(res.data?.message || "Account deletion failed");
    }

    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      "Account deletion failed";
    throw new Error(message);
  }
}
