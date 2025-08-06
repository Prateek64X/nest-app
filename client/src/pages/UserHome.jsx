import { useEffect, useState } from "react";
import DateView from "@/components/DateView";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { FaBolt, FaHome, FaTrash, FaWallet } from "react-icons/fa";
import { MdClear, MdWaterDrop } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { getRoomRentByTenant } from "@/services/roomRentsService";
import { LabelRow } from "@/components/RoomRent/RentCard";
import { useAuth } from "@/auth/AuthProvider";
import UpdateRequestModal from "@/components/User/UpdateRequestModal";
import { getUpdateRequestTenant, updateUpdateRequest } from "@/services/updateRequestService";
import { cn } from "@/lib/utils";
import UpdateRequestCard from "@/components/User/UpdateRequestCard";

export default function UserHome() {
  const { user } = useAuth();
  const [roomRent, setRoomRent] = useState(null);
  const [updateRequests, setUpdateRequests] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUpdateRequest, setShowUpdateRequest] = useState(false);

  async function fetchRoomRent() {
    try {
      const data = await getRoomRentByTenant();
      setRoomRent(data);
    } catch (err) {
      const message =
        err?.message || err?.error || "Something went wrong while fetching rent";

      console.error("Fetch Error:", message);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUpdateRequests() {
    try {
      const data = await getUpdateRequestTenant(user?.id);
      setUpdateRequests(data);
    } catch (err) {
      const message =
        err?.message || err?.error || "Failed to fetch update requests";
      console.error("Request Fetch Error:", message);
      toast.error(message);
    }
  }

  async function handleDismissRequest(req_id) {
    if (!req_id) {
      toast.error("Invalid request ID");
    }

    try {
      const res = await updateUpdateRequest(req_id, "dismissed");
      let toastMessage = 'Request Updated'
      if (!res.success) {
        toastMessage = 'Failed to update'
        toast.error(toastMessage);
      }
      toast.success(toastMessage);
      fetchUpdateRequests();
    } catch (err) {
      const message =
        err?.message || err?.error || "Failed to update";
      toast.error(message);
    }
  }


  useEffect(() => {
    fetchRoomRent();
    fetchUpdateRequests();
  }, []);

  if (loading) return <p className="pt-12 text-center text-muted-foreground">Loading...</p>;
  if (error) return <p className="pt-12 text-center text-red-500">{error}</p>;
  if (!roomRent) return <p className="pt-12 text-center text-muted-foreground">No rent data found.</p>;

  const isPaid = roomRent.paymentStatus === "paid";

  return (
    <div className="min-h-screen pt-12">
      <DateView className="mb-4" />
      <h2 className='mt-18 mb-2 text-lg font-semibold text-primary tracking-tight ml-2'>This Month's Summary</h2>
      <Card className="p-8">
        <div className="max-w-full w-full">
          <div className="grid grid-cols-[max-content_auto] items-center gap-y-6">
            <LabelRow
              icon={<FaHome className="mr-1 text-muted-foreground" />}
              label="Room Rent"
              value={roomRent.roomCost?.toString() || ""}
              readOnlyValue={true}
            />

            <LabelRow
              icon={<FaBolt className="mr-1 text-muted-foreground" />}
              label="Electricity Cost"
              value={roomRent.electricityCost?.toString() || ""}
              readOnlyValue={true}
            />

            <LabelRow
              icon={<MdWaterDrop className="mr-1 text-muted-foreground" />}
              label="Maintainance Cost"
              value={roomRent.maintenanceCost?.toString() || ""}
              readOnlyValue={true}
            />

            <LabelRow
              icon={<FaWallet className="mr-1 text-foreground" />}
              label="Total Cost"
              value={roomRent.totalCost}
              labelClassName="text-sm text-foreground"
              isTick={isPaid}
              readOnlyValue={true}
            />

            {!isPaid && roomRent.paidAmount !== 0 && (
              <LabelRow
                icon={<FaWallet className="mr-1 text-muted-foreground" />}
                label="Cost Paid"
                value={roomRent.paidAmount}
                isTick={isPaid}
                readOnlyValue={true}
              />
            )}
          </div>
        </div>

        <Button className="w-full mt-2" variant="secondary" onClick={() => {setShowUpdateRequest(true)}}>
          <MdEdit className="w-4 h-4" />
          Request Updation
        </Button>
      </Card>

      {/* Update Requests */}
      {updateRequests?.length > 0 && (
        <div className="mt-6 space-y-2">
          <h2 className='text-lg font-semibold text-primary tracking-tight ml-2'>Update Requests</h2>
          {updateRequests.map((req) => (
            <UpdateRequestCard request={req} onDismiss={handleDismissRequest} />
          ))}
        </div>
      )}

      {showUpdateRequest && (
        <UpdateRequestModal
          tenant_id={user?.id || null}
          onClose={() => {
            setShowUpdateRequest(false);
            fetchUpdateRequests();
          }}
        />
      )}
    </div>
  );
}
