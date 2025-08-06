import React, { useEffect, useState } from 'react';
import DateView from '@/components/DateView';
import RentCardList from '@/components/RoomRent/RentCardList';
import { getRoomRents, getUpcomingRoomRents } from '@/services/roomRentsService';
import { Button } from '@/components/ui/button';
import { FaBell } from 'react-icons/fa';
import { useAuth } from '@/auth/AuthProvider';
import { getAllUpdateRequests } from '@/services/updateRequestService';
import { toast } from 'sonner';
import AdminUpdateRequestsList from '@/components/User/AdminUpdateRequestsList';

const Home = () => {
    
    const { user } = useAuth();
    const [roomRents, setRoomRents] = useState([]);
    const [upcomingRents, setUpcomingRents] = useState([]);
    const [updateRequests, setUpdateRequests] = useState([]);
    const [showUpdateRequest, setShowUpdateRequests] = useState(false);
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