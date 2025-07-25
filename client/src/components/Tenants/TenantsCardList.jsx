import React from 'react';
import TenantCard from './TenantCard';

export default function TenantsCardList({ className }) {
    const tenants = [
        {
            id: '1',
            fullName: 'Navneet Panwar',
            photoUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
            room: 'Kitchen',
            floor: '2',
            joinedDate: '2025-05-01',
            documents: {
                aadhar: 'https://example.com/aadhar1.pdf',
                pan: null,
                voter: 'https://example.com/voter1.pdf',
                license: null,
                police: null,
                agreement: 'https://example.com/agreement1.pdf',
            }
        },
        {
            id: '2',
            fullName: 'Prateek Panwar',
            photoUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
            room: 'Hall',
            floor: '1',
            joinedDate: '2024-12-15',
            documents: {
                aadhar: null,
                pan: null,
                voter: null,
                license: null,
                police: null,
                agreement: null,
            }
        },
    ];

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

    return (
        <div className={`${className} space-y-2`}>
            <h2 className="text-lg font-normal text-primary tracking-tight">All Members</h2>
            {tenants.map(tenant => (
                <TenantCard key={tenant.id} tenant={tenant} roomData={roomData} />
            ))}
        </div>
    );
}
