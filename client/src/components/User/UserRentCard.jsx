import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { FaHome, FaBolt, FaWallet, FaBed } from 'react-icons/fa';
import { MdWaterDrop, MdEdit } from 'react-icons/md';
import { LabelRow } from '../RoomRent/RentCard';

export default function UserRentCard({ roomRent, isPaid, setShowUpdateRequest }) {
  return (
    <Card className="p-8">
      <div className="max-w-full w-full">
        {/* Room info centered */}
        <div className="flex justify-center items-center mb-6 space-x-2">
          <FaBed className="" />
          <span className="text-sm">
            Floor {roomRent.room?.floor} - {roomRent.room?.name}
          </span>
        </div>
        
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

      <Button
        className="w-full mt-2"
        variant="secondary"
        onClick={() => setShowUpdateRequest(true)}
      >
        <MdEdit className="w-4 h-4" />
        Request Updation
      </Button>
    </Card>
  );
}
