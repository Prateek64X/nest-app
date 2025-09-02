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

  // Sort by month descending (newest first)
  const sortedRents = [...roomRents].sort(
    (a, b) => new Date(b.month) - new Date(a.month)
  );

  // Group by month
  const groupedByMonth = sortedRents.reduce((acc, rent) => {
    const monthKey = rent.month.slice(0, 7); // "2025-08"
    acc[monthKey] = acc[monthKey] || [];
    acc[monthKey].push(rent);
    return acc;
  }, {});

  // Sort each month's rents by room.id (asc) then sort by room.floor (desc)
  Object.keys(groupedByMonth).forEach((month) => {
    groupedByMonth[month].sort((a, b) => {
      const floorA = Number(a.room.floor);
      const floorB = Number(b.room.floor);

      if (floorA !== floorB) return floorB - floorA; // Descending floors
      return a.room.id - b.room.id; // Ascending room id
    });
  });

  return (
    <div className={`${className} space-y-2`}>
      <h2 className="text-lg font-semibold text-primary tracking-tight ml-2">Room Rents</h2>
      <div className="space-y-6 mt-1">
        {Object.keys(groupedByMonth).map((month) => (
          <div key={month} className="space-y-2">
            <h2 className="text-muted-foreground font-medium text-sm border-b pb-1 ml-2">
              {new Date(groupedByMonth[month][0].month).toLocaleString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </h2>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {groupedByMonth[month].map((rent, index) => {
                const rowIndex = Math.floor(index / 2);
                const rowKey = `${month}-${rowIndex}`; // unique per month

                const isExpanded =
                  window.innerWidth >= 1024
                    ? expandedRows[rowKey] || false
                    : undefined;

                return (
                  <RentCard
                    key={rent.id}
                    existingRoomRent={rent}
                    refreshRoomRents={refreshRoomRents}
                    forceExpanded={isExpanded}
                    onExpandChange={(val) => {
                      if (window.innerWidth < 1024) return;
                      setExpandedRows((prev) => ({
                        ...prev,
                        [rowKey]: val,
                      }));
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

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
