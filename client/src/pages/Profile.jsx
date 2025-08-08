import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// import DeleteAccountDialog from "@/components/DeleteAccountDialog";
import { deleteAdminAccount, getAdminProfile, updateAdminProfile } from "@/services/adminService";
import { toast } from "sonner";
import PhoneInputLu from "@/components/shared/PhoneInputLu";
import ChangePasswordModal from "@/components/Profile/ChangePasswordModal";
import { FaEdit } from "react-icons/fa";
import DeleteAccountDialog from "@/components/Profile/DeleteAccountDialog";

export default function Profile() {
  const [admin, setAdmin] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    home_name: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  async function fetchProfile() {
    try {
      const res = await getAdminProfile();
      setAdmin(res?.admin);
      setForm({
        full_name: res.admin?.full_name || "",
        phone_number: res.admin?.phone_number || "",
        email: res.admin?.email || "",
        home_name: res.admin?.home_name || "",
        password: "",
      });
    } catch (err) {
      toast.error(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        password: form.password || undefined,
      };
      await updateAdminProfile(payload);
      toast.success("Profile updated successfully.");
      setEditMode(false);
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
      fetchProfile();
    }
  };

  const handleDeleteAccount = async () => {
    setSaving(true);
    try {
      await deleteAdminAccount();
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to delete profile");
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

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen pt-12">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <h2 className="text-lg font-semibold text-primary tracking-tight">My Profile</h2>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              {editMode ? (
                <Input value={form.full_name} onChange={(e) => handleChange("full_name", e.target.value)} />
              ) : (
                <p className="text-sm text-muted-foreground">{admin.full_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              {editMode ? (
                <div className="space-y-2">
                    <PhoneInputLu
                        nameValue="admin-phone"
                        valueInput={form.phone_number}
                        onChangeInput={(value) => handleChange("phone_number", value)}
                    />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{admin.phone_number}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              {editMode ? (
                <Input value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
              ) : (
                <p className="text-sm text-muted-foreground">{admin.email || "-"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Home Name</Label>
              {editMode ? (
                <Input value={form.home_name} onChange={(e) => handleChange("home_name", e.target.value)} />
              ) : (
                <p className="text-sm text-muted-foreground">{admin.home_name}</p>
              )}
            </div>

            {editMode && (
              <div className="space-y-2">
                <Label>Password</Label>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full justify-center"
                  onClick={() => setShowChangePasswordModal(true)}
                >
                  <FaEdit /> Update Password
                </Button>
              </div>
            )}

          </div>

          <>
            {editMode ? (
              <div className="grid grid-cols-2 items-center justify-between gap-4 pt-2">
                <Button variant="secondary" onClick={() => setEditMode(false)} disabled={saving}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            ) : (
              <div className="items-center justify-between gap-4 pt-2">
                <Button className="w-full" onClick={() => setEditMode(true)}>Edit Details</Button>
              </div>
            )}
          </>

          <Separator />

          <div className="space-y-2 pt-2">
            <Label for="delete-acc-btn" className="text-sm font-medium text-destructive">Danger Zone</Label>
            <Button id="delete-acc-btn" variant="destructive" onClick={() => setShowDeleteDialog(true)} className="w-full">
              Delete Account
            </Button>
            <Label for="logout-btn" className="text-secondary-foreground mt-2">Session</Label>
            <Button id="logout-btn" className="w-full" onClick={() => handleLogout(true)}>Logout</Button>
          </div>
        </CardContent>
      </Card>

      {showChangePasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowChangePasswordModal(false)}
          onChange={({ oldPassword, newPassword }) => {
            handleChange("old_password", oldPassword);
            handleChange("password", newPassword);
            setShowChangePasswordModal(false);
          }}
        />
      )}


      {showDeleteDialog && (
        <DeleteAccountDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          homeName={admin?.home_name || ""}
          onConfirm={handleDeleteAccount}
        />
      )}
    </div>
  );
}