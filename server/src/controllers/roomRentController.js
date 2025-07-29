import prisma from '../db/prisma.js';
import { startOfMonth } from 'date-fns';

// For Auto run every month via cron job
export const createRoomRentEntries = async (req = null, res = null) => {
    try {
        // 1. Fetch all rooms which have tenants
        const occupiedRooms = await prisma.rooms.findMany({
            where: { occupied: true, tenant_id: {not: null} },
            select: { id: true, tenant_id: true, price: true },
        });

        // 2. Iterate each room and extract room_cost and room_id, tenant_id
        for (let room of occupiedRooms) {
            let roomId = room.id;
            let tenantId = room.tenant_id;
            let roomPrice = Number(room.price);

            let count = 0;
            console.log("Count: ",count,"Room = ",room);
            if (roomId === null || tenantId === null || roomPrice === null) {
                continue;
            }

            // Check for already exists
            const alreadyExists = await prisma.room_rents.findFirst({
                where: { room_id: roomId, tenant_id: tenantId, billing_month: startOfMonth(new Date()) }
            });
            if (alreadyExists) continue;

            // Fetch previous month's rent by room id and tenant id
            const prevRoomRent = await prisma.room_rents.findFirst({
                where: { room_id: roomId, tenant_id: tenantId },
                select: { electricity_units: true, maintenance_cost: true },
                orderBy: { created_at: 'desc' },
            });

            // Fetch latest maintainance cost for else case
            let maintenanceCost = prevRoomRent?.maintenance_cost || null;
            if (maintenanceCost === null) {
                const prevAnyRoomRent = await prisma.room_rents.findFirst({
                    where: { maintenance_cost: { not: null } },
                    select: { maintenance_cost: true },
                    orderBy: { created_at: 'desc' },
                });
                maintenanceCost = prevAnyRoomRent?.maintenance_cost ?? 0;
            }
            
            // end. Set values to db
            await prisma.room_rents.create({
                data: {
                    room_id: roomId,
                    tenant_id: tenantId,
                    billing_month: startOfMonth(new Date()),
                    room_cost: roomPrice,
                    electricity_cost: 0,
                    electricity_units: prevRoomRent?.electricity_units ?? 0,
                    maintenance_cost: maintenanceCost,
                    paid_amount: 0,
                    payment_status: 'unpaid',
                }
            });
        }
        console.log({ message: "Room rent entries created successfully" });
    } catch (err) {
        console.log({ error: 'Create Room Entries Error', message: err.message });
    }
}

