import { Outlet } from 'react-router-dom';
import { FaBed, FaHome, FaUserFriends } from 'react-icons/fa';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  const navList = [
    { label: 'Home', icon: <FaHome />, path: '/' },
    { label: 'Tenants', icon: <FaUserFriends />, path: '/tenants' },
    { label: 'Rooms', icon: <FaBed />, path: '/rooms' },
  ];

  return (
    <>
      <div className="px-4 pt-6 pb-24">
        <Outlet />
      </div>
      <Navbar navigationRoutes={navList} />
    </>
  );
}
