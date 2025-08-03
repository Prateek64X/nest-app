import React, { useEffect, useState } from 'react';
import RoomCardList from '@/components/Rooms/RoomCardList';
import AddEditRoomModal from '@/components/Rooms/AddEditRoomModal';
import { Button } from '@/components/ui/button';
import { MdOutlineAdd } from 'react-icons/md';
import { getTenantsByIds } from '@/services/tenantsService';
import { getRooms } from '@/services/roomsService';



export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
    
  async function fetchRooms() {
    try {
      setLoading(true);
      const data = await getRooms();
      setRooms(data);

      const tenantIds = data.map(({tenant_id}) => tenant_id).filter(Boolean);

      if (tenantIds.length > 0) {
        const { tenants } = await getTenantsByIds(tenantIds);
        setTenants(tenants);
      } else {
        setTenants([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen relative pt-6 pb-20 px-4">
      <RoomCardList rooms={rooms} tenants={tenants} loading={loading} error={error} refreshRooms={fetchRooms} />

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