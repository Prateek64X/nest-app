import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { MdDelete, MdEdit } from 'react-icons/md';
import AddEditRoomModal from './AddEditRoomModal';
import { AlertDialog, AlertDialogHeader, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogCancel, AlertDialogFooter, AlertDialogAction } from '../ui/alert-dialog';
import { AlertDialogLu } from '../shared/AlertDialogLu';
import { FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import { deleteRoom } from '@/services/roomsService';

export default function RoomCard({ room, tenant }) {
  const [expanded, setExpanded] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const joinDate = tenant.move_in_date
  ? new Date(tenant.move_in_date).toLocaleDateString()
  : '';

  async function handleDeleteRoom() {
    if (room?.id !== undefined && !isNaN(Number(room?.id))) {
      let deleted = await deleteRoom(room.id);
      if (deleted) {
        setShowSuccessDialog(true);
      }
    }
  }

  return (
    <>
      <Card className="p-4 relative">
        <Accordion type="single" collapsible value={expanded} onValueChange={setExpanded}>
          <AccordionItem value="room-card">
            <AccordionTrigger className="py-0 text-left">
              <div className="w-full text-left">
                <div className="flex justify-between">
                  <span className="font-medium">{room.name}</span>
                  <span className="text-sm">₹{room.price}</span>
                </div>
                <div className="text-sm flex items-center justify-between mt-1 text-muted-foreground">
                  <span>{tenant.full_name}</span>
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${tenant.full_name ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs">{tenant.full_name ? 'Joined' : 'Vecant'} {joinDate}</span>
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-2 pb-0">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" size="sm" className="gap-1" onClick={() => setShowDeleteDialog(true)}>
                  <MdDelete className="w-4 h-4" />
                  Remove
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => setShowEditModal(true)}
                >
                  <MdEdit className="w-4 h-4" />
                  Edit Room
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {showEditModal && (
        <AddEditRoomModal
          isEdit={true}
          initialRoom={room}
          onClose={() => setShowEditModal(false)}
          onSubmit={(updatedRoom) => {
            // Add update logic here (API, state update, etc.)
            console.log('Updated Room:', updatedRoom); //todo show dialog
            setShowEditModal(false);
          }}
        />
      )}

      {/* Delete room alert */}
      <AlertDialogLu
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        icon={tenant?.full_name && <FaExclamationTriangle />}
        title={
          tenant?.full_name
            ? <><FaExclamationTriangle /> Room is Occupied</>
            : "Are you sure?"
        }
        description={
          tenant?.full_name
            ? "This room cannot be deleted because it is currently occupied. Please vacate the tenant first."
            : "This action cannot be undone. This will permanently delete the room and remove its data."
        }
        cancelLabel={tenant?.full_name ? "Close" : "Cancel"}
        actionLabel={"Delete Room"}
        showActionButton={!tenant?.full_name}
        onConfirm={!tenant?.full_name ? handleDeleteRoom : undefined}
      />

      {/* Success Dialog */}
      <AlertDialogLu
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        title={"Success"}
        description={"Room is deleted successfully."}
        cancelLabel={"Close"}
        showActionButton={false}
      />

    </>
  );
}
