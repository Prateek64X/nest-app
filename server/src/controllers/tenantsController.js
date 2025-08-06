// controllers/tenantsController.js
import prisma from '../db/prisma.js';
import cloudinary from '../utils/cloudinary.js';

export const createTenant = async (req, res) => {
  const { id: admin_id } = req.admin;

  try {
    const files = req.files || [];
    const {
      full_name,
      phone,
      move_in_date,
      rooms: roomsJSON,
    } = req.body;

    if (!full_name || !phone || !roomsJSON) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const rooms = JSON.parse(roomsJSON);
    if (!rooms.length) {
      return res.status(400).json({ error: "No rooms selected" });
    }

    const existingTenant = await prisma.tenants.findUnique({ where: { phone } });
    if (existingTenant) {
      return res.status(400).json({ error: "Phone number already in use" });
    }

    // Photo upload
    let photo_url = '';
    const photoFile = files.find((f) => f.fieldname === 'photo');
    if (photoFile) {
      const uploadedPhoto = await cloudinary.uploadStreamAsync(photoFile.buffer, {
        folder: 'tenants/photos',
      });
      photo_url = uploadedPhoto.secure_url;
    }

    // Documents Upload
    const documentKeys = [
      'doc_aadhar',
      'doc_pan',
      'doc_voter',
      'doc_license',
      'doc_police',
      'doc_agreement',
    ];

    const uploadedDocs = {};

    for (const key of documentKeys) {
      const file = files.find((f) => f.fieldname === key);
      const existingUrl = req.body[`${key}_url`];

      if (file) {
        const uploadResult = await cloudinary.uploadStreamAsync(file.buffer, {
          folder: 'tenants/documents',
        });
        uploadedDocs[key] = uploadResult.secure_url;
      } else if (existingUrl) {
        uploadedDocs[key] = existingUrl;
      } else {
        uploadedDocs[key] = null; // treat as deleted
      }
    }

    const tenant = await prisma.$transaction(async (tx) => {
      const createdTenant = await tx.tenants.create({
        data: {
          admin_id,
          full_name,
          phone,
          password: phone,
          move_in_date: move_in_date ? new Date(move_in_date) : null,
          photo_url,
          move_out_date: null,
          ...uploadedDocs,
        },
      });

      for (const room of rooms) {
        await tx.rooms.updateMany({
          where: { id: room.id, admin_id },
          data: {
            tenant_id: createdTenant.id,
            price: room.price,
            occupied: true,
          },
        });
      }

      return createdTenant;
    });

    return res.status(201).json({
      success: true,
      message: "Tenant created and rooms assigned successfully",
      tenantId: tenant.id,
    });

  } catch (err) {
    console.error("Error creating tenant:", err);
    return res.status(500).json({ error: "Something went wrong while creating tenant" });
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
  const { id: admin_id } = req.admin || {};
  const { id } = req.params; // tenant ID from URL

  if (!id) {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    const whereClause = { id };
    if (admin_id) {
      whereClause.admin_id = admin_id;
    }

    const tenant = await prisma.tenants.findFirst({
      where: whereClause,
      include: {
        rooms: {
          select: { name: true },
        },
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

  try {
    const files = req.files || [];
    const {
      full_name,
      phone,
      move_in_date,
      move_out_date,
      rooms: roomsJSON,
    } = req.body;

    if (!tenantId || !full_name || !phone || !roomsJSON) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const rooms = JSON.parse(roomsJSON);
    if (!rooms.length) {
      return res.status(400).json({ error: "No rooms selected" });
    }

    const existingTenant = await prisma.tenants.findUnique({ where: { id: tenantId } });
    if (!existingTenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    // Update photo
    let photo_url = existingTenant.photo_url;
    const photoFile = files.find((f) => f.fieldname === 'photo');
    if (photoFile) {
      if (photo_url) {
        await cloudinary.deleteByUrl(photo_url);
      }
      const uploadedPhoto = await cloudinary.uploadStreamAsync(photoFile.buffer, {
        folder: 'tenants/photos',
      });
      photo_url = uploadedPhoto.secure_url;
    }

    // Process documents (snake_case keys)
    const documentKeys = [
      'doc_aadhar',
      'doc_pan',
      'doc_voter',
      'doc_license',
      'doc_police',
      'doc_agreement',
    ];

    const updatedDocs = {};

    for (const key of documentKeys) {
      const file = files.find((f) => f.fieldname === key);
      const existingUrl = existingTenant[key];
      const inputUrl = req.body[`${key}_url`];

      if (file) {
        if (existingUrl) {
          await cloudinary.deleteByUrl(existingUrl);
        }
        const uploaded = await cloudinary.uploadStreamAsync(file.buffer, {
          folder: 'tenants/documents',
        });
        updatedDocs[key] = uploaded.secure_url;
      } else if (inputUrl === '' || inputUrl === null) {
        if (existingUrl) {
          await cloudinary.deleteByUrl(existingUrl);
        }
        updatedDocs[key] = null;
      } else if (inputUrl === existingUrl) {
        updatedDocs[key] = existingUrl;
      } else if (inputUrl) {
        updatedDocs[key] = inputUrl;
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.tenants.update({
        where: { id: tenantId },
        data: {
          full_name,
          phone,
          move_in_date: move_in_date ? new Date(move_in_date) : null,
          move_out_date: move_out_date ? new Date(move_out_date) : null,
          photo_url,
          ...updatedDocs,
        },
      });

      // Clear existing room assignments
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

      // Reassign new rooms
      for (const room of rooms) {
        await tx.rooms.updateMany({
          where: {
            id: room.id,
            admin_id,
          },
          data: {
            tenant_id: tenantId,
            price: room.price,
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
    return res.status(500).json({ error: "Something went wrong while updating tenant" });
  }
};

// Call it to update profile details by tenant login
export const updateTenantProfile = async (req, res) => {
  const { id: tenantId } = req.params;
  const { full_name, phone, password } = req.body;

  if (!tenantId || !full_name || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existingTenant = await prisma.tenants.findUnique({ where: { id: tenantId } });

    if (!existingTenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const updateData = {
      full_name,
      phone,
    };

    if (password && password !== existingTenant.password) {
      updateData.password = password;
    }

    const updatedTenant = await prisma.tenants.update({
      where: { id: tenantId },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: "Tenant profile updated successfully",
      tenant: updatedTenant,
    });

  } catch (err) {
    console.error("Error updating tenant profile:", err);
    res.status(500).json({ error: "Error updating tenant profile" });
  }
};


export const deleteTenant = async (req, res) => {
  const { id: tenantId } = req.params;
  const { id: admin_id } = req.admin;

  try {
    if (!tenantId) {
      return res.status(400).json({ error: "Missing tenant ID" });
    }

    const existingTenant = await prisma.tenants.findUnique({ where: { id: tenantId } });

    if (!existingTenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    // Define all document fields including photo
    const mediaKeys = [
      'photo_url',
      'doc_aadhar',
      'doc_pan',
      'doc_voter',
      'doc_license',
      'doc_police',
      'doc_agreement',
    ];

    // Move each cloudinary image to 'tenants/deleted'
    for (const key of mediaKeys) {
      const url = existingTenant[key];
      if (url && url.includes('cloudinary')) {
        try {
          await cloudinary.moveToFolderByUrl(url, 'tenants/deleted');
        } catch (err) {
          console.warn(`Failed to move ${key} to deleted folder:`, err.message);
        }
      }
    }

    // Remove tenant reference from rooms
    await prisma.rooms.updateMany({
      where: {
        tenant_id: tenantId,
        admin_id,
      },
      data: {
        tenant_id: null,
        occupied: false,
      },
    });

    // Delete the tenant from DB
    await prisma.tenants.delete({
      where: { id: tenantId },
    });

    return res.status(200).json({
      success: true,
      message: "Tenant deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting tenant:", err);
    return res.status(500).json({ error: "Something went wrong while deleting tenant" });
  }
};
