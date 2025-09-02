import { Outlet } from 'react-router-dom';
import { FaBed, FaHome, FaUserCircle, FaUserFriends } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Header from '@/components/Header';
import AdminUpdateRequestsPopover from '@/components/User/AdminUpdateRequestsList';
import { useAuth } from '@/auth/AuthProvider';
import { Analytics } from '@vercel/analytics/react';

export default function MainLayout() {
  const { user } = useAuth();
  const navList = [
    { label: 'Home', icon: <FaHome className="w-6 h-6" />, path: '/' },
    { label: 'Tenants', icon: <FaUserFriends />, path: '/tenants' },
    { label: 'Rooms', icon: <FaBed />, path: '/rooms' },
    { label: 'Profile', icon: <FaUserCircle />, path: '/profile' },
  ];

  return (
    <>
      <div className="px-4 pt-6 pb-24 bg-background min-h-dvh flex flex-col">
        <Header />
        <AdminUpdateRequestsPopover user={user} />

        {/* Main content container */}
        <div className="flex-1 w-full max-w-6xl mx-auto">
          <Outlet />
        </div>
        <Analytics />
      </div>

      <Navbar navigationRoutes={navList} />
    </>
  );
}
