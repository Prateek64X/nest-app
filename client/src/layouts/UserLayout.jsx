import { Outlet } from 'react-router-dom';
import { FaBed, FaHome, FaUserCircle, FaUserFriends } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Header from '@/components/Header';

export default function UserLayout() {
  const navList = [
    { label: 'Home', icon: <FaHome className="w-6 h-6" />, path: '/user' },
    { label: 'Profile', icon: <FaUserCircle />, path: '/user-profile' },
  ];

  return (
    <>
      <div className="px-4 pt-6 pb-24 bg-background">
        <Header />
        {/* Main content container */}
        <div className="flex-1 w-full max-w-6xl mx-auto">
          <Outlet />
        </div>
      </div>
      <Navbar navigationRoutes={navList} />
    </>
  );
}
