import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { MdCheck, MdClear } from "react-icons/md";
import { cn } from "@/lib/utils";
import { FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { AlertDialogLu } from "../shared/AlertDialogLu";
import { toast } from "sonner";
import { updateUpdateRequest } from "@/services/updateRequestService";
import { Label } from "../ui/label";

export default function UpdateRequestCard({ request, onDismiss, isAdmin = false }) {
  const [showDismissConfirm, setShowDismissConfirm] = useState(false);
  const [showAcknowledgeConfirm, setShowAcknowledgeConfirm] = useState(false);

  async function handleUpdateRequest(req_id, status) {
    // status is dismissed or acknowledged
    if (!req_id || !status) {
      toast.error("Invalid request Id or status");
    }

    try {
      const res = await updateUpdateRequest(req_id, status);
      let toastMessage = 'Request Updated'
      if (!res.success) {
        toastMessage = 'Failed to update'
        toast.error(toastMessage);
      }
      toast.success(toastMessage);
      onDismiss(req_id);
    } catch (err) {
      const message =
        err?.message || err?.error || "Failed to update";
      toast.error(message);
    }
  }

  return (
    <>
      <Card className="p-4 gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {new Date(request.created_at).toLocaleDateString()}
          </p>
          <span
            className={cn(
              "text-xs font-medium capitalize",
              request.status === "acknowledged"
                ? "text-green-600"
                : "text-muted-foreground"
            )}
          >
            {request.status}
          </span>
        </div>

        {isAdmin && request.tenants?.full_name && (
          <span className="text-lg font-semibold text-foreground">{request.tenants.full_name}</span>
        )}

        {/* Bottom Row (Message + Buttons) */}
        {(request.message || !isAdmin) ? (
          <div className="flex items-center justify-between -mt-1">
            <p className="text-sm text-foreground truncate max-w-[80%]">
              {request.message || ""}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="whitespace-nowrap"
                onClick={() => setShowDismissConfirm(true)}
              >
                <MdClear className="w-4 h-4" />
                {!isAdmin && <span>Dismiss</span>}
              </Button>

              {isAdmin && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="whitespace-nowrap bg-positive hover:bg-green-200"
                  onClick={() => setShowAcknowledgeConfirm(true)}
                >
                  <MdCheck className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-end gap-2 -mt-9">
            <Button
              variant="secondary"
              size="sm"
              className="whitespace-nowrap"
              onClick={() => setShowDismissConfirm(true)}
            >
              <MdClear className="w-4 h-4" />
            </Button>

            <Button
              variant="secondary"
              size="sm"
              className="whitespace-nowrap bg-positive hover:bg-green-200"
              onClick={() => setShowAcknowledgeConfirm(true)}
            >
              <MdCheck className="w-4 h-4" />
            </Button>
          </div>
        )}
      </Card>

      {/* AlertDialog for Dismiss Confirmation */}
      <AlertDialogLu
        open={showDismissConfirm}
        onOpenChange={setShowDismissConfirm}
        title="Sure? This will remove your request."
        cancelLabel="Cancel"
        actionLabel="Dismiss"
        icon={<FaExclamationTriangle />}
        onConfirm={() => handleUpdateRequest(request.id, "dismissed")}
      />

      <AlertDialogLu
        open={showAcknowledgeConfirm}
        onOpenChange={setShowAcknowledgeConfirm}
        title="Have you updated price for tenant?"
        cancelLabel="Cancel"
        actionLabel="Yes"
        icon={<FaExclamationTriangle />}
        onConfirm={() => handleUpdateRequest(request.id, "acknowledged")}
      />
    </>
  );
}