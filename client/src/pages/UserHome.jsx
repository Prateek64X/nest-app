import { useEffect, useState } from "react";
import DateView from "@/components/DateView";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { FaBolt, FaHome, FaTrash, FaWallet } from "react-icons/fa";
import { MdClear, MdWaterDrop } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { getRoomRentsByTenant } from "@/services/roomRentsService";
import { useAuth } from "@/auth/AuthProvider";
import UpdateRequestModal from "@/components/User/UpdateRequestModal";
import { getUpdateRequestTenant } from "@/services/updateRequestService";
import UpdateRequestCard from "@/components/User/UpdateRequestCard";
import UserRentCard from "@/components/User/UserRentCard";
import LoaderLu from "@/components/shared/LoaderLu";

export default function UserHome() {
  const { user } = useAuth();
  const [roomRents, setRoomRents] = useState(null);
  const [updateRequests, setUpdateRequests] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUpdateRequest, setShowUpdateRequest] = useState(false);

  async function fetchRoomRent() {
    try {
      const data = await getRoomRentsByTenant();
      setRoomRents(data);
    } catch (err) {
      const message =
        err?.message || err?.error || "Something went wrong while fetching rent";

      setError("No rent entry for this month");
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

  useEffect(() => {
    fetchRoomRent();
    fetchUpdateRequests();
  }, []);

  if (loading) return <LoaderLu />;
  if (error) return <p className="pt-12 text-center text-red-500">{error}</p>;
  if (!roomRents || roomRents.length === 0) {
    return (
      <div className="min-h-screen pt-12 space-y-4">
        <DateView />
        <p className="pt-12 text-center text-muted-foreground">No rent entries found</p>
        
        {/* Update Requests */}
        <Button
          className="w-full mt-2"
          variant="secondary"
          onClick={() => setShowUpdateRequest(true)}
        >
          <MdEdit className="w-4 h-4" />
          Request Updation
        </Button>

        {updateRequests?.length > 0 && (
          <div className="mt-6 space-y-2">
            <h2 className='text-lg font-semibold text-primary tracking-tight ml-2'>Update Requests</h2>
            {updateRequests.map((req) => (
              <UpdateRequestCard request={req} onDismiss={() => fetchUpdateRequests()} />
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

  // Group rents by month
  const groupedByMonth = roomRents.reduce((acc, rent) => {
    const monthKey = rent.month.slice(0, 7); // "2025-08"
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(rent);
    return acc;
  }, {});

  return (
    <div className="min-h-screen pt-12">
      <DateView className="mb-4" />
      <h2 className='mt-18 mb-2 text-lg font-semibold text-primary tracking-tight ml-2'>This Month's Summary</h2>
      {Object.keys(groupedByMonth)
        .sort((a, b) => new Date(b) - new Date(a)) // newest month first
        .map((month) => (
          <div key={month} className="mb-6">
            {groupedByMonth.length > 1 && (
              <h2 className="text-muted-foreground font-medium text-sm border-b pb-1 ml-2">
                {new Date(groupedByMonth[month][0].month).toLocaleString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
            )}

            <div className="space-y-2">
              {groupedByMonth[month].map((rent) => {
                const isPaid = rent.payment_status === "paid";

                return (
                  <UserRentCard
                    key={rent.id}
                    roomRent={rent}
                    isPaid={isPaid}
                    setShowUpdateRequest={setShowUpdateRequest}
                  />
                );
              })}
            </div>
          </div>
        ))}

      {/* Update Requests */}
      {updateRequests?.length > 0 && (
        <div className="mt-6 space-y-2">
          <h2 className='text-lg font-semibold text-primary tracking-tight ml-2'>Update Requests</h2>
          {updateRequests.map((req) => (
            <UpdateRequestCard request={req} onDismiss={() => fetchUpdateRequests()} />
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
