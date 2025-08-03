import React, { useEffect, useState } from 'react';
import DateView from '@/components/DateView';
import RentCard from '@/components/RoomRent/RentCard';
import RentCardList from '@/components/RoomRent/RentCardList';
import { getRoomRents, getUpcomingRoomRents } from '@/services/roomRentsService';

const Home = () => {
    const [roomRents, setRoomRents] = useState([]);
    const [upcomingRents, setUpcomingRents] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchRoomRents() {
        try {
            const data = await getRoomRents();
            setRoomRents(data);

            const upcoming = await getUpcomingRoomRents();
            setUpcomingRents(upcoming);
        } catch (err) {
            console.error("Failed to fetch room rents:", err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRoomRents();
    }, []);

    return (
        <div className='min-h-screen relative pt-12'>
            <DateView className='absolute top-4 left-6'/>
            <RentCardList roomRents={roomRents} upcomingRents={upcomingRents} refreshRoomRents={fetchRoomRents} loading={loading} className='mt-[15vh]'/>
        </div>
    );
};

export default Home;