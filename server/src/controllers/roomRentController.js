import prisma from '../db/prisma.js';
import { addDays, startOfMonth, isSameMonth } from 'date-fns';

let billingMonth = addDays(startOfMonth(new Date()), 1);

// For Auto run every month via cron job
export const createRoomRentEntries = async (req = null, res = null) => {
    
    try {
        // 1. Fetch all rooms which have tenants
        const occupiedRooms = await prisma.rooms.findMany({
            where: { occupied: true, tenant_id: {not: null} },
            select: { id: true, tenant_id: true, admin_id: true, price: true },
        });

        // 2. Iterate each room and extract room_cost and room_id, tenant_id
        for (let room of occupiedRooms) {
            let roomId = room.id;
            let tenantId = room.tenant_id;
            let adminId = room.admin_id;
            let roomPrice = Number(room.price);

            let count = 0;
            if (roomId === null || tenantId === null || roomPrice === null) {
                continue;
            }

            // Check for already exists
            const alreadyExists = await prisma.room_rents.findFirst({
                where: { room_id: roomId, tenant_id: tenantId, billing_month: billingMonth }
            });
            if (alreadyExists) continue;

            // Fetch previous month's rent by room id and tenant id
            const prevRoomRent = await prisma.room_rents.findFirst({
                where: { room_id: roomId, tenant_id: tenantId },
                select: { electricity_units: true, maintenance_cost: true },
                orderBy: { created_at: 'desc' },
            });

            // Fetch latest maintainance cost for else case
            let electricityUnits = prevRoomRent?.electricity_cost || null;
            let maintenanceCost = prevRoomRent?.maintenance_cost || null;
            if (maintenanceCost === null) {
                const prevAnyRoomRent = await prisma.room_rents.findFirst({
                    where: { maintenance_cost: { not: null }, admin_id: adminId },
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
                    admin_id: adminId,
                    billing_month: billingMonth,
                    room_cost: roomPrice,
                    electricity_cost: 0,
                    electricity_units: electricityUnits || 0,
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

export const getRoomRents = async (req, res) => {
  const { id: admin_id } = req.admin;

  try {
    // 1. Fetch all occupied rooms with tenant assigned
    const occupiedRooms = await prisma.rooms.findMany({
      where: { admin_id, occupied: true, tenant_id: { not: null } },
      select: { id: true }
    });

    const roomIds = occupiedRooms.map(r => r.id);
    if (roomIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // 2. Fetch all room rents for this month along with related room & tenant info
    const rents = await prisma.room_rents.findMany({
      where: {
        room_id: { in: roomIds },
        billing_month: billingMonth,
      },
      select: {
        id: true,
        room_id: true,
        tenant_id: true,
        room_cost: true,
        electricity_cost: true,
        electricity_units: true,
        maintenance_cost: true,
        total_cost: true,
        paid_amount: true,
        payment_status: true,
        created_at: true,
        tenants: {
          select: {
            full_name: true,
            photo_url: true,
          }
        },
        rooms: {
          select: {
            name: true,
            floor: true,
          }
        }
      }
    });

    
    const data = await Promise.all(
      rents.map(async (rent) => {
        const prevRent = await prisma.room_rents.findFirst({
          where: {
            room_id: rent.room_id,
            billing_month: { lt: billingMonth },
          },
          select: { electricity_units: true },
          orderBy: { billing_month: 'desc' },
        });

        return {
          id: rent.id,
          tenant: {
            id: rent.tenant_id,
            fullName: rent.tenants?.full_name || '',
            photoUrl: rent.tenants?.photo_url || '',
          },
          room: {
            id: rent.room_id,
            name: rent.rooms?.name || '',
            floor: rent.rooms?.floor || '',
          },
          month: rent.created_at.toISOString().slice(0, 7),
          roomCost: rent.room_cost,
          electricityCost: rent.electricity_cost,
          electricityUnits: rent.electricity_units,
          prevElectricityUnits: prevRent?.electricity_units ?? 0,
          maintenanceCost: rent.maintenance_cost,
          totalCost: rent.total_cost,
          paidAmount: rent.paid_amount,
          paymentStatus: rent.payment_status,
        };
      })
    );

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("getRoomRents error:", err);
    res.status(500).json({ error: err.message || err, message: "Internal server error" });
  }
};

export const updateRoomRent = async (req, res) => {
  const { id: admin_id } = req.admin;
  const { id } = req.params;
  const { 
    roomId, 
    roomCost, 
    electricityCost, 
    electricityUnits, 
    maintenanceCost, 
    paidAmount
  } = req.body;

  console.log("Update room rent, data = ",{roomId, roomCost, electricityCost, 
    electricityUnits, maintenanceCost, paidAmount});

  if (!id || !roomId || isNaN(Number(roomId))) {
    return res.status(400).json({ error: "Invalid ID or roomId", id, roomId });
  } 

  const getPaymentStatus = (totalCost, paidAmount) => {
    const total = Number(totalCost) || 0;
    const paid = Number(paidAmount) || 0;

    if (paid === 0) {
      return 'unpaid';
    } else if (paid < total) {
      return 'partial';
    } else if (paid >= total) {
      return 'paid';
    }

    return 'unknown';
  };


  try {
    // Check if room_rent exists and belongs to the same admin
    const existing = await prisma.room_rents.findFirst({
      where: {
        id,
        rooms: {
          admin_id: admin_id,
        }
      },
      select: { total_cost: true },
    });

    if (!existing) {
      return res.status(404).json({ error: "Room rent not found or unauthorized" });
    }

    // 1. Update the room rent
    await prisma.room_rents.update({
      where: { id },
      data: {
        room_cost: Number(roomCost),
        electricity_cost: Number(electricityCost),
        electricity_units: Number(electricityUnits),
        maintenance_cost: Number(maintenanceCost),
        paid_amount: Number(paidAmount),
        payment_status: getPaymentStatus(Number(existing?.total_cost), Number(paidAmount))
      }
    });

    // 2. Update room price (optional but based on your logic)
    await prisma.rooms.update({
      where: { id: Number(roomId) },
      data: {
        price: Number(roomCost),
      }
    });

    return res.status(200).json({ success: true, message: "Room rent updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message || err, message: "Internal server error" });
  }
};