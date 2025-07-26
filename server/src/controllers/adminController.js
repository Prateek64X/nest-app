// src/controllers/adminController.js
import bcrypt from 'bcrypt';
import prisma from '../db/prisma.js';
import { generateToken } from '../utils/jwt.js';

export const loginAdmin = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ error: "Phone number and password are required" });
  }

  try {
    const admin = await prisma.admins.findUnique({
      where: { phone_number: phone },
    });

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({ id: admin.id });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: { id: admin.id },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

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
