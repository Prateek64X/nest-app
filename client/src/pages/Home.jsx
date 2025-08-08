import React, { useEffect, useState } from 'react';
import DateView from '@/components/DateView';
import RentCardList from '@/components/RoomRent/RentCardList';
import { createRoomRentEntries, getRoomRents, getUpcomingRoomRents } from '@/services/roomRentsService';
import { Button } from '@/components/ui/button';
import { FaExclamationTriangle, FaRegCalendarPlus } from 'react-icons/fa';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialogLu } from '@/components/shared/AlertDialogLu';

const Home = () => {
    const [roomRents, setRoomRents] = useState([]);
    const [upcomingRents, setUpcomingRents] = useState([]);
    const [showCreateEntries, setShowCreateEntries] = useState(false);
    const [loading, setLoading] = useState(true);

    async function fetchRoomRents() {
        try {
            const data = await getRoomRents();
            setRoomRents(data);

            const upcoming = await getUpcomingRoomRents();
            setUpcomingRents(upcoming);
        } catch (err) {
            console.error("Failed to fetch room rents:", err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateRoomRentEntries() {
        try {
            const { message } = await createRoomRentEntries();
            toast.success(message);
            fetchRoomRents();
        } catch (err) {
            toast.error(err.message);
        }
    }

    useEffect(() => {
        fetchRoomRents();
    }, []);

    return (
        <div className='min-h-screen relative pt-12'>
            <DateView className='absolute mt-2 left-2'/>
            <RentCardList roomRents={roomRents} upcomingRents={upcomingRents} refreshRoomRents={fetchRoomRents} loading={loading} className='mt-[15vh]'/>
        
            {/* Create rent entries Button */}
            <h2 className='text-lg mt-2 ml-2 font-semibold text-primary tracking-tight'>Administrator</h2>
            <Card className="m-2">
                <CardContent className="px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-sm text-muted-foreground max-w-sm">
                    Create this month's rent entry manually if it hasn’t been generated automatically.
                </p>

                <Button
                    variant='secondary'
                    className="flex items-center gap-2 mx-6 py-2 shadow-lg"
                    onClick={() => {setShowCreateEntries(true)}}
                >
                    <FaRegCalendarPlus className="w-4 h-4" />
                    <span className="text-sm font-medium">Create Rent Entries</span>
                </Button>
                </CardContent>
            </Card>

            <AlertDialogLu
                open={showCreateEntries}
                onOpenChange={setShowCreateEntries}
                icon={<FaExclamationTriangle />}
                title={"Are you sure?"}
                description={
                    "Rent entries are created automatically each month. Run manually only if it failed or a tenant was added mid-month."
                }
                cancelLabel={"Cancel"}
                actionLabel={"Create Rent Entries"}
                showActionButton={true}
                onConfirm={handleCreateRoomRentEntries || undefined}
            />
        </div>
    );
};

export default Home;