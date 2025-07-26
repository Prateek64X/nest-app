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
import AddEditRoomModal from './AddEditRoomModal'; // Ensure correct import path

export default function RoomCard({ room, tenant }) {
  const [expanded, setExpanded] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  
  const joinDate = tenant.move_in_date
  ? new Date(tenant.move_in_date).toLocaleDateString()
  : '';

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
                <Button variant="secondary" size="sm" className="gap-1">
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
            console.log('Updated Room:', updatedRoom);
            setShowEditModal(false);
          }}
        />
      )}
    </>
  );
}
