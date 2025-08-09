import React, { useState, useCallback } from 'react';
import RentCard from './RentCard';
import UpcomingRentCard from './UpcomingRentCard';
import LoaderLu from '../shared/LoaderLu';
import { Separator } from '../ui/separator';

export default function RentCardList({
  roomRents,
  upcomingRents,
  refreshRoomRents,
  loading,
  className,
}) {
  const [expandedRows, setExpandedRows] = useState({});

  const handleCardExpand = useCallback((index, isExpanded) => {
    if (window.innerWidth < 1024) return; // Only sync on desktop

    const rowIndex = Math.floor(index / 2);
    setExpandedRows((prev) => ({
      ...prev,
      [rowIndex]: isExpanded,
    }));
  }, []);

  if (loading) {
    return (
      <div className={className}>
        <h2 className="text-lg font-semibold text-primary tracking-tight">Room Rents</h2>
        <LoaderLu />
      </div>
    );
  }

  if (roomRents.length === 0) {
    return (
      <div className={className}>
        <h2 className="text-lg font-semibold text-primary tracking-tight ml-2">Room Rents</h2>
        <p className="text-sm text-muted-foreground mt-2 ml-2">No room rents found.</p>
      </div>
    );
  }

  return (
    <div className={`${className} space-y-2`}>
      <h2 className="text-lg font-semibold text-primary tracking-tight ml-2">Room Rents</h2>
      <div className="grid gap-2 lg:grid-cols-2">
        {roomRents.map((rent, index) => {
          const rowIndex = Math.floor(index / 2);
          const isExpanded = window.innerWidth >= 1024 ? expandedRows[rowIndex] || false : undefined;

          return (
            <RentCard
              key={rent.id}
              existingRoomRent={rent}
              refreshRoomRents={refreshRoomRents}
              forceExpanded={isExpanded}
              onExpandChange={(val) => handleCardExpand(index, val)}
            />
          );
        })}
      </div>

      <Separator className="my-4" />

      {upcomingRents?.length > 0 && (
        <h2 className="text-lg font-semibold text-primary tracking-tight ml-2">
          Upcoming Next Month
        </h2>
      )}
      <div className="grid gap-2 lg:grid-cols-2">
        {upcomingRents.map((upcoming) => (
          <UpcomingRentCard rent={upcoming} key={upcoming.id} />
        ))}
      </div>
    </div>
  );
}
