import React, { useState } from 'react';
import RoomCard from './RoomCard';
import LoaderLu from '../shared/LoaderLu';

export default function RoomsList({ rooms, tenants, loading, error, refreshRooms }) {
  const [expandedRows, setExpandedRows] = useState({}); 

  const handleCardExpand = (floor, index, isExpanded) => {
    if (window.innerWidth < 1024) return;

    const rowIndex = Math.floor(index / 2); // 2 cards per row
    setExpandedRows((prev) => ({
      ...prev,
      [floor]: {
        ...(prev[floor] || {}),
        [rowIndex]: isExpanded,
      },
    }));
  };

  if (loading) return <LoaderLu />;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  // Group rooms by floor
  const groupedByFloor = rooms.reduce((acc, room) => {
    acc[room.floor] = acc[room.floor] || [];
    acc[room.floor].push(room);
    return acc;
  }, {});

  return (
    <>
      <h2 className="text-lg font-semibold text-primary tracking-tight ml-2">Rooms</h2>
      <div className="space-y-6 mt-1">
        {Object.keys(groupedByFloor).map((floor) => (
          <div key={floor} className="space-y-2">
            <h2 className="text-muted-foreground font-medium text-sm border-b pb-1 ml-2">
              Floor {floor}
            </h2>

            {/* Responsive grid for cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {groupedByFloor[floor].map((room, index) => {
                const rowIndex = Math.floor(index / 2);
                const isExpanded =
                  window.innerWidth >= 1024
                    ? expandedRows[floor]?.[rowIndex] || false
                    : undefined;

                const tenant = tenants.find((t) => t.id === room.tenant_id) || {};
                return (
                  <RoomCard
                    key={room.id}
                    room={room}
                    tenant={tenant}
                    refreshRooms={refreshRooms}
                    forceExpanded={isExpanded}
                    onExpandChange={(val) =>
                      handleCardExpand(floor, index, val)
                    }
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
