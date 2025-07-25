import React, { useState } from "react";
import Modal from "./shared/Modal";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

export default function MarkPaidModal({onClose, handlePaymentChange, rentData}) {
    const [totalCost, setTotalCost] = useState(Number(rentData?.totalCost) || 0);
    const [remainingCost, setRemainingCost] = useState(Number(rentData?.totalCost - rentData?.paidCost) || 0);
    const [currentPayment, setCurrentPayment] = useState(remainingCost || 0);

    return(
        <Modal onClose={onClose}>
            <div className="w-[350] space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Update Payment</h2>

                <form className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor='total-cost'>Total Cost</Label>
                        <span className="text-lg" id='total-cost'>{'₹ ' + totalCost}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor='remaining-cost'>Remaining Payment</Label>
                        <span className="text-lg" id='remaining-cost'>{'₹ ' + remainingCost}</span>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor='current-payment'>Current Month's Payment</Label>
                        <Input type="number" id='current-payment' value={currentPayment} onChange={(e) => setCurrentPayment(e.target.value)} placeholder="Payment this month" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Button id='cancel-btn' variant='secondary' onClick={(e) => {e.preventDefault(); onClose();}}>Cancel</Button>
                        <Button id='update-payment' onClick={(e) => {e.preventDefault(); handlePaymentChange();}}>Confirm Payment</Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}