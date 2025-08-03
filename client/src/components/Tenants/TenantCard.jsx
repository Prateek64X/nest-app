import React, { useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddEditTenantModal from './AddEditTenantModal';
import { FaIdCard, FaPassport, FaFileAlt, FaFileSignature, FaFileContract, FaUserEdit, FaExclamationTriangle } from "react-icons/fa";
import { AlertDialogLu } from '../shared/AlertDialogLu';
import { MdDelete } from 'react-icons/md';
import { deleteTenant } from '@/services/tenantsService';

export default function TenantCard({ tenant, rooms, refreshTenants }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <Card className="p-4 relative">
            <Accordion type="single" collapsible value={expanded} onValueChange={setExpanded}>
                <AccordionItem value="tenant-card">
                    <AccordionTrigger className="py-0 text-left">
                        <CollapsedTenant tenant={tenant} rooms={rooms} expanded={expanded} />
                    </AccordionTrigger>

                    <AccordionContent className="pt-2 pb-0">
                        <ExpandedTenant tenant={tenant} rooms={rooms} refreshTenants={refreshTenants} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Card>
    );
}

function CollapsedTenant({ tenant, rooms, expanded }) {
    const joinDate = new Date(tenant.move_in_date).toLocaleDateString();
    return (
        <div className="flex items-start gap-4 w-full">
            {tenant.photo_url && (
                <img
                    className="w-12 h-12 rounded-full object-cover"
                    src={tenant.photo_url}
                    alt="Tenant"
                />
            )}
            <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center">
                    <h2 className="text-base font-medium">{tenant.full_name}</h2>
                    {rooms?.length > 0 && (
                        <span className="text-sm text-muted-foreground">
                            {rooms?.length > 1 
                                ? `${rooms.length} rooms` 
                                : `${rooms[0]?.floor} - ${rooms[0]?.name}`}
                        </span>
                    )}
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                    Joined on {joinDate}
                </span>
            </div>
        </div>
    );
}

function ExpandedTenant({ tenant, rooms, refreshTenants }) {
    const documentsLabelList = [
        { key: 'doc_aadhar', label: 'Aadhar', icon: <FaIdCard /> },
        { key: 'doc_pan', label: 'PAN', icon: <FaIdCard /> },
        { key: 'doc_voter', label: 'Voter ID', icon: <FaIdCard /> },
        { key: 'doc_license', label: 'License', icon: <FaFileSignature /> },
        { key: 'doc_police', label: 'Police Verification', icon: <FaPassport /> },
        { key: 'doc_agreement', label: 'Rent Agreement', icon: <FaFileContract /> },
    ];

    const documents = documentsLabelList
        .filter(({key}) => tenant[key])
        .reduce((acc, { key }) => {
            acc[key] = tenant[key];
            return acc;
        }, {}
    );

    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    async function handleDeleteTenant() {
        if (tenant?.id !== undefined) {
            let res = await deleteTenant(tenant.id);
            if (res.success) {
                setShowSuccessDialog(true);
                refreshTenants();
            }
        }
    }

    return (
        <div className="flex flex-col">
            {/* Right: Full-width document button grid */}
            <span className="text-xs text-muted-foreground mb-2">Documents</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full">
                {documentsLabelList.map(doc => {
                    const isUploaded = documents[doc.key];

                    return (
                        <Button
                            key={doc.key}
                            variant="outline"
                            className={`flex items-center gap-2 justify-start px-3 py-2 text-sm w-full ${
                                !isUploaded ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={!isUploaded}
                            onClick={() => {
                                if (isUploaded) window.open(isUploaded, '_blank');
                            }}
                        >
                            {doc.icon}
                            {doc.label}
                        </Button>
                    );
                })}
            </div>

            {/* Filler to align "Edit Member" properly */}
            <div></div>

            {/* Edit Member Button */}
            <div className="grid grid-cols-2 gap-2 mt-2">
                <Button variant="secondary" size="sm" className="gap-1" onClick={() => setShowDeleteDialog(true)}>
                    <MdDelete className="w-4 h-4" />
                    Remove
                </Button>
                <Button 
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center justify-center gap-2"
                >
                    <FaUserEdit className="w-4 h-4" />
                    Edit Tenant
                </Button>
            </div>

            {showEditModal && (
                <AddEditTenantModal
                    isEdit={true}
                    tenantId={tenant.id}
                    onClose={() => setShowEditModal(false)}
                    onSubmit={() => {
                        refreshTenants();
                    }}
                />
            )}

            {/* Delete tenant alert */}
            <AlertDialogLu
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                icon={tenant?.full_name && <FaExclamationTriangle />}
                title={"Are you sure?"}
                description={
                    "This action cannot be undone. This will permanently delete the tenant and remove its data."
                }
                cancelLabel={"Cancel"}
                actionLabel={"Delete Tenant"}
                showActionButton={true}
                onConfirm={handleDeleteTenant || undefined}
            />
    
            {/* Success Dialog */}
            <AlertDialogLu
                open={showSuccessDialog}
                onOpenChange={setShowSuccessDialog}
                title={"Success"}
                description={"Tenant is deleted successfully."}
                cancelLabel={"Close"}
                showActionButton={false}
            />
        </div>
    );
}
