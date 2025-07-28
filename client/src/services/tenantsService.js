import api from "@/api/api";

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

export async function createTenant(formData) {
  try {
    console.log("Create Tenant Form Data", formData);
    const res = await api.post('/tenants/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data;
  } catch (err) {
    const message = err.response?.data?.error || "Tenant creation failed";
    throw new Error(message);
  }
}

export async function getTenants() {
    try {
        const res = await api.get('/tenants');
        return res.data;
    } catch (err) {
        const message = err.response?.data?.error || "Tenant fetching failed";
        throw new Error(message)
    }
}

// Get by Id
export async function getTenantById(tenant_id) {
    try {
        const res = await api.get(`/tenants/${tenant_id}`);
        return res.data.tenant;
    } catch (err) {
        const message = err.response?.data?.error || "Tenant fetching failed";
        throw new Error(message)
    }
}

// Get multiple tenants by an array of IDs
export async function getTenantsByIds(tenant_ids) {
  try {
    const res = await api.post("/tenants/by-ids", tenant_ids); // raw array
    return res.data;
  } catch (err) {
    const message = err.response?.data?.error || "Tenant fetching failed";
    throw new Error(message);
  }
}

export async function updateTenant(formData) {
  try {
    const tenantId = formData.get('id');

    if (!tenantId) {
      throw new Error("Missing tenant ID for update");
    }

    const res = await api.patch(`/tenants/${tenantId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data;
  } catch (err) {
    const message = err.response?.data?.error || "Tenant update failed";
    throw new Error(message);
  }
}

// Delete by Id
export async function deleteTenant(tenant_id) {
    try {
        const res = await api.delete(`/tenants/${tenant_id}`);
        return res.data;
    } catch (err) {
        const message = err.response?.data?.error || "Tenant fetching failed";
        throw new Error(message)
    }
}