import { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { AlertDialogLu } from "../shared/AlertDialogLu";
import { toast } from "sonner";

export default function DeleteAccountDialog({ open, onOpenChange, homeName, onConfirm }) {
  const [confirmationText, setConfirmationText] = useState("");
  const expectedText = `Delete ${homeName}`;
  const isValid = confirmationText.trim() === expectedText;

  const handleConfirm = () => {
    if (isValid) {
      onConfirm();
    }
  };

  const handleConfirmClick = () => {
    if (confirmationText !== expectedText) {
      toast.error("Confirmation text does not match. Please type it exactly.");
      return;
    }

    // Proceed with delete
    handleConfirm();
  };


  return (
    <AlertDialogLu
      open={open}
      onOpenChange={onOpenChange}
      icon={<FaExclamationTriangle className="text-destructive" />}
      title="Are you sure you want to delete your account?"
      description={
        <div className="space-y-4 text-sm">
          <span>This action cannot be undone...</span>
          <div className="space-y-1">
            <span className="font-medium">To confirm, type: </span>
            <div className="text-muted-foreground font-mono text-sm border px-2 py-1 rounded bg-muted/50 inline-block">
              {expectedText}
            </div>
            <Input
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Enter confirmation text"
              className="mt-2"
            />
          </div>
        </div>
      }
      cancelLabel="Cancel"
      actionLabel="Delete Account"
      showActionButton={true}
      onConfirm={handleConfirmClick} // always call the function
    />
  );
}
