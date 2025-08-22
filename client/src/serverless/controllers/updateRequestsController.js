import prisma from '../db/prisma.js';

// 1. Tenant creates request
export const createUpdateRequest = async (req, res) => {
  const { tenant_id, message } = req.body;

  if (!tenant_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const admin_id = await getAdminIdByTenantId(tenant_id);
    if (!admin_id) {
      res.status(500).json({ error: "Admin ID not linked to tenant ID" });
    }

    const newRequest = await prisma.update_requests.create({
      data: {
        tenant_id,
        admin_id,
        message,
      },
    });

    res.status(201).json({ success: true, request: newRequest });
  } catch (err) {
    console.error("Create request error:", err);
    res.status(500).json({ error: err.message || "Failed to create update request" });
  }
};

// 2. Admin or tenant updates status (e.g., 'acknowledged' or 'dismissed')
export const updateUpdateRequest = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !["acknowledged", "dismissed"].includes(status)) {
    return res.status(400).json({ error: "Invalid status or request ID" });
  }

  try {
    const updated = await prisma.update_requests.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({ success: true, request: updated });
  } catch (err) {
    console.error("Update request error:", err);
    res.status(500).json({ error: "Failed to update request" });
  }
};

// 3. Admin fetches only 'pending' requests
export const getAllUpdateRequests = async (req, res) => {
  const { adminId } = req.params;

  try {
    const requests = await prisma.update_requests.findMany({
      where: {
        admin_id: adminId,
        status: "pending"
      },
      orderBy: { created_at: "desc" },
      include: {
        tenants: {
          select: { full_name: true, phone: true }
        }
      }
    });

    res.status(200).json({ success: true, requests });
  } catch (err) {
    console.error("Fetch requests error:", err);
    res.status(500).json({ error: "Failed to fetch update requests" });
  }
};

// 4. Tenant fetches their request if not dismissed
export const getUpdateRequestTenant = async (req, res) => {
  const { tenantId } = req.params;

  try {
    const request = await prisma.update_requests.findMany({
      where: {
        tenant_id: tenantId,
        NOT: { status: "dismissed" }
      },
      orderBy: { created_at: "desc" }
    });

    if (!request) {
      return res.status(404).json({ error: "No visible update request found" });
    }

    res.status(200).json({ success: true, request });
  } catch (err) {
    console.error("Tenant fetch error:", err);
    res.status(500).json({ error: "Failed to fetch tenant update request" });
  }
};

// Utility function
async function getAdminIdByTenantId(tenant_id) {
  try {
    const tenant = await prisma.tenants.findUnique({
      where: { id: tenant_id },
      select: { admin_id: true },
    });

    if (!tenant) {
      throw new Error("Tenant not found");
    }
    return tenant.admin_id;
    
  } catch (err) {
    throw new Error({ error: err });
  }
}