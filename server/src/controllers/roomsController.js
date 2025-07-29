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
        name,
        floor,
        price: Number(price),
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

// Get /room by Id
export const getRoomById = async (req, res) => {
  const { id: admin_id } = req.admin;
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid room id", id: id });
  }

  try {
    // Check if room exists and belongs to admin
    const room = await prisma.rooms.findFirst({
      where: {
        id: Number(id),
        admin_id,
      },
    });

    if (!room) {
      return res.status(404).json({ error: "Room not found or unauthorized" });
    }

    res.status(200).json({
      success: true,
      room,
    });

  } catch (err) {
    console.error("Error updating room:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// GET /rooms/by-tenant/:id
export const getRoomsByTenantId = async (req, res) => {
  const { id: admin_id } = req.admin;
  const { id: tenant_id } = req.params;

  if (!tenant_id || typeof tenant_id !== "string") {
    return res.status(400).json({ error: "Tenant ID is required and must be a string" });
  }

  try {
    const rooms = await prisma.rooms.findMany({
      where: {
        tenant_id: tenant_id, // UUID is a string, so this is fine
        admin_id: admin_id,   // also UUID string
      },
    });

    return res.status(200).json({ success: true, rooms });
  } catch (err) {
    console.error("Error fetching rooms by tenant ID:", err);
    return res.status(500).json({ error: "Server error while fetching rooms" });
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

  if (isNaN(Number(id))) {
    return res.status(404).json({ error: "Invalid room id", id: id });
  }

  try {
    // Check if room exists and belongs to admin
    const existingRoom = await prisma.rooms.findFirst({
      where: {
        id: Number(id),
        admin_id
      }
    });

    if (!existingRoom) {
      return res.status(404).json({ error: "Room not found or unauthorized" });
    }

    // Update room
    const updatedRoom = await prisma.rooms.update({
      where: { id: Number(id) },
      data: {
        name,
        floor,
        price: Number(price),
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

// Delete room by Id
export const deleteRoomById = async (req, res) => {
  const { id } = req.params;
  const admin_id = req.admin.id;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({error: "Invalid room id", id: id});
  }

  try {
    // Check if room exists and unoccupied
    const existingRoom = await prisma.rooms.findFirst({
      where: {
        id: Number(id),
        admin_id,
        occupied: false
      }
    });

    if (!existingRoom) {
      return res.status(404).json({ error: "Room not found or unauthorized" });
    }

    await prisma.rooms.delete({
      where: { id: Number(id) }
    });

    res.status(200).json({ success: true, message: "Room deleted successfully" });
  } catch (err) {
    console.error("Error deleting room:", err);
    res.status(500).json({ error: "Something went wrong" })
  }
}