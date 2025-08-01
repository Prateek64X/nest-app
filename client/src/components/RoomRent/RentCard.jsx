import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import '@/styles/components.css';
import { FaCheck, FaHome, FaBolt, FaWallet } from "react-icons/fa";
import { MdWaterDrop } from "react-icons/md";
import EditElectricityModal from './EditElectricityModal';
import MarkPaidModal from './MarkPaidModal';
import { debounce } from 'lodash';
import { updateRoomRent } from '@/services/roomRentsService';

const getPaymentStatus = (totalCost, paidAmount) => {
  const total = Number(totalCost) || 0;
  const paid = Number(paidAmount) || 0;

  if (paid === 0) return 'unpaid';
  if (paid < total) return 'partial';
  if (paid >= total) return 'paid';
  return 'unknown';
};

export default function RentCard({ existingRoomRent }) {
  const [expanded, SetExpanded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(() =>
    getPaymentStatus(existingRoomRent?.totalCost, existingRoomRent?.paidAmount)
  );
  const [roomRent, setRoomRent] = useState({ ...existingRoomRent });

  const updateRoomRentFields = (fields) => {
    const updated = { ...roomRent, ...fields };
    setRoomRent(updated);
    handleFieldBlur(updated);
  };

  const handleFieldUpdate = (field, value) => {
    setRoomRent((prev) => ({ ...prev, [field]: value }));
  };

  const handleFieldBlur = async (data = roomRent) => {
    try {
      await updateRoomRent({
        id: data.id,
        roomId: data.room?.id,
        roomCost: data.roomCost,
        electricityCost: data.electricityCost,
        electricityUnits: data.electricityUnits,
        maintenanceCost: data.maintenanceCost,
        paidAmount: data.paidAmount,
      });
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };

  return(
      <>
          <Card className="p-4 relative">
              <Accordion type="single" collapsible value={expanded} onValueChange={SetExpanded}>
                  <AccordionItem value="rentcard-1">
                      <AccordionTrigger className="py-0 text-left">
                          <CollapsedRentContent 
                            roomRent={roomRent} 
                            isPaid={paymentStatus} 
                            expanded={expanded} 
                          />
                      </AccordionTrigger>

                      <AccordionContent className="pt-0 pb-2">
                          <ExpandedRentContent
                            roomRent={roomRent}
                            isPaid={paymentStatus}
                            onFieldUpdate={handleFieldUpdate}
                            onFieldBlur={handleFieldBlur}
                            updateRoomRentFields={updateRoomRentFields}
                          />
                      </AccordionContent>
                  </AccordionItem>
              </Accordion>
          </Card>
      </>
  );
}

function CollapsedRentContent({roomRent, isPaid, expanded}) {
    return (
        <div className="flex items-start gap-4 w-full">
            <img
                className="w-12 h-12 rounded-full object-cover"
                src={roomRent?.tenant?.photoUrl}
                alt="Tenant Photo"
            />

            <div className="flex flex-col flex-1">
                {/* Top Row */}
                <div className="flex justify-between items-center">
                    <h2 className="text-base font-medium">{roomRent?.tenant?.fullName}</h2>
                    <span className='text-sm text-muted-foreground'>{roomRent?.room?.floor} - {roomRent?.room?.name}</span>
                </div>

                {/* Bottom Row */}
                {!expanded ? 
                (
                    <div className="flex items-center">
                        <span className='text-base font-medium text-primary'>₹ {roomRent?.totalCost}</span>
                        {isPaid && <FaCheck className='w-3 h-3 text-green-600 ml-2' />}
                    </div>
                ) : (
                    <span className="text-xs text-muted-foreground my-2">
                    Cost Breakdown
                    </span>
                )}
            </div>
        </div>
    );
}

function ExpandedRentContent({ roomRent, isPaid, onFieldUpdate, onFieldBlur, updateRoomRentFields }) {
  const [showElectricityModal, setShowElectricityModal] = useState(false);
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);

  return (
    <div className='pl-16 mr-8'>
      <div className='max-w-full w-full'>
        <div className="grid grid-cols-[max-content_auto] items-center gap-y-2">

          <LabelRow
            icon={<FaHome className="mr-1 text-muted-foreground" />}
            label="Room Rent"
            value={roomRent?.roomCost?.toString() || ''}
            handleValueChange={(val) => onFieldUpdate("roomCost", parseFloat(val) || 0)}
            handleBlur={onFieldBlur}
          />

          <LabelRow
            icon={<FaBolt className="mr-1 text-muted-foreground" />}
            label="Electricity Cost"
            value={roomRent?.electricityCost?.toString() || ''}
            onClick={() => setShowElectricityModal(true)}
          />

          <LabelRow
            icon={<MdWaterDrop className="mr-1 text-muted-foreground" />}
            label="Maintainance Cost"
            value={roomRent?.maintenanceCost?.toString() || ''}
            handleValueChange={(val) => onFieldUpdate("maintenanceCost", parseFloat(val) || 0)}
            handleBlur={onFieldBlur}
          />

          <LabelRow
            icon={<FaWallet className="mr-1 text-foreground" />}
            label="Total Cost"
            value={roomRent?.totalCost}
            labelClassName="text-sm text-foreground"
            isTick={isPaid}
            readOnlyValue={true}
          />

          {(!isPaid && roomRent?.paidAmount !== 0) && (
            <LabelRow
              icon={<FaWallet className="mr-1 text-muted-foreground" />}
              label="Cost Paid"
              value={roomRent?.paidAmount}
              isTick={isPaid}
              readOnlyValue={true}
            />
          )}

        </div>
      </div>

      {isPaid && <FaCheck className="relative right-8 bottom-4 -mb-2 w-3 h-3 text-green-600 ml-2" />}
      <Button className="w-full mt-4" onClick={() => setShowMarkPaidModal(true)}>
        {isPaid ? "Edit Payment" : "Mark as Paid"}
      </Button>

      {/* Electricity modal */}
      {showElectricityModal && (
        <EditElectricityModal
          prevElectricityUnits={roomRent?.prevElectricityUnits}
          electricityUnits={roomRent?.electricityUnits}
          onClose={() => setShowElectricityModal(false)}
          onChange={({ electricityCost, electricityUnits }) => {
            updateRoomRentFields({ electricityCost, electricityUnits });
            setShowElectricityModal(false);
          }}
        />
      )}


      {/* Payment modal */}
      {showMarkPaidModal && (
        <MarkPaidModal
          onClose={() => setShowMarkPaidModal(false)}
          existingTotalCost={roomRent?.totalCost}
          existingpaidAmount={roomRent?.paidAmount}
          handlePaymentChange={(currentPayment) => {
            const newPaidAmount = (Number(roomRent?.paidAmount) || 0) + (Number(currentPayment) || 0);
            updateRoomRentFields({ paidAmount: newPaidAmount });
            setShowMarkPaidModal(false);
          }}
        />
      )}
    </div>
  );
}

// Row to display Rent Type and Cost in Table
function LabelRow({
  icon,
  label,
  symbol = "₹",
  value,
  onClick,
  handleValueChange,
  handleBlur,
  labelClassName = "text-sm text-muted-foreground",
  isTick,
  readOnlyValue = false
}) {
  return (
    <>
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground shrink-0">{icon}</span>
        <span className={labelClassName}>{label}</span>
      </div>

      <div className="flex items-center justify-end shrink-0 ml-2">
        {symbol && <span className="relative left-2 text-sm text-foreground">{symbol}</span>}

        {onClick ? (
          <button
            onClick={onClick}
            className={"bg-transparent text-sm text-right text-foreground w-20 truncate border-0 border-b border-input " +
              "hover:bg-accent hover:text-primary focus:outline-none"}
          >
            {value}
          </button>
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => handleValueChange?.(e.target.value)}
            onBlur={handleBlur}
            className={"bg-transparent text-sm text-right w-20 truncate border-0 border-b border-input " +
              (handleValueChange
                ? "focus:outline-none focus:border-primary cursor-text"
                : "cursor-default text-muted-foreground")}
            readOnly={readOnlyValue}
          />
        )}
      </div>
    </>
  );
}
