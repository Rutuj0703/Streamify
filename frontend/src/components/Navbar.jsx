import { Link, useLocation } from 'react-router';
import { ShipWheelIcon } from 'lucide-react';
import DesktopNavbar from './DesktopNavbar';
import MobileNavbar from './MobileNavbar';

const Navbar = () => {
  const location = useLocation();
  const isChatpage = location.pathname?.startsWith("/chat");

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 items-center hidden md:flex">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-end w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatpage && (
            <Link to="/" className="flex items-center gap-2.5">
              <ShipWheelIcon className="size-9 text-primary" />
              <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Streamify
              </span>
            </Link>
          )}
          <DesktopNavbar />
        </div>
      </nav>

      {/* Mobile Navbar */}
      <MobileNavbar />
    </>
  );
};

export default Navbar;
