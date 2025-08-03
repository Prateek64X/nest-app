import React from 'react';
import TenantCard from './TenantCard';
import LoaderLu from '../shared/LoaderLu';

export default function TenantsCardList({ tenants, rooms, loading, error, refreshTenants, className }) {
    if (loading) return <LoaderLu />;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className={`${className} space-y-2`}>
            <h2 className="text-lg font-normal text-primary tracking-tight">All Members</h2>
            {tenants.map(tenant => {
                const tenantRooms = rooms.filter((room) => room.tenant_id === tenant.id);

                return <TenantCard key={tenant.id} tenant={tenant} rooms={tenantRooms} refreshTenants={refreshTenants} />
            })}
        </div>
    );
}
