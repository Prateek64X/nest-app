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
import { FaIdCard, FaPassport, FaFileAlt, FaFileSignature, FaFileContract, FaUserEdit } from "react-icons/fa";

export default function TenantCard({ tenant, roomData }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <Card className="p-4 relative">
            <Accordion type="single" collapsible value={expanded} onValueChange={setExpanded}>
                <AccordionItem value="tenant-card">
                    <AccordionTrigger className="py-0 text-left">
                        <CollapsedTenant tenant={tenant} expanded={expanded} />
                    </AccordionTrigger>

                    <AccordionContent className="pt-2 pb-0">
                        <ExpandedTenant tenant={tenant} roomData={roomData} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Card>
    );
}

function CollapsedTenant({ tenant, expanded }) {
    return (
        <div className="flex items-start gap-4 w-full">
            <img
                className="w-12 h-12 rounded-full object-cover"
                src={tenant.photoUrl}
                alt="Tenant"
            />
            <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center">
                    <h2 className="text-base font-medium">{tenant.fullName}</h2>
                    <span className="text-sm text-muted-foreground">{tenant.floor} - {tenant.room}</span>
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                    Joined on {tenant.joinedDate}
                </span>
            </div>
        </div>
    );
}

function ExpandedTenant({ tenant, roomData }) {
    const documentsLabelList = [
        { key: "aadhar", label: "Aadhar", icon: <FaIdCard /> },
        { key: "pan", label: "PAN", icon: <FaIdCard /> },
        { key: "voter", label: "Voter ID", icon: <FaIdCard /> },
        { key: "license", label: "License", icon: <FaFileSignature /> },
        { key: "police", label: "Police Verification", icon: <FaPassport /> },
        { key: "agreement", label: "Rent Agreement", icon: <FaFileContract /> },
    ];

    const documents = tenant.documents || {};

    const [showEditModal, setShowEditModal] = useState(false);

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
            <Button 
                onClick={() => setShowEditModal(true)}
                className="mt-2 w-full col-span-full flex items-center justify-center gap-2"
            >
                <FaUserEdit className="w-4 h-4" />
                Edit Member
            </Button>

            {showEditModal && (
                <AddEditTenantModal
                    isEdit={true}
                    onClose={() => setShowEditModal(false)}
                    onSubmit={(data) => console.log(data)}
                    rooms={[
                        { id: '101', name: 'Room 101', floor: '1st' },
                        { id: '201', name: 'Room 201', floor: '2nd' },
                    ]}
                />
            )}
        </div>
    );
}
