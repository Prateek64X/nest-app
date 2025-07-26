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
import { getAvailableRooms } from '@/services/roomsService';
import AddEditDocumentsModal from './AddEditDocumentsModal';
import { createTenant } from '@/services/tenantsService';

export default function AddEditTenantModal({
    isEdit = false,
    onClose,
    onSubmit,
}) {
    const [tenantData, setTenantData] = useState({
        name: '',
        phone: '',
        joinDate: new Date(),
    });
    const [tenantDocuments, setTenantDocuments] = useState({
        docAadhar: '',
        docPan: '',
        docVoter: '',
        docLicense: '',
        docPolice: '',
        docAgreement: '',
    });
    const documentsCount = Object.values(tenantDocuments).filter((url) => url !== '').length;
    const [availableRooms, setAvailableRooms] = useState([]);
    
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [selectedRoomPrices, setSelectedRoomPrices] = useState({});

    const [showDocumentsModal, setShowDocumentsModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getAvailableRooms()
        .then(setAvailableRooms)
        .catch ((err) => {
            console.error(err.message || "Could not fetched available rooms");
        });
    }, []);

    // testing
    useEffect(() => {
        setSelectedRoomPrices((prevPrices) => {
            const updated = { ...prevPrices };
            selectedRooms.forEach((roomId) => {
                if (!updated[roomId]) {
                    const room = availableRooms.find((r) => r.id === roomId);
                    if (room) updated[roomId] = room.price || '';
                }
            });
            return updated;
        });
    }, [selectedRooms, availableRooms]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const rooms = selectedRooms.map((roomId) => ({ id: roomId, price: selectedRoomPrices[roomId] || ''}));
        const payload = {
            full_name: tenantData.name, 
            phone: tenantData.phone,
            move_in_date: tenantData.joinDate, 
            rooms: rooms || {},
            documents: tenantDocuments || {}
        };

        try {
            if (isEdit) {
                alert("WIP Tenant not updated successfully");
            } else {
                await createTenant({ ...payload });
                alert("Tenant created successfully");
            }
            onClose();
        } catch (err) {
            console.error(err.message || "Could not update");
        } finally {
            setLoading(false);
        }
        console.log("Tenant Data = ", tenantData);
        console.log("Selected Rooms = ", selectedRooms, "Selected room prices = ", selectedRoomPrices);
        console.log("Tenant Documents = ", tenantDocuments);
    };

    // Convert rooms for MultiSelect display
    const multiSelectOptions = availableRooms.map((r) => ({
        id: r.id,
        name: `Floor ${r.floor} - ${r.name}`
    }));


    return (
        <Modal onClose={onClose}>
            <div className="w-[340px] space-y-5">
                <h2 className="text-lg font-semibold text-foreground">
                    {isEdit ? 'Edit Tenant' : 'Add Tenant'}
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="tenant-name">Name</Label>
                        <Input
                            id="tenant-name"
                            value={tenantData.name}
                            placeholder="Enter full name"
                            onChange={(e) => setTenantData((prev) => ({ ...prev, name: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tenant-phone">Phone</Label>
                        <PhoneInputLu
                            nameValue="tenant-phone"
                            valueInput={tenantData.phone}
                            onChangeInput={(phone) => setTenantData((prev) => ({ ...prev, phone }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Join Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start">
                                    {format(tenantData.joinDate, 'dd MMM yyyy')}
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
                    </div>

                    {selectedRooms.length > 0 && (
                        <div className="space-y-3">
                            <Label>Room Cost</Label>
                            {selectedRooms.map((roomId) => {
                                const room = availableRooms.find((r) => r.id === roomId);
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
            </div>
        </Modal>
    );
}
