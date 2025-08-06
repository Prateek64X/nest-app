import React, { useState } from "react";
import Modal from "../shared/Modal";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { FiSend } from "react-icons/fi";
import { createUpdateRequest } from "@/services/updateRequestService";

export default function UpdateRequestModal({ onClose, tenant_id }) {
    const [message, setMessage] = useState("");

    const handleSend = async (e) => {
        e.preventDefault();

        try {
            await createUpdateRequest({ tenant_id, message });
            toast.success("Update request sent");
            onClose();
        } catch (err) {
            toast.error(err.message || "Failed to send request");
        }
    };

    return (
        <Modal onClose={onClose}>
            <div className="w-[350px] space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Are you sure?</h2>

                <form className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="request-message">Message</Label>
                        <Input
                            id="request-message"
                            placeholder="Add a message (optional)"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="secondary" onClick={(e) => { e.preventDefault(); onClose(); }}>
                            Cancel
                        </Button>
                        <Button onClick={handleSend}>
                            <FiSend className="mr-2 h-4 w-4" />
                            Send
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
