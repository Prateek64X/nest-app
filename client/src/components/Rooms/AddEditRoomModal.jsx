import React, { useState } from 'react';
import Modal from '@/components/shared/Modal';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputCurrency from '../shared/InputCurrency';
import { createRoom, updateRoom } from '@/services/roomsService';
import LoaderLu from '../shared/LoaderLu';
import { AlertDialogLu } from '../shared/AlertDialogLu';
import * as z from 'zod';
import { cn } from '@/lib/utils';

const roomSchema = z.object({
  name: z
    .string({
      required_error: 'Please enter room name',
      invalid_type_error: 'Please enter a valid text',
    })
    .min(1, 'Room name is required'),
  floor: z
    .string({
      required_error: 'Please enter floor',
      invalid_type_error: 'Please enter a valid string',
    })
    .min(1, 'Floor is required'),
  price: z
    .string()
    .min(1, 'Please enter room price')
    .refine((val) => !isNaN(Number(val)), {
      message: 'Please enter a valid number',
    })
    .transform((val) => Number(val)),
});

const getValidatedPayload = (room) => {
  const result = roomSchema.safeParse({
    name: room.name?.trim() ?? '',
    floor: room.floor?.trim() ?? '',
    price: room.price,
  });

  if (!result.success) {
    const errors = {};
    result.error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
    return { errors };
  }

  return { data: result.data };
};

function FormField({ id, label, children, error }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export default function AddEditRoomModal({ isEdit = false, onClose, onSubmit, initialRoom = {} }) {
  const [room, setRoom] = useState({
    name: initialRoom?.name ?? '',
    floor: initialRoom?.floor ?? '',
    price: initialRoom?.price ?? '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const roomId = initialRoom?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, errors: fieldErrors } = getValidatedPayload(room);

    if (fieldErrors) {
      setErrors(fieldErrors);
      return;
    }

    if (isEdit && !roomId) {
      alert('Error: Missing room ID for update');
      return;
    }

    try {
      setLoading(true);
      const payload = data;
      if (isEdit) {
        await updateRoom({ id: roomId, ...payload });
      } else {
        await createRoom(payload);
      }
      setShowSuccessDialog(true);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      onSubmit(room);
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="w-[340px] space-y-5">
        {loading ? (
          <LoaderLu />
        ) : (
          <>
            <h2 className="text-lg font-semibold text-foreground">
              {isEdit ? 'Edit Room' : 'Add Room'}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <FormField id="room-name" label="Room Name" error={errors.name}>
                <Input
                  id="room-name"
                  value={room.name}
                  placeholder="Enter room name (Ex: Hall, Kitchen)"
                  onChange={(e) => setRoom((r) => ({ ...r, name: e.target.value }))}
                  className={cn(errors.name && 'border-destructive')}
                />
              </FormField>

              <FormField id="floor" label="Floor" error={errors.floor}>
                <Input
                  id="floor"
                  value={room.floor}
                  placeholder="Enter floor name (Ex: 1, 2)"
                  onChange={(e) => setRoom((r) => ({ ...r, floor: e.target.value }))}
                  className={cn(errors.floor && 'border-destructive')}
                />
              </FormField>

              <FormField id="room-cost" label="Room Cost" error={errors.price}>
                <InputCurrency
                  id="room-cost"
                  symbol="₹"
                  value={room.price}
                  placeholder="Enter Room Cost"
                  onChange={(e) => setRoom((r) => ({ ...r, price: e.target.value }))}
                  className={cn(errors.price && 'border-destructive')}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="secondary" onClick={onClose} type="button">
                  Cancel
                </Button>
                <Button type="submit">{isEdit ? 'Save' : 'Done'}</Button>
              </div>
            </form>

            <AlertDialogLu
              open={showSuccessDialog}
              onOpenChange={setShowSuccessDialog}
              title="Success"
              description={
                isEdit
                  ? 'Room is updated successfully'
                  : 'Room is created successfully'
              }
              cancelLabel="Done"
              showActionButton={false}
              onCancel={onClose}
            />
          </>
        )}
      </div>
    </Modal>
  );
}