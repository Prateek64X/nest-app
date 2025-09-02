import { addDays, format, startOfMonth, subMonths } from 'date-fns';
import prisma from '../db/prisma.js';
import { getBillingMonthStart, getISTMonthEndDate, getISTMonthStartDate, getMonthEndDateString, getMonthStartDateString } from '../utils/DateHelper.js';

let billingMonth = getBillingMonthStart(new Date());

// For Auto run every month via cron job
export const createRoomRentEntries = async (req = null, res = null) => {
  let createdCount = 0;

  try {
    const occupiedRooms = await prisma.rooms.findMany({
      where: { occupied: true, tenant_id: { not: null } },
      select: { id: true, tenant_id: true, admin_id: true, price: true },
    });

    for (let room of occupiedRooms) {
      const { id: roomId, tenant_id: tenantId, admin_id: adminId, price } = room;
      const roomPrice = Number(price);

      if (!roomId || !tenantId || !roomPrice) continue;

      const alreadyExists = await prisma.room_rents.findFirst({
        where: { room_id: roomId, tenant_id: tenantId, billing_month: billingMonth },
      });
      if (alreadyExists) continue;

      const prevRoomRent = await prisma.room_rents.findFirst({
        where: { room_id: roomId, tenant_id: tenantId },
        select: { electricity_units: true, maintenance_cost: true },
        orderBy: { created_at: "desc" },
      });

      let electricityUnits = prevRoomRent?.electricity_units || 0;
      let maintenanceCost = prevRoomRent?.maintenance_cost;

      if (maintenanceCost === null || maintenanceCost === undefined) {
        const prevAnyRoomRent = await prisma.room_rents.findFirst({
          where: { maintenance_cost: { not: null }, admin_id: adminId },
          select: { maintenance_cost: true },
          orderBy: { created_at: "desc" },
        });
        maintenanceCost = prevAnyRoomRent?.maintenance_cost ?? 0;
      }

      await prisma.room_rents.create({
        data: {
          room_id: roomId,
          tenant_id: tenantId,
          admin_id: adminId,
          billing_month: billingMonth,
          room_cost: roomPrice,
          electricity_cost: 0,
          electricity_units: electricityUnits,
          maintenance_cost: maintenanceCost,
          paid_amount: 0,
          payment_status: "unpaid",
        },
      });

      createdCount++;
    }

    const result = {
      success: true,
      message:
        createdCount === 0
          ? "No new rent entries were needed."
          : `Successfully created ${createdCount} rent entr${createdCount > 1 ? "ies" : "y"}.`,
    };

    if (res) return res.status(200).json(result);
    else return result;

  } catch (err) {
    const errorResult = {
      success: false,
      error: "Create Room Entries Error",
      message: err.message || "Unknown error while creating rent entries",
    };

    if (res) return res.status(500).json(errorResult);
    else return errorResult;
  }
};

