import React, { useState, useEffect } from "react";
import TenantCard from "./TenantCard";
import LoaderLu from "../shared/LoaderLu";

export default function TenantsCardList({
  tenants,
  rooms,
  loading,
  error,
  refreshTenants,
  className,
}) {
  const [expandedRowIndex, setExpandedRowIndex] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect desktop vs mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024); // Tailwind's lg breakpoint
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (loading) return <LoaderLu />;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const handleExpand = (tenantIndex, isExpanded) => {
    if (isDesktop) {
      if (isExpanded) {
        const rowIndex = Math.floor(tenantIndex / 2); // 2 cols on desktop
        setExpandedRowIndex(rowIndex);
      } else {
        setExpandedRowIndex(null);
      }
    }
  };

  return (
    <div className={`${className} space-y-2`}>
      <h2 className="text-lg font-semibold text-primary tracking-tight ml-2">
        All Members
      </h2>

      <div className="grid gap-2 lg:grid-cols-2">
        {tenants.map((tenant, idx) => {
          const tenantRooms = rooms.filter(
            (room) => room.tenant_id === tenant.id
          );

          // On desktop, expand all cards in same row; on mobile, only per-card
          const rowIndex = Math.floor(idx / 2);
          const isExpanded = isDesktop
            ? expandedRowIndex === rowIndex
            : undefined;

          return (
            <TenantCard
              key={tenant.id}
              tenant={tenant}
              rooms={tenantRooms}
              refreshTenants={refreshTenants}
              expanded={isExpanded}
              onExpand={(val) => handleExpand(idx, val)}
            />
          );
        })}
      </div>
    </div>
  );
}
