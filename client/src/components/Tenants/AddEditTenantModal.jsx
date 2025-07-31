import React, { useEffect, useState } from 'react';
import Modal from '@/components/shared/Modal';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import MultiSelect from '@/components/shared/MultiSelect';

import { format } from 'date-fns';
import { FaUpload } from 'react-icons/fa';
import InputCurrency from '../shared/InputCurrency';
import PhoneInputLu from '../shared/PhoneInputLu';
import { getAvailableRooms, getRooms, getRoomsByTenantId } from '@/services/roomsService';
import AddEditDocumentsModal from './AddEditDocumentsModal';
import { createTenant, getTenantById, TENANT_DOC_KEY_MAP, TENANT_DOC_KEY_MAP_REVERSE, updateTenant } from '@/services/tenantsService';
import ProfileImageInput from '../shared/ProfileImageInput';
import { AlertDialogLu } from '../shared/AlertDialogLu';
import * as z from "zod";
import { cn } from '@/lib/utils';

const tenantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .preprocess((val) => {
      // Remove non-digit characters and take last 10 digits
      const digits = String(val).replace(/\D/g, '');
      return digits.slice(-10); // Get last 10 digits
    }, z
      .string()
      .refine((val) => /^\d{10}$/.test(val), {
        message: "Phone must be a 10-digit number",
      })
    ),
  joinDate: z.date({
    required_error: "Join date is required",
  }),
  selectedRooms: z.array(z.number()).min(1, "Select at least one room"),
});


