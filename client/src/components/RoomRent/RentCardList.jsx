import React, { useEffect, useState } from 'react';
import RentCard from './RentCard';
import { getRoomRents, getUpcomingRoomRents } from '@/services/roomRentsService';
import UpcomingRentCard from './UpcomingRentCard';

export default function RentCardList({ className }) {
  const [roomRents, setRoomRents] = useState([]);
  const [upcomingRents, setUpcomingRents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial room rent data
  useEffect(() => {
    async function fetchRoomRents() {
      try {
        const data = await getRoomRents();
        setRoomRents(data);

        const upcoming = await getUpcomingRoomRents();
        setUpcomingRents(upcoming);
      } catch (err) {
        console.error("Failed to fetch room rents:", err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoomRents();
  }, []);

  if (isLoading) {
    return (
      <div className={className}>
        <h2 className='text-lg font-normal text-primary tracking-tight'>Paying Guests</h2>
        <p className="text-sm text-muted-foreground mt-2">Loading room rents...</p>
      </div>
    );
  }

  if (roomRents.length === 0) {
    return (
      <div className={className}>
        <h2 className='text-lg font-normal text-primary tracking-tight'>Paying Guests</h2>
        <p className="text-sm text-muted-foreground mt-2">No room rents found.</p>
      </div>
    );
  }

  return (
    <div className={className + ' space-y-2'}>
      <h2 className='text-lg font-normal text-primary tracking-tight'>Paying Guests</h2>
      {roomRents.map((rent) => (
        <RentCard key={rent.id} existingRoomRent={rent} />
      ))}

      <h2 className='text-lg font-normal text-primary tracking-tight'>Upcoming Next Month</h2>
      {upcomingRents.map((upcoming) => (
        <UpcomingRentCard rent={upcoming} />
      ))}
    </div>
  );
}
