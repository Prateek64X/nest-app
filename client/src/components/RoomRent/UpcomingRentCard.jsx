import React from 'react';
import { Card } from '../ui/card';

export default function UpcomingRentCard({ rent }) {
  const { tenant, rooms, total_cost } = rent;

  return (
    <Card className="p-4 relative bg-secondary">
        <div className="flex items-start gap-4 w-full">
        {/* Tenant Photo */}
        <img
            className="w-12 h-12 rounded-full object-cover"
            src={tenant?.photo_url}
            alt="Tenant"
        />

        {/* Main Info */}
        <div className="flex flex-col flex-1">
            {/* Top Row */}
            <div className="flex justify-between items-center">
            <h2 className="text-base font-medium">{tenant?.full_name}</h2>
            <span className="text-sm text-muted-foreground">
                {rooms[0].floor} - {rooms[0].name}
            </span>
            </div>

            {/* Bottom Row */}
            <div className="flex justify-between items-center mt-1">
            {/* Left: Total Cost */}
            <span className="text-base font-medium text-primary">₹ {total_cost}</span>

            {/* Right: Move-in Date */}
            {tenant?.move_in_date && (
                <span className="text-xs text-muted-foreground">
                Move-in: {new Date(tenant.move_in_date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                })}
                </span>
            )}
            </div>

        </div>
        </div>
    </Card>
  );
}