export const getRoomRents = async (req, res) => {
  const { id: admin_id } = req.admin;

  try {
    const billingStart = getBillingMonthStart(new Date());  
    const prevBillingStart = getBillingMonthStart(subMonths(new Date(), 1)); // previous month start

    // 1. Fetch all occupied rooms with tenant assigned
    const occupiedRooms = await prisma.rooms.findMany({
      where: { admin_id, occupied: true, tenant_id: { not: null } },
      select: { id: true },
    });
    const roomIds = occupiedRooms.map(r => r.id);

    if (roomIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // 2. Fetch all rents for current month
    const currentMonthRents = await prisma.room_rents.findMany({
      where: {
        room_id: { in: roomIds },
        billing_month: billingStart, // Date object
      },
      include: {
        tenants: { select: { full_name: true, photo_url: true } },
        rooms: { select: { name: true, floor: true } },
      },
    });

    // 3. Check if any previous month rents are unpaid
    let prevMonthRents = [];
    const prevMonthUnpaid = await prisma.room_rents.findFirst({
      where: {
        room_id: { in: roomIds },
        billing_month: prevBillingStart,
        payment_status: { not: 'paid' },
      },
    });

    // 4. Fetch all previous month rents if any unpaid
    if (prevMonthUnpaid) {
      prevMonthRents = await prisma.room_rents.findMany({
        where: {
          room_id: { in: roomIds },
          billing_month: prevBillingStart,
        },
        include: {
          tenants: { select: { full_name: true, photo_url: true } },
          rooms: { select: { name: true, floor: true } },
        },
      });
    }

    // 5. Combine both months
    const allRents = [...currentMonthRents, ...prevMonthRents];

    // 6. Map to response format
    const data = await Promise.all(
      allRents.map(async (rent) => {
        // optional: fetch previous rent's electricity units
        const prevRent = await prisma.room_rents.findFirst({
          where: {
            room_id: rent.room_id,
            billing_month: { lt: rent.billing_month },
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
          month: rent.billing_month,
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

export const getUpcomingRoomRents = async (req, res) => {
  const { id: admin_id } = req.admin;

  try {
    const monthStart = getISTMonthStartDate();
    const monthEnd = getISTMonthEndDate();

    // 1. Get tenants who moved in this month and have no rent entry yet
    const tenants = await prisma.tenants.findMany({
      where: {
        admin_id,
        move_in_date: {
          gte: monthStart.toISOString(),
          lte: monthEnd.toISOString(),
        },
        room_rents: {
          none: {},
        },
      },
      select: {
        id: true,
        full_name: true,
        photo_url: true,
        rooms: {
          select: {
            id: true,
            tenant_id: true,
            name: true,
            floor: true,
            price: true,
          },
        },
      },
    });

    // 2. Format results
    const data = tenants.map((tenant) => {
      return {
        tenant: {
          id: tenant.id,
          full_name: tenant.full_name,
          photo_url: tenant.photo_url,
        },
        rooms: tenant.rooms.map((room) => ({
          tenant_id: room.tenant_id,
          name: room.name,
          floor: room.floor,
          total_cost: room.price,
        })),
        total_cost: tenant.rooms.reduce(
          (acc, room) => acc + parseFloat(room.price),
          0
        ),
      };
    });

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("getUpcomingRoomRents error:", err);
    res.status(500).json({ error: err.message || err, message: "Internal server error" });
  }
};

// Pass Tenant Id to get latest room rent
export const getRoomRentsByTenant = async (req, res) => {
  const tenant_id = req.tenant?.id || req.tenant_id;

  if (!tenant_id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const billingStart = getBillingMonthStart(new Date());  
    const prevBillingStart = getBillingMonthStart(subMonths(new Date(), 1)); // previous month start

    // Fetch this month's rents + previous month's unpaid rents
    const roomRents = await prisma.room_rents.findMany({
      where: {
        tenant_id,
        OR: [
          { billing_month: { gte: prevBillingStart }, payment_status: { not: "paid" } }, // prev month unpaid
          { billing_month: { gte: billingStart } } // this month, regardless of payment
        ]
      },
      orderBy: { billing_month: "desc" }, // newest month first
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
        billing_month: true,
        tenants: { select: { full_name: true, photo_url: true } },
        rooms: { select: { name: true, floor: true } },
      },
    });
    
    // Map each rent and optionally get previous month's electricity usage
    const data = await Promise.all(
      roomRents.map(async (rent) => {
        const prevRent = await prisma.room_rents.findFirst({
          where: {
            tenant_id,
            billing_month: { lt: rent.billing_month },
          },
          select: { electricity_units: true },
          orderBy: { billing_month: "desc" },
        });

        return {
          id: rent.id,
          tenant: {
            id: rent.tenant_id,
            fullName: rent.tenants?.full_name || "",
            photoUrl: rent.tenants?.photo_url || "",
          },
          room: {
            id: rent.room_id,
            name: rent.rooms?.name || "",
            floor: rent.rooms?.floor || "",
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

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("getRoomRentsByTenant error:", err);
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