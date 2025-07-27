import React, { useState } from 'react';
import Modal from '@/components/shared/Modal';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputCurrency from '../shared/InputCurrency';
import { createRoom, updateRoom } from '@/services/roomsService';
import LoaderLu from '../shared/LoaderLu';
import { AlertDialogLu } from '../shared/AlertDialogLu';

export default function AddEditRoomModal({ isEdit = false, onClose, initialRoom = {} }) {
  const [roomName, setRoomName] = useState(initialRoom.name || '');
  const [floor, setFloor] = useState(initialRoom.floor || '');
  const [price, setPrice] = useState(initialRoom.price || '');
  const [loading, setLoading] = useState(false);

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const roomId = initialRoom?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!roomName.trim() || !floor.trim() || !price) {
      alert("Please fill all fields correctly");
      return;
    }

    if (isEdit && !roomId) {
      alert("Error: Missing room ID for update");
      return;
    }

    const payload = {
      name: roomName.trim(),
      floor: floor.trim(),
      price: Number(price),
    };

    try {
      setLoading(true);

      if (isEdit) {
        await updateRoom({ id: roomId, ...payload });
      } else {
        await createRoom({ ...payload });
      }
      setShowSuccessDialog(true);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return ( !loading ? (
    <Modal onClose={onClose}>
      <div className="w-[340px] space-y-5">
        <h2 className="text-lg font-semibold text-foreground">
          {isEdit ? 'Edit Room' : 'Add Room'}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="room-name">Room Name</Label>
            <Input
              id="room-name"
              value={roomName}
              placeholder="Enter room name (Ex: Hall, Kitchen)"
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="floor">Floor</Label>
            <Input
              id="floor"
              value={floor}
              placeholder="Enter floor name (Ex: 1, 2)"
              onChange={(e) => setFloor(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="room-cost">Room Cost</Label>
            <InputCurrency
                id="room-cost"
                symbol="₹"
                value={price}
                placeholder="Enter Room Cost"
                onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">{isEdit ? 'Save' : 'Done'}</Button>
          </div>
        </form>

        {/* Success Dialog */}
        <AlertDialogLu
          open={showSuccessDialog}
          onOpenChange={setShowSuccessDialog}
          title={"Success"}
          description={isEdit ? 'Room is updated successfully' : 'Room is created successfully'}
          cancelLabel={"Done"}
          showActionButton={false}
          onCancel={() => onClose()}
        />
      </div>
    </Modal>
  ) : (
    <Modal onClose={onClose}>
      <div className="w-[340px] space-y-5">
        <LoaderLu />
      </div>
    </Modal>
  ));
}
