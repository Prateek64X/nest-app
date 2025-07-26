// controllers/tenantsController.js
import prisma from '../db/prisma.js';

export const createTenant = async (req, res) => {
  const { full_name, phone, move_in_date, photo_url, rooms, documents } = req.body;
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
          photo_url: photo_url || "",
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

export const getTenantById = async (req, res) => {
  const { id: admin_id } = req.admin;
  const { id } = req.params; // tenant ID from URL

  if (!id) {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    const tenant = await prisma.tenants.findFirst({
      where: {
        id: id,
        admin_id,
      },
    });

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found or not authorized" });
    }

    res.json({ success: true, tenant });
  } catch (err) {
    console.error("Error fetching tenant:", err);
    res.status(500).json({ error: "Server error while fetching tenant" });
  }
};

// Get multiple tenants by ids
export const getTenantsByIds = async (req, res) => {
  const { id: admin_id } = req.admin;
  const ids = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "Array of tenant IDs is required in the body" });
  }

  // Filter only valid non-empty string UUIDs
  const validIds = ids.filter(id => typeof id === 'string' && id.length > 0);

  if (validIds.length === 0) {
    return res.status(400).json({ error: "No valid tenant UUIDs provided" });
  }

  try {
    const tenants = await prisma.tenants.findMany({
      where: {
        id: {
          in: validIds,
        },
        admin_id,
      },
      select: {
        id: true,
        full_name: true,
        phone: true,
        move_in_date: true,
        move_out_date: true,
        photo_url: true,
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
  const { id: admin_id } = req.admin;
  const { full_name, phone, move_in_date, move_out_date, photo_url, rooms, documents } = req.body;

  if (!tenantId || !full_name || !phone || !Array.isArray(rooms)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Update tenant info
      await tx.tenants.update({
        where: { id: tenantId },
        data: {
          full_name,
          phone,
          move_in_date: move_in_date ? new Date(move_in_date) : null,
          move_out_date: move_out_date ? new Date(move_out_date) : null,
          photo_url: photo_url || "",
          doc_aadhar: documents?.doc_aadhar || "",
          doc_pan: documents?.doc_pan || "",
          doc_voter: documents?.doc_voter || "",
          doc_license: documents?.doc_license || "",
          doc_police: documents?.doc_police || "",
          doc_agreement: documents?.doc_agreement || "",
        },
      });

      // 2. Clear existing room assignments
      await tx.rooms.updateMany({
        where: {
          tenant_id: tenantId,
          admin_id,
        },
        data: {
          tenant_id: null,
          occupied: false,
        },
      });

      // 3. Assign new rooms
      for (const room of rooms) {
        const { id: roomId, price } = room;

        await tx.rooms.updateMany({
          where: {
            id: roomId,
            admin_id,
          },
          data: {
            tenant_id: tenantId,
            price,
            occupied: true,
          },
        });
      }
    });

    return res.status(200).json({
      success: true,
      message: "Tenant updated and rooms reassigned successfully",
    });

  } catch (err) {
    console.error("Error updating tenant:", err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Tenant not found" });
    }
    return res.status(500).json({ error: "Something went wrong while updating tenant" });
  }
};
