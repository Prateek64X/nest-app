// src/controllers/roomsController.js
import prisma from '../db/prisma.js';

export const createRoom = async (req, res) => {
  const { name, floor, price } = req.body;
  const { id: admin_id } = req.admin; // Comes from verifyToken middleware

  if (!name || !floor || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const room = await prisma.rooms.create({
      data: {
        admin_id,
        tenant_id: null,
        name,
        floor,
        price,
        occupied: false,
      },
      select: { id: true }
    });

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });

  } catch (err) {
    console.error("Error creating room:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// GET /rooms
export const getRooms = async (req, res) => {
  const { id: admin_id } = req.admin; // Comes from verifyToken

  try {
    const rooms = await prisma.rooms.findMany({
      where: { admin_id },
      orderBy: { created_at: 'desc' },
    });

    res.json({ success: true, rooms });
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ error: "Server error while fetching rooms" });
  }
};

// GET /rooms/available
export const getAvailableRooms = async (req, res) => {
  const { id: admin_id } = req.admin;

  try {
    const rooms = await prisma.rooms.findMany({
      where: {
        admin_id,
        occupied: false,
        tenant_id: null,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json({ success: true, rooms });
  } catch (err) {
    console.error("Error fetching available rooms:", err);
    res.status(500).json({ error: "Server error while fetching available rooms" });
  }
};


// PATCH /rooms/:id
export const updateRoomById = async (req, res) => {
  const { id } = req.params;
  const { name, floor, price } = req.body;
  const admin_id = req.admin.id;

  if (!name || !floor || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if room exists and belongs to admin
    const existingRoom = await prisma.rooms.findFirst({
      where: {
        id,
        admin_id
      }
    });

    if (!existingRoom) {
      return res.status(404).json({ error: "Room not found or unauthorized" });
    }

    // Update room
    const updatedRoom = await prisma.rooms.update({
      where: { id },
      data: {
        name,
        floor,
        price,
      },
    });

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      room: updatedRoom,
    });

  } catch (err) {
    console.error("Error updating room:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};