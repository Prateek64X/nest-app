import React, { useEffect, useState } from 'react';
import DateView from '@/components/DateView';
import RentCardList from '@/components/RoomRent/RentCardList';
import { createRoomRentEntries, getRoomRents, getUpcomingRoomRents } from '@/services/roomRentsService';
import { Button } from '@/components/ui/button';
import { FaBell, FaExclamationTriangle, FaRegCalendarPlus } from 'react-icons/fa';
import { useAuth } from '@/auth/AuthProvider';
import { getAllUpdateRequests } from '@/services/updateRequestService';
import { toast } from 'sonner';
import AdminUpdateRequestsList from '@/components/User/AdminUpdateRequestsList';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialogLu } from '@/components/shared/AlertDialogLu';

const Home = () => {
    
    const { user } = useAuth();
    const [roomRents, setRoomRents] = useState([]);
    const [upcomingRents, setUpcomingRents] = useState([]);
    const [updateRequests, setUpdateRequests] = useState([]);
    const [showUpdateRequest, setShowUpdateRequests] = useState(false);
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

    async function fetchUpdateRequests() {
        try {
            const data = await getAllUpdateRequests(user?.id);
            console.log(data)
            setUpdateRequests(data);
        } catch (err) {
            const message =
                err?.message || err?.error || "Failed to fetch update requests";
            console.error("Request Fetch Error:", message);
            toast.error(message);
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
        fetchUpdateRequests();
    }, []);

    return (
        <div className='min-h-screen relative pt-12'>
            {/* Alarm Button in top-right */}
            <Button
                variant="secondary"
                className="absolute -top-10 right-4 z-30 flex items-center px-2 py-2 rounded-full"
                onClick={() => {setShowUpdateRequests(true)}}
            >
                <FaBell className="w-5 h-5 text-muted-foreground" />

                {/* Notification badge */}
                {updateRequests?.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 text-[11px] font-bold text-white bg-primary rounded-full">
                    {updateRequests.length}
                </span>
                )}
            </Button>

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
                    className="flex items-center gap-2 mx-6 py-2 bg-secondary text-secondary-foreground shadow-lg"
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

            {showUpdateRequest && (
                <AdminUpdateRequestsList
                    requests={updateRequests}
                    onDismiss={() => fetchUpdateRequests()}
                />
            )}
        </div>
    );
};

export default Home;