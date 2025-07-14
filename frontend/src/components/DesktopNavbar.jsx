import { BellIcon, House, LogOutIcon } from 'lucide-react'
import { Link } from 'react-router'
import ThemeSelector from './ThemeSelector';
import useAuthUser from '../hooks/useAuthUser';
import useLogout from '../hooks/useLogout';
import { useQuery } from '@tanstack/react-query';
import { getFriendRequests } from '../lib/api';

const DesktopNavbar = () => {
    const { authUser } = useAuthUser();
    const {logoutMutation,isPending,error} = useLogout();
    const { data:friendRequests,isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });
    const incomingRequests=friendRequests?.incomingReqs || [];
  return (
    <div className="zbg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 items-center hidden md:flex px-4">
        <div className="flex flex-row ml-auto">
            <Link to="/">
              <button className="btn btn-ghost btn-circle">
                  <House className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle relative">
                <div className="relative">
                  <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                  {incomingRequests.length > 0 && (
                    <span className="absolute top-0 left-5 size-3 rounded-full bg-success" />
                  )}
                </div>
              </button>
            </Link>
          </div>

          {/* Themes */}
          <ThemeSelector />

          <div className="avatar">
            <Link to="/profile">
              <button className="btn btn-ghost btn-circle">
                  <img src={authUser?.profilePic} alt="User Avatar" rel="noreferrer" />
              </button>
            </Link>
          </div>

          {/* Logout button */}
          <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
    </div>
    
  )
}

export default DesktopNavbar