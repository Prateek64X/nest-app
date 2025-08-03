import React from 'react';
import RoomCard from './RoomCard';
import LoaderLu from '../shared/LoaderLu';

export default function RoomsList({ rooms, tenants, loading, error, refreshRooms }) {

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

              return <RoomCard key={room.id} room={room} tenant={tenant} refreshRooms={refreshRooms} />
            })}
          </div>
        </div>
      ))}
    </div>
  );
}