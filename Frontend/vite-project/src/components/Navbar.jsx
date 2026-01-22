import React, { useState, useContext } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import { RxCross2 } from "react-icons/rx";
import { RxHamburgerMenu } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:4003';

  const commonClasses = 'text-sm sm:text-base font-medium px-3 py-1.5 rounded-lg transition-colors duration-200';
  const activeClasses = `${commonClasses} bg-white text-orange-600 ring-2 ring-white/80`;
  const inactiveClasses = `${commonClasses} border-2 border-white/80 hover:bg-white/20 hover:text-white`;

  const guestLinks = [
    { to: '/bookings', label: 'Bookings' },
    { to: '/favourite-list', label: 'Favourites' },
  ];

  const hostLinks = [
    { to: '/host/airbnb-home', label: 'Add Home' },
    { to: '/host/host-homes', label: 'Host Homes' },
    { to: '/host/booked-homes', label: 'Booked Homes' },
  ];

  const isProfileActive = location.pathname === '/profile';

  const profileIconClasses = `
    text-3xl p-1 rounded-full transition-all duration-200
    ${isProfileActive 
      ? 'bg-white text-orange-600' 
      : 'text-white hover:bg-white/20 hover:scale-110'}
  `;

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendApiUrl}/api/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || 'Logged out successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Logout failed');
      }

      setIsLoggedIn(false);
      setUser(null);
      navigate('/');
    } catch (err) {
      // Network error → still clear session
      toast.success('Logged out successfully');
      setIsLoggedIn(false);
      setUser(null);
      navigate('/');
    }
  };

  return (
    <nav className="w-full bg-orange-500 text-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-4">
         
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? activeClasses : inactiveClasses)}
            >
              Index
            </NavLink>
       

          {isLoggedIn && user?.userType === 'guest' &&
            guestLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => (isActive ? activeClasses : inactiveClasses)}
              >
                {label}
              </NavLink>
            ))}

          {isLoggedIn && user?.userType === 'host' &&
            hostLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => (isActive ? activeClasses : inactiveClasses)}
              >
                {label}
              </NavLink>
            ))}
        </div>

        {/* Desktop Auth / Profile */}
        <div className="hidden md:flex items-center gap-5">
          {!isLoggedIn ? (
            <>
              <NavLink to="/signup" className={({ isActive }) => (isActive ? activeClasses : inactiveClasses)}>
                Sign Up
              </NavLink>
              <NavLink to="/login-page" className={({ isActive }) => (isActive ? activeClasses : inactiveClasses)}>
                Login
              </NavLink>
            </>
          ) : (
            <Link
              to="/profile"
              className={profileIconClasses}
              title="Profile"
            >
              <CgProfile />
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden  text-3xl "
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <RxCross2 /> : <RxHamburgerMenu />}
        </button>
         <div className='md:hidden'> 
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 text-lg font-medium transition-colors ${isProfileActive ? 'text-orange-200' : 'hover:text-orange-200'}`}
            >
              <CgProfile className={`text-3xl ${isProfileActive ? 'bg-white text-orange-600 rounded-full p-1' : ''}`} />
            </Link>

           
          </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? 'flex' : 'hidden'}   flex-col md:hidden bg-orange-600 px-5 py-4 space-y-3`}>
       
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => (isActive ? activeClasses : inactiveClasses)}
          >
            Index
          </NavLink>
      

        {isLoggedIn && user?.userType === 'guest' &&
          guestLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => (isActive ? activeClasses : inactiveClasses)}
            >
              {label}
            </NavLink>
          ))}

        {isLoggedIn && user?.userType === 'host' &&
          hostLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => (isActive ? activeClasses : inactiveClasses)}
            >
              {label}
            </NavLink>
          ))}

      {!isLoggedIn && (
          <>
            <NavLink
              to="/signup"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => (isActive ? activeClasses : inactiveClasses)}
            >
              Sign Up
            </NavLink>
            <NavLink
              to="/login-page"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => (isActive ? activeClasses : inactiveClasses)}
            >
              Login
            </NavLink>
          </>
      )
    
}
      </div>
    </nav>
  );
};

export default Navbar;