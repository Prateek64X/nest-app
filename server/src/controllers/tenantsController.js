// controllers/tenantsController.js
import prisma from '../db/prisma.js';

export const createTenant = async (req, res) => {
  const { full_name, phone, move_in_date, rooms, documents } = req.body;
  const { id: admin_id } = req.admin;

  if (!full_name || !phone || !rooms || rooms.length === 0) {
    return res.status(400).json({ error: "Missing required fields or no rooms selected" });
  }

  try {
    // Check if phone is already used
    const existingTenant = await prisma.tenants.findUnique({
      where: { phone },
    });

    if (existingTenant) {
      return res.status(400).json({ error: "Phone number already in use" });
    }

    // Wrap in a transaction
    const tenant = await prisma.$transaction(async (tx) => {
      const createdTenant = await tx.tenants.create({
        data: {
          admin_id,
          full_name,
          phone,
          password: phone,
          move_in_date: move_in_date ? new Date(move_in_date) : null,
          move_out_date: null,
          doc_aadhar: documents?.doc_aadhar || "",
          doc_pan: documents?.doc_pan || "",
          doc_voter: documents?.doc_voter || "",
          doc_license: documents?.doc_license || "",
          doc_police: documents?.doc_police || "",
          doc_agreement: documents?.doc_agreement || "",
        },
      });

      // Update rooms and tenant_rooms
      for (const room of rooms) {
        const { id: roomId, price } = room;

        await tx.rooms.updateMany({
          where: {
            id: roomId,
            admin_id,
          },
          data: {
            tenant_id: createdTenant.id,
            price,
            occupied: true,
          },
        });
      }

      return createdTenant;
    });

    // Return response with tenant.id
    res.status(201).json({
      success: true,
      message: "Tenant created and rooms assigned successfully",
      tenantId: tenant.id,
    });

  } catch (err) {
    console.error("Error creating tenant:", err);
    res.status(500).json({ error: "Something went wrong while creating tenant" });
  }
};


export const getTenants = async (req, res) => {
  const { id: admin_id } = req.admin;

  try {
    const tenants = await prisma.tenants.findMany({
      where: {
        admin_id
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json({ success: true, tenants });
  } catch (err) {
    console.error("Error fetching tenants:", err);
    res.status(500).json({ error: "Server error while fetching tenants" });
  }
};

export const updateTenant = async (req, res) => {
  const { id: tenantId } = req.params;
  const { full_name, phone, move_in_date, move_out_date, rooms = [] } = req.body;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Update tenant
      const updated = await tx.tenants.update({
        where: { id: tenantId },
        data: {
          full_name,
          phone,
          move_in_date: move_in_date ? new Date(move_in_date) : null,
          move_out_date: move_out_date ? new Date(move_out_date) : null,
        },
      });

      // If rooms were sent, update their prices
      for (const room of rooms) {
        const { id: roomId, price } = room;

        await tx.tenant_rooms.updateMany({
          where: {
            tenant_id: tenantId,
            room_id: roomId,
          },
          data: { price },
        });
      }
    });

    res.status(200).json({
      success: true,
      message: "Tenant updated successfully",
    });

  } catch (err) {
    console.error("Error updating tenant:", err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Tenant not found" });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
};