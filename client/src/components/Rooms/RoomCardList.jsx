import React, { useState, useEffect } from 'react';
import RoomCard from './RoomCard';
import LoaderLu from '../shared/LoaderLu';
import { getRooms } from '@/services/roomsService';

export default function RoomsList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRooms() {
      try {
        const data = await getRooms();
        setRooms(data.rooms);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
    console.log("rooms = ", rooms);
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
            {groupedByFloor[floor].map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}