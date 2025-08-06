import React from 'react';
import RentCard from './RentCard';
import UpcomingRentCard from './UpcomingRentCard';
import LoaderLu from '../shared/LoaderLu';

export default function RentCardList({ roomRents, upcomingRents, refreshRoomRents, loading, className }) {

  if (loading) {
    return (
      <div className={className}>
        <h2 className='text-lg font-semibold text-primary tracking-tight'>Room Rents</h2>
        <LoaderLu />
      </div>
    );
  }

  if (roomRents.length === 0) {
    return (
      <div className={className + ''}>
        <h2 className="text-lg font-semibold text-primary tracking-tight ml-2">Room Rents</h2>
        <p className="text-sm text-muted-foreground mt-2 ml-2">No room rents found.</p>
      </div>
    );
  }

  return (
    <div className={className + ' space-y-2'}>
      <h2 className='text-lg font-semibold text-primary tracking-tight ml-2'>Room Rents</h2>
      {roomRents.map((rent) => (
        <RentCard key={rent.id} existingRoomRent={rent} refreshRoomRents={refreshRoomRents} />
      ))}

      {upcomingRents?.length > 0 && (
        <h2 className='mt-6 text-lg font-semibold text-primary tracking-tight ml-2'>Upcoming Next Month</h2>
      )}
      {upcomingRents.map((upcoming) => (
        <UpcomingRentCard rent={upcoming} />
      ))}
    </div>
  );
}
