import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FaEdit } from "react-icons/fa";
import ChangePasswordModal from "@/components/Profile/ChangePasswordModal";
import DeleteAccountDialog from "@/components/Profile/DeleteAccountDialog";
import { useAuth } from "@/auth/AuthProvider";
import { toast } from "sonner";
import { getTenantById, updateTenantProfile } from "@/services/tenantsService";
import { Separator } from "@/components/ui/separator";

export default function UserProfile() {
  const { user } = useAuth();
  const [tenant, setTenant] = useState(null);
  const [form, setForm] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Initialize and fetch data
  const fetchTenant = async () => {
    try {
      const data = await getTenantById(user?.id);
      if (data && data.id) {
        setTenant(data);
        setForm({
          full_name: data.full_name,
          phone: data.phone,
          room: data.rooms?.[0]?.name || "-",
        });
      }
    } catch (err) {
      toast.error(err.message || "Failed to load profile");
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchTenant();
    }
  }, [user]);

  // Form handling
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.full_name || !form.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        id: user.id,
        full_name: form.full_name,
        phone: form.phone,
      };

      if (form.password && form.password !== form.old_password) {
        payload.password = form.password;
      }


      const res = await updateTenantProfile(payload);

      if (res.success) {
        toast.success("Profile updated successfully");
        await fetchTenant();
        setForm((prev) => ({
          ...prev,
          password: "",
          old_password: "",
        }));
        setEditMode(false);
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = (clearSession = false) => {
    if (clearSession) {
      localStorage.clear();
    }
    window.location.href = "/login";
  }

  if (!tenant) {
    return <div className="text-center mt-10 text-muted-foreground">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen mt-[15vh] lg:justify-center">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <h2 className="text-lg font-semibold text-primary tracking-tight">My Profile</h2>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              {editMode ? (
                <Input
                  value={form.full_name}
                  onChange={(e) => handleChange("full_name", e.target.value)}
                />
              ) : (
                <p className="text-sm text-muted-foreground">{tenant.full_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              {editMode ? (
                <Input
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              ) : (
                <p className="text-sm text-muted-foreground">{tenant.phone}</p>
              )}
            </div>

            {!editMode && (
              <div className="space-y-2">
                <Label>Room</Label>
                <p className="text-sm text-muted-foreground">{form.room}</p>
              </div>
            )}

            {editMode && (
              <div className="space-y-2">
                <Label>Password</Label>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full justify-center"
                  onClick={() => setShowChangePasswordModal(true)}
                >
                  <FaEdit className="mr-1" /> Update Password
                </Button>
              </div>
            )}
          </div>

          {editMode ? (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Button
                variant="secondary"
                onClick={() => setEditMode(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          ) : (
            <div className="pt-2">
              <Button className="w-full" onClick={() => setEditMode(true)}>
                Edit Details
              </Button>
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            <Label for="logout-btn" className="text-secondary-foreground mt-2">Session</Label>
            <Button id="logout-btn" className="w-full" onClick={() => handleLogout(true)}>Logout</Button>
          </div>
        </CardContent>
      </Card>

      {showChangePasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowChangePasswordModal(false)}
          onChange={({ old_password, password }) => {
            handleChange("old_password", old_password);
            handleChange("password", password);
            setShowChangePasswordModal(false);
          }}
        />
      )}
    </div>
  );
}
