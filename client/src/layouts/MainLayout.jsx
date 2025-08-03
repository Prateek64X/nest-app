import { Outlet } from 'react-router-dom';
import { FaBed, FaHome, FaUserCircle, FaUserFriends } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { Toaster } from 'sonner';

export default function MainLayout() {
  const navList = [
    { label: 'Home', icon: <FaHome />, path: '/' },
    { label: 'Tenants', icon: <FaUserFriends />, path: '/tenants' },
    { label: 'Rooms', icon: <FaBed />, path: '/rooms' },
    { label: 'Profile', icon: <FaUserCircle />, path: '/profile' },
  ];

  return (
    <>
      <div className="px-4 pt-6 pb-24">
        <Outlet />
      </div>
      <Navbar navigationRoutes={navList} />
      <Toaster position="top-center" richColors />
    </>
  );
}
