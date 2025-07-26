import React, { useState, useEffect } from 'react';
import RoomCard from './RoomCard';
import LoaderLu from '../shared/LoaderLu';
import { getRooms } from '@/services/roomsService';
import { getTenantsByIds } from '@/services/tenantsService';

export default function RoomsList() {
  const [rooms, setRooms] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRooms() {
      try {
        const data = await getRooms();
        setRooms(data);

        const tenantIds = data.map(({tenant_id}) => tenant_id).filter(Boolean);

        if (tenantIds.length > 0) {
          const { tenants } = await getTenantsByIds(tenantIds);
          setTenants(tenants);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, []);

  if (loading) return <LoaderLu />;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const groupedByFloor = rooms.reduce((acc, room) => {
    acc[room.floor] = acc[room.floor] || [];
    acc[room.floor].push(room);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Rooms</h1>
      {Object.keys(groupedByFloor).map((floor) => (
        <div key={floor} className="space-y-3">
          <h2 className="text-muted-foreground font-medium text-sm border-b pb-1">
            Floor {floor}
          </h2>
          <div className="space-y-2">
            {groupedByFloor[floor].map((room) => {
              const tenant = tenants.find((t) => t.id === room.tenant_id) || {};

              return <RoomCard key={room.id} room={room} tenant={tenant} />
            })}
          </div>
        </div>
      ))}
    </div>
  );
}