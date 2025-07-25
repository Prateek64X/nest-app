import React, { useState } from 'react';
import RoomCardList from '@/components/Rooms/RoomCardList';
import AddEditRoomModal from '@/components/Rooms/AddEditRoomModal';
import { Button } from '@/components/ui/button';
import { MdOutlineAdd } from 'react-icons/md';



export default function Rooms() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen relative pt-6 pb-20 px-4">
      <RoomCardList />

      <Button
        className="fixed bottom-19 right-6 z-30 flex items-center gap-1 px-4 py-2 rounded-full bg-primary shadow-lg"
        onClick={() => setShowModal(true)}
      >
        <MdOutlineAdd className="w-4 h-4 text-white" />
        Add Room
      </Button>

      {showModal && (
        <AddEditRoomModal
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}