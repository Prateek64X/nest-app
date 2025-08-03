import React, { useEffect, useState } from 'react';
import TenantsCardList from '@/components/Tenants/TenantsCardList';
import { MdOutlineAdd } from "react-icons/md";
import { Button } from '@/components/ui/button';
import AddEditTenantModal from '@/components/Tenants/AddEditTenantModal';
import { getTenants } from '@/services/tenantsService';
import { getRoomsByTenantId } from '@/services/roomsService';

export default function Tenants() {
    const [tenants, setTenants] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);

    async function fetchTenants() {
        try {
            const data = await getTenants();
            setTenants(data.tenants);

            const roomsResults = await Promise.all(
                data.tenants
                .filter((tenant) => tenant && tenant.id)
                .map(async (tenant) => {
                    try {
                        const res = await getRoomsByTenantId(tenant.id);
                        return res || [];
                    } catch (error) {
                        console.warn(`Failed to fetch room for tenant ${tenant.id}:`, error.message);
                        return [];
                    }
                })
            );
            const allRooms = roomsResults.flat();
            setRooms(allRooms);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTenants();
    }, []);
    

    return (
        <div className="min-h-screen relative pt-12">
            <TenantsCardList tenants={tenants} rooms={rooms} loading={loading} error={error} refreshTenants={fetchTenants} />

            {/* Floating Add Button */}
            <Button
                className="fixed bottom-19 right-6 z-30 flex items-center gap-1 px-4 py-2 rounded-full bg-primary shadow-lg"
            >
                <MdOutlineAdd className="w-4 h-4 text-white" />
                <span onClick={() => setShowAddModal(true)} className="text-sm font-medium text-white">Add Tenant</span>
            </Button>

            {showAddModal && 
            <AddEditTenantModal 
                onClose={() => {
                    setShowAddModal(false);
                    fetchTenants();
                }}
            />}
        </div>
    );
}
