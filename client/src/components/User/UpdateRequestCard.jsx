import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { MdClear } from "react-icons/md";
import { cn } from "@/lib/utils";
import { FaExclamationTriangle } from "react-icons/fa";
import { AlertDialogLu } from "../shared/AlertDialogLu";

export default function UpdateRequestCard({ request, onDismiss }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <Card className="p-4">
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

        <div className="flex items-center justify-between -mt-1">
          <p className="text-sm text-foreground truncate max-w-[80%]">
            {request.message || ""}
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="ml-4 whitespace-nowrap"
            onClick={() => setShowConfirm(true)}
          >
            <MdClear className="w-4 h-4 mr-1" />
            Dismiss
          </Button>
        </div>
      </Card>

      {/* AlertDialog for Dismiss Confirmation */}
      <AlertDialogLu
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Sure? This will remove your request."
        cancelLabel="Cancel"
        actionLabel="Dismiss"
        icon={<FaExclamationTriangle />}
        onConfirm={() => onDismiss(request.id)}
      />
    </>
  );
}