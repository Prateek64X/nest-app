import React from 'react';
import DateView from '@/components/DateView';
import RentCard from '@/components/RoomRent/RentCard';
import RentCardList from '@/components/RoomRent/RentCardList';

const Home = () => {
    return (
        <div className='min-h-screen relative pt-12'>
            <DateView className='absolute top-4 left-6'/>
            <RentCardList className='mt-[15vh]'/>
        </div>
    );
};

export default Home;