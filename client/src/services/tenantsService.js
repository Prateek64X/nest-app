import api from "@/api/api";
import { getRoute } from "@/lib/utils";

// Frontend -> Backend key map
export const TENANT_DOC_KEY_MAP = {
  docAadhar: "doc_aadhar",
  docPan: "doc_pan",
  docVoter: "doc_voter",
  docLicense: "doc_license",
  docPolice: "doc_police",
  docAgreement: "doc_agreement",
};

export const TENANT_DOC_KEY_MAP_REVERSE = Object.fromEntries(
    Object.entries(TENANT_DOC_KEY_MAP).map(([camel, snake]) => [snake, camel])
);

// Create Tenant (with file uploads)
export async function createTenant(formData) {
  try {
    const res = await api.post(getRoute("tenants", "create"), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    const message = err.response?.data?.error || "Tenant creation failed";
    throw new Error(message);
  }
}

// Get all tenants
export async function getTenants() {
  try {
    const res = await api.get(getRoute("tenants", "all"));
    return res.data || [];
  } catch (err) {
    const message = err.response?.data?.error || "Tenant fetching failed";
    throw new Error(message);
  }
}

// Get single tenant by ID
export async function getTenantById(tenantId) {
  try {
    const res = await api.get(getRoute("tenants", "byId", { id: tenantId }));
    return res.data.tenant;
  } catch (err) {
    const message = err.response?.data?.error || "Tenant fetching failed";
    throw new Error(message);
  }
}

// Get multiple tenants by an array of IDs
export async function getTenantsByIds(tenantIds) {
  try {
    const res = await api.post(getRoute("tenants", "byIds"), tenantIds);
    return res.data || [];
  } catch (err) {
    const message = err.response?.data?.error || "Tenant fetching failed";
    throw new Error(message);
  }
}

// Update Tenant (admin side, supports multipart for docs)
export async function updateTenant(formData) {
  try {
    const tenantId = formData.get("id");
    if (!tenantId) throw new Error("Missing tenant ID for update");

    const res = await api.patch(getRoute("tenants", "update", { id: tenantId }), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    const message = err.response?.data?.error || "Tenant update failed";
    throw new Error(message);
  }
}

// Update Tenant profile via user login (JSON body)
export async function updateTenantProfile(data) {
  try {
    const { id } = data;
    if (!id) throw new Error("Missing tenant ID for profile update");

    const res = await api.patch(getRoute("tenants", "profile", { id }), data);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.error || "Tenant profile update failed";
    throw new Error(message);
  }
}

// Delete Tenant
export async function deleteTenant(tenantId) {
  try {
    const res = await api.delete(getRoute("tenants", "delete", { id: tenantId }));
    return res.data;
  } catch (err) {
    const message = err.response?.data?.error || "Tenant delete failed";
    throw new Error(message);
  }
}