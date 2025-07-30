import React, { useState } from 'react';
import TenantsCardList from '@/components/Tenants/TenantsCardList';
import { MdOutlineAdd } from "react-icons/md";
import { Button } from '@/components/ui/button';
import AddEditTenantModal from '@/components/Tenants/AddEditTenantModal';

export default function Tenants() {
    const [showAddModal, setShowAddModal] = useState(false);

    return (
        <div className="min-h-screen relative pt-12">
            <TenantsCardList />

            {/* Floating Add Button */}
            <Button
                className="fixed bottom-19 right-6 z-30 flex items-center gap-1 px-4 py-2 rounded-full bg-primary shadow-lg"
            >
                <MdOutlineAdd className="w-4 h-4 text-white" />
                <span onClick={() => setShowAddModal(true)} className="text-sm font-medium text-white">Add Tenant</span>
            </Button>

            {showAddModal && <AddEditTenantModal onClose={() => setShowAddModal(false)}/>}
        </div>
    );
}
