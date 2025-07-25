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

export default function AddEditTenantModal({
    isEdit = false,
    onClose,
    onSubmit,
    initialData = {},
    rooms = []
}) {
    const [name, setName] = useState(initialData.name || '');
    const [phone, setPhone] = useState(initialData.phone || '');
    const [joinDate, setJoinDate] = useState(initialData.joinDate ? new Date(initialData.joinDate) : new Date());
    const [selectedRooms, setSelectedRooms] = useState(initialData.rooms || []);
    const [roomCosts, setRoomCosts] = useState({});

    useEffect(() => {
        const newCosts = {};
        selectedRooms.forEach((id) => {
            newCosts[id] = roomCosts[id] || '';
        });
        setRoomCosts(newCosts);
    }, [selectedRooms]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, phone, joinDate, rooms: selectedRooms, roomCosts });
    };

    // Convert rooms for MultiSelect display
    const multiSelectOptions = rooms.map((r) => ({
    id: r.roomId,
    name: `Floor ${r.floor} - ${r.room}`
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
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tenant-phone">Phone</Label>
                        <PhoneInputLu
                            nameValue="tenant-phone"
                            valueInput={phone}
                            onChangeInput={setPhone}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Join Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start">
                                    {format(joinDate, 'dd MMM yyyy')}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                                <Calendar
                                    mode="single"
                                    selected={joinDate}
                                    onSelect={setJoinDate}
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
                                const room = rooms.find((r) => r.roomId === roomId);
                                return (
                                    <div key={roomId} className="flex items-center gap-3">
                                        <span className="text-sm w-1/2">
                                            {room?.room || 'Room'} - {room?.floor}
                                        </span>
                                        <div className="relative w-1/2">
                                            <InputCurrency
                                                id={`cost-${roomId}`}
                                                symbol="₹"
                                                value={roomCosts[roomId] || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setRoomCosts((prev) => ({
                                                    ...prev,
                                                    [roomId]: value,
                                                    }));
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
                    >
                        <FaUpload className="w-4 h-4" />
                        Upload Documents
                    </Button>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <Button variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">{isEdit ? 'Save' : 'Add'}</Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
