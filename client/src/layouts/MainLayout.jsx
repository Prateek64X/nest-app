import { Outlet } from 'react-router-dom';
import { FaBed, FaHome, FaUserCircle, FaUserFriends } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Header from '@/components/Header';

export default function MainLayout() {
  const navList = [
    { label: 'Home', icon: <FaHome className="w-6 h-6" />, path: '/' },
    { label: 'Tenants', icon: <FaUserFriends />, path: '/tenants' },
    { label: 'Rooms', icon: <FaBed />, path: '/rooms' },
    { label: 'Profile', icon: <FaUserCircle />, path: '/profile' },
  ];

  return (
    <>
      <div className="px-4 pt-6 pb-24 bg-background">
        <Header />
        <Outlet />
      </div>
      <Navbar navigationRoutes={navList} />
    </>
  );
}
