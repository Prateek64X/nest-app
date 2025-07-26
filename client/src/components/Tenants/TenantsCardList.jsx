import React, { useEffect, useState } from 'react';
import TenantCard from './TenantCard';
import { getTenants } from '@/services/tenantsService';
import { getRoomsByTenantId } from '@/services/roomsService';

export default function TenantsCardList({ className }) {
    const [tenants, setTenants] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
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

    fetchTenants();
    }, []);


    return (
        <div className={`${className} space-y-2`}>
            <h2 className="text-lg font-normal text-primary tracking-tight">All Members</h2>
            {tenants.map(tenant => {
                const tenantRooms = rooms.filter((room) => room.tenant_id === tenant.id);

                return <TenantCard key={tenant.id} tenant={tenant} rooms={tenantRooms} />
            })}
        </div>
    );
}
