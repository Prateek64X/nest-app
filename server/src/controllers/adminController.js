// src/controllers/adminController.js
import bcrypt from 'bcrypt';
import prisma from '../db/prisma.js';
import { generateToken } from '../utils/jwt.js';

export const registerAdmin = async (req, res) => {
  const { name, phone, email, password, home_name } = req.body;

  if (!name || !phone || !password || !home_name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admins.create({
      data: {
        full_name: name,
        phone_number: phone,
        email: email || null,
        password: hashedPassword,
        home_name,
      },
      select: {
        id: true,
        full_name: true,
        phone_number: true,
        home_name: true,
        created_at: true,
      },
    });

    const token = generateToken({ id: newAdmin.id });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      admin: { id: newAdmin.id },
    });

  } catch (err) {
    console.error("Register error:", err);

    if (err.code === 'P2002' && err.meta?.target?.includes('phone_number')) {
      return res.status(409).json({ error: "Phone number already registered" });
    }

    res.status(500).json({ error: "Server error" });
  }
};


export const loginAdmin = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ error: "Phone number and password are required" });
  }

  try {
    // First try to login as admin
    const admin = await prisma.admins.findUnique({
      where: { phone_number: phone },
    });
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

      const token = generateToken({ id: admin.id, role: "admin" });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        admin: { id: admin.id },
      });
    }

    // If not found as admin, try as tenant
    const tenant = await prisma.tenants.findUnique({
      where: { phone },
    });

    if (!tenant || !tenant.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // If tenant password is stored in plain text, direct match
    if (tenant.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({ id: tenant.id, role: "tenant" });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      tenant: { id: tenant.id },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// controller/adminController.js
export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin.id;

    const admin = await prisma.admins.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone_number: true,
        home_name: true,
      },
    });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json({ success: true, admin });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const checkPassword = async (req, res) => {
  const { old_password } = req.body;
  const userId = req.admin?.id || req.tenant?.id;
  const role = req.admin ? "admin" : "tenant";

  if (!userId || !old_password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  try {
    if (role === "admin") {
      const admin = await prisma.admins.findUnique({ where: { id: userId } });

      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      const isMatch = await bcrypt.compare(old_password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Incorrect password" });
      }

    } else {
      const tenant = await prisma.tenants.findUnique({ where: { id: userId } });

      if (!tenant) {
        return res.status(404).json({ error: "Tenant not found" });
      }

      if (tenant.password !== old_password) {
        return res.status(401).json({ error: "Incorrect password" });
      }
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Password check error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// controllers/adminController.js
export const updateAdminProfile = async (req, res) => {
  const adminId = req.admin?.id; // from verifyToken
  const { full_name, phone_number, email, home_name, password } = req.body;

  if (!adminId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const updateData = {
      full_name,
      phone_number,
      email,
      home_name,
    };

    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await prisma.admins.update({
      where: { id: adminId },
      data: updateData,
      select: {
        id: true,
        full_name: true,
        phone_number: true,
        email: true,
        home_name: true,
        created_at: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      admin: updatedAdmin,
    });

  } catch (err) {
    console.error("Update admin profile error:", err);

    if (err.code === 'P2002' && err.meta?.target?.includes('phone_number')) {
      return res.status(409).json({ error: "Phone number already in use" });
    }

    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAdminAccount = async (req, res) => {
  const adminId = req.user.id;

  try {
    // Step 1: Delete related data manually
    await prisma.room_rents.deleteMany({
      where: { admin_id: adminId }
    });

    await prisma.tenants.deleteMany({
      where: { admin_id: adminId }
    });

    await prisma.rooms.deleteMany({
      where: { admin_id: adminId }
    });

    // Step 2: Delete admin
    await prisma.admins.delete({
      where: { id: adminId }
    });

    res.status(200).json({ success: true, message: "Account and all associated data deleted." });

  } catch (error) {
    console.error("Failed to delete admin account:", error);
    res.status(500).json({ error: "Failed to delete account" });
  }
};
