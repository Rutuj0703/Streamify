import useAuthUser from '../hooks/useAuthUser';
import { Link, useLocation, useNavigate } from 'react-router';
import { BellIcon, House, LogOutIcon, ShipWheelIcon, Menu, UserRoundPenIcon } from 'lucide-react';
import useLogout from '../hooks/useLogout';
import ThemeSelector from './ThemeSelector';
import { getFriendRequests } from '../lib/api';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const MobileNavbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const navigate = useNavigate();
  const isChatpage = location.pathname?.startsWith('/chat');
  const { logoutMutation } = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: friendRequests } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: getFriendRequests,
  });

  const incomingRequests = friendRequests?.incomingReqs || [];

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav className="bg-base-200 border-b border-base-300 fixed top-0 w-full z-30 md:hidden">
      <div className="flex justify-between items-center h-16 px-4">
        {/* LOGO - ONLY IN THE CHAT PAGE */}
          
            <Link to="/" className="flex items-center gap-2.5">
              <ShipWheelIcon className="size-9 text-primary" />
              <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Streamify
              </span>
            </Link>
        <div>
            <ThemeSelector />
            <button
            className="btn btn-ghost btn-circle"
            onClick={() => setMenuOpen(!menuOpen)}
            >
            <Menu className="h-6 w-6 text-base-content opacity-70" />
            </button>
        </div>
      </div>
      

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="p-4 border-t border-base-300 bg-base-100 flex flex-col gap-4">
          {isChatpage && (
            <button onClick={() => handleNavigate("/")} className="flex items-center gap-2.5">
              <ShipWheelIcon className="size-6 text-primary" />
              <span className="text-lg font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Streamify
              </span>
            </button>
          )}

          <button onClick={() => handleNavigate("/")} className="btn btn-sm btn-outline w-full">
            <House className="h-5 w-5 text-base-content" />
            <span className="text-base-content">Home</span>
          </button>

          <button onClick={() => handleNavigate("/notifications")} className="btn btn-sm btn-outline w-full">
            <BellIcon className="h-5 w-5 text-base-content" />
            <span className="text-base-content">Notifications</span>
            {incomingRequests.length > 0 && (
              <span className="absolute top-0 right-0 size-2.5 rounded-full bg-success" />
            )}
          </button>

          <button onClick={() => handleNavigate("/profile")} className="btn btn-sm btn-outline w-full">
            <UserRoundPenIcon className="h-5 w-5 text-base-content" />
            <span className="text-base-content">Profile</span>
            {incomingRequests.length > 0 && (
              <span className="absolute top-0 right-0 size-2.5 rounded-full bg-success" />
            )}
          </button>


          <button
            className="btn btn-sm btn-outline w-full"
            onClick={logoutMutation}
          >
            <LogOutIcon className="h-4 w-4 mr-2" />
            Logout
          </button>

          
        </div>
      )}
    </nav>
  );
};

export default MobileNavbar;