export default function AddEditTenantModal({
    isEdit = false,
    tenantId,
    onClose,
    onSubmit,
}) {
    const [tenantData, setTenantData] = useState({
        name: '',
        phone: '',
        joinDate: new Date(),
        photo: null,
    });
    const [tenantDocuments, setTenantDocuments] = useState({
        docAadhar: { file: null, url: '' },
        docPan: { file: null, url: '' },
        docVoter: { file: null, url: '' },
        docLicense: { file: null, url: '' },
        docPolice: { file: null, url: '' },
        docAgreement: { file: null, url: '' },
    });

    const documentsCount = Object.values(tenantDocuments).filter(
        (doc) => doc && (doc.file || doc.url)
    ).length;

    const [rooms, setRooms] = useState([]);
    
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [selectedRoomPrices, setSelectedRoomPrices] = useState({});

    const [showDocumentsModal, setShowDocumentsModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        // Edit Mode: Fetch existing tenant data on start
        async function fetchTenant() {
            try {
                if (isEdit && tenantId) {
                    const tenant = await getTenantById(tenantId);

                    if (tenant && tenant.id) {
                        setTenantData((prev) => ({
                            ...prev, 
                            name: tenant.full_name, 
                            phone: tenant.phone, 
                            joinDate: new Date(tenant.move_in_date), 
                            photo: tenant.photo_url
                        }));

                        // Set documents from tenants
                        const updatedDocuments = Object.fromEntries(
                            Object.entries(tenant)
                                .filter(([key]) => TENANT_DOC_KEY_MAP_REVERSE[key])
                                .map(([key, value]) => [
                                TENANT_DOC_KEY_MAP_REVERSE[key],
                                { file: null, url: value || '' },
                            ])
                        );

                        setTenantDocuments((prev) => ({...prev, ...updatedDocuments}));

                        // Fetch selected rooms data
                        const tenantRooms = await getRoomsByTenantId(tenant.id);
                        setSelectedRooms(tenantRooms.filter((r) => r.tenant_id).map((r) => r.id));
                    }
                }
            } catch (err) {
                console.error("Fetch tenant failed:", err.message || err);
            }
        }
        fetchTenant();


        getRooms()
        .then(setRooms)
        .catch ((err) => {
            console.error(err.message || "Could not fetched available rooms");
        });
    }, []);

    useEffect(() => {
        setSelectedRoomPrices((prevPrices) => {
            const updated = { ...prevPrices };
            selectedRooms.forEach((roomId) => {
                if (!updated[roomId]) {
                    const room = rooms.find((r) => r.id === roomId);
                    if (room) updated[roomId] = room.price || '';
                }
            });
            return updated;
        });
    }, [selectedRooms, rooms]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const validationResult = tenantSchema.safeParse({
            name: tenantData.name?.trim(),
            phone: tenantData.phone,
            joinDate: tenantData.joinDate,
            selectedRooms,
        });

        if (!validationResult.success) {
            const errors = {};
            validationResult.error.issues.forEach((issue) => {
            errors[issue.path[0]] = issue.message;
            });
            setFormErrors(errors);
            return;
        }

        try {
            const formData = new FormData();

            formData.append('full_name', tenantData.name);
            formData.append('phone', tenantData.phone);
            formData.append('move_in_date', tenantData.joinDate?.toISOString());
            formData.append('photo', tenantData.photo);

            formData.append(
                'rooms',
                JSON.stringify(
                selectedRooms.map((roomId) => ({
                    id: roomId,
                    price: selectedRoomPrices[roomId] || '',
                }))
                )
            );

            // Add Documents
            for (const [key, { file, url }] of Object.entries(tenantDocuments)) {
                const mappedKey = TENANT_DOC_KEY_MAP[key] || key;

                if (file) {
                    formData.append(mappedKey, file);
                } else if (url) {
                    formData.append(`${mappedKey}_url`, url);
                }
            }

            if (isEdit) {
                if (!tenantId) {
                    throw new Error("Invalid tenant Id for Edit Tenant Modal");
                }
                    
                formData.append('id', tenantId);
                formData.append('move_out_date', '');
                let response = await updateTenant(formData);
                if (response.success) {
                    setShowSuccessDialog(true);
                }
            } else {
                let response = await createTenant(formData);
                if (response.success) {
                    setShowSuccessDialog(true);
                }
            }

            onClose();
        } catch (err) {
            console.error(err.message || "Could not update");
        } finally {
            setLoading(false);
        }
    };

    // Convert rooms for MultiSelect display
    const multiSelectOptions = rooms
        .filter((r) => !r.occupied || selectedRooms.includes(r.id))
        .map((r) => ({
            id: r.id,
            name: `Floor ${r.floor} - ${r.name}`,
    }));


    return (
        <Modal onClose={onClose}>
            <div className="w-[340px] space-y-5">
                <h2 className="text-lg font-semibold text-foreground">
                    {isEdit ? 'Edit Tenant' : 'Add Tenant'}
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className='space-y-2'>
                        <ProfileImageInput
                            value={tenantData.photo}
                            onChange={(file) => setTenantData((prev) => ({ ...prev, photo: file }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tenant-name">Name</Label>
                        <Input
                            id="tenant-name"
                            value={tenantData.name}
                            placeholder="Enter full name"
                            onChange={(e) => setTenantData((prev) => ({ ...prev, name: e.target.value }))}
                            className={cn(formErrors.name && "border-destructive")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tenant-phone">Phone</Label>
                        <PhoneInputLu
                            nameValue="tenant-phone"
                            valueInput={tenantData.phone}
                            onChangeInput={(phone) => setTenantData((prev) => ({ ...prev, phone }))}
                            formError={formErrors.phone}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Join Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start">
                                    {tenantData.joinDate && format(new Date(tenantData.joinDate), 'dd MMM yyyy')}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                                <Calendar
                                    mode="single"
                                    selected={tenantData.joinDate}
                                    onSelect={(date) => { 
                                        if (date) {
                                        setTenantData((prev) => ({ ...prev, joinDate: date }))
                                    }}}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label>Select Rooms</Label>
                        <MultiSelect
                            options={multiSelectOptions}
                            selected={selectedRooms}
                            onChange={setSelectedRooms}
                        />
                        {formErrors.selectedRooms && <p className="text-sm text-destructive">{formErrors.selectedRooms}</p>}
                    </div>

                    {selectedRooms.length > 0 && (
                        <div className="space-y-3">
                            <Label>Room Cost</Label>
                            {selectedRooms.map((roomId) => {
                                const room = rooms.find((r) => r.id === roomId);
                                return (
                                    <div key={roomId} className="flex items-center gap-3">
                                        <span className="text-sm w-1/2">
                                            {room?.name || 'Room'} - {room?.floor}
                                        </span>
                                        <div className="relative w-1/2">
                                            <InputCurrency
                                                id={`cost-${roomId}`}
                                                symbol="₹"
                                                value={selectedRoomPrices[roomId] || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setSelectedRoomPrices((prev) => ({ ...prev, [roomId]: value }));
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <Button
                        variant="secondary"
                        type="button"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => setShowDocumentsModal(true)}
                    >
                        <FaUpload className="w-4 h-4" />
                        {documentsCount > 0 ? `Update Documents (${documentsCount})` : 'Upload Documents'}
                    </Button>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <Button variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">{isEdit ? 'Save' : 'Add'}</Button>
                    </div>
                </form>
                
                {showDocumentsModal && (<AddEditDocumentsModal onClose={() => setShowDocumentsModal(false)} onSave={(documents) => setTenantDocuments(documents)} existingDocuments={tenantDocuments}/>)}
                {/* Success Dialog */}
                {showSuccessDialog && (
                    <AlertDialogLu 
                        open={showSuccessDialog}
                        onOpenChange={setShowSuccessDialog}
                        title={"Success"}
                        description={isEdit ? 'Tenant is updated successfully' : 'Tenant is added successfully'}
                        cancelLabel={"Close"}
                        showActionButton={false}
                    />
                )}
                
            </div>
        </Modal>
    );
}
