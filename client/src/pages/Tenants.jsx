import React, { useState } from 'react';
import TenantsCardList from '@/components/Tenants/TenantsCardList';
import { MdOutlineAdd } from "react-icons/md";
import { Button } from '@/components/ui/button';
import AddEditTenantModal from '@/components/Tenants/AddEditTenantModal';

export default function Tenants() {
    const [showAddModal, setShowAddModal] = useState(false);

    // Dummy Data test
    const roomData = [{
        roomId: '3',
        room: 'Hall',
        floor: '2',
        roomCost: 5000,
        electricityUnits: {
            '01-02-2025': 285,
            '01-01-2025': 175
        }
    }, {
        roomId: '4',
        room: 'Kitchen',
        floor: '2',
        roomCost: 4500,
        electricityUnits: {
            '01-02-2025': 75,
            '01-01-2025': 50
        }
    }];

    return (
        <div className="min-h-screen relative pt-12">
            <TenantsCardList roomData={roomData} />

            {/* Floating Add Button */}
            <Button
                
                className="fixed bottom-19 right-6 z-30 flex items-center gap-1 px-4 py-2 rounded-full bg-primary shadow-lg"
            >
                <MdOutlineAdd className="w-4 h-4 text-white" />
                <span onClick={() => setShowAddModal(true)} className="text-sm font-medium text-white">Add Tenant</span>
            </Button>

            {showAddModal && <AddEditTenantModal onClose={() => setShowAddModal(false)} rooms={roomData}/>}
        </div>
    );
}
