import React from 'react';
import RentCard from './RentCard';

export default function RentCardList({className}) {
    // mock data
    const rentData = [{
        tenantId: '1',
        fullName: 'Navneet Panwar',
        photoUrl: 'https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000',
        roomId: '3',
        room: 'Kitchen',
        floor: '2',
        month: '2025-07',
        roomCost: 4500,
        electricityCost: 350,
        maintenanceCost: 200,
        totalCost: 5050,
        paidCost: 5050
    }, {
        tenantId: '2',
        fullName: 'Prateek Panwar',
        photoUrl: 'https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000',
        roomId: '4',
        room: 'Hall',
        floor: '2',
        month: '2025-07',
        roomCost: 5000,
        electricityCost: 600,
        maintenanceCost: 200,
        totalCost: 5800,
        paidCost: 2600
    }];

    const roomData = [
    {
        roomId: '1',
        room: 'Kitchen',
        floor: '1',
        roomCost: 4500,
        electricityUnits: {
            '01-02-2025': 285,
            '01-01-2025': 175
        }
    }, {
        roomId: '2',
        room: 'Hall',
        floor: '1',
        roomCost: 5000,
        electricityUnits: {
            '01-05-2025': 438,
            '01-04-2025': 356
        }
    }, {
        roomId: '3',
        room: 'Kitchen',
        floor: '2',
        roomCost: 4500,
        electricityUnits: {
            '01-05-2025': 285,
            '01-04-2025': 175
        }
    }, {
        roomId: '4',
        room: 'Hall',
        floor: '2',
        roomCost: 5000,
        electricityUnits: {
            '01-05-2025': 75,
            '01-04-2025': 50
        }
    }];

    return(
        <div className={className + ' space-y-2'}>
            <h2 className='text-lg font-normal text-primary tracking-tight'>Paying Guests</h2>
            {rentData.map(rent => {
            const room = roomData.find(r => r.roomId === rent.roomId);
                
            return <RentCard rentData={rent} roomData={room} />;
            })}
        </div>
    );
}