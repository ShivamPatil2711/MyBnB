import React, { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import { RxCross2 } from "react-icons/rx";
import { RxHamburgerMenu } from "react-icons/rx";
const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const commonClasses = 'text-sm sm:text-base font-medium px-3 py-1 rounded-lg transition-colors duration-200';
  const activeClasses = `${commonClasses} bg-white  text-orange-500 ring-2 ring-white`;
  const inactiveClasses = `${commonClasses}  border-2 border-white hover:bg-orange-600`;

  const guestLinks = [
    { to: '/bookings', label: 'Bookings' },
    { to: '/homes', label: 'Home-List' },
    { to: '/favourite-list', label: 'Favourites' },
  ];

  const hostLinks = [
    { to: '/host/airbnb-home', label: 'Add Home' },
    { to: '/host/host-homes', label: 'Host Homes' },
    { to: '/host/booked-homes', label: 'Booked Homes' },
  ];

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://api-mybnb-noss.onrender.com/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || 'Logged out successfully');
        setIsLoggedIn(false);
        setUser(null);
        navigate('/');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Logout failed');
      }
    } catch (err) {
      toast.success('Logged out successfully');
      setIsLoggedIn(false);
      setUser(null);
      navigate('/');
    }
  };

  return (
    <nav className="w-full bg-orange-500 text-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? activeClasses : inactiveClasses)}
          >
            Index
          </NavLink>
          {isLoggedIn && user?.userType === 'guest' && guestLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? activeClasses : inactiveClasses)}
            >
              {label}
            </NavLink>
          ))}
          {isLoggedIn && user?.userType === 'host' && hostLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? activeClasses : inactiveClasses)}
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Auth Links (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {!isLoggedIn && (
            <>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  isActive ? activeClasses : `${commonClasses} border-2 border-white hover:bg-orange-600`
                }
              >
                SignUp
              </NavLink>
              <NavLink
                to="/login-page"
                className={({ isActive }) =>
                  isActive ? activeClasses : `${commonClasses} border-2 border-white hover:bg-orange-600`
                }
              >
                Login
              </NavLink>
            </>
          )}
          {isLoggedIn && (
            <>
              <Link to="/profile" className={inactiveClasses}>
                Profile
              </Link>
                      </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="flex md:hidden text-2xl text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <RxCross2 /> : <RxHamburgerMenu />}
        </button>
      </div>

          {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} flex flex-col md:hidden bg-orange-600 px-4 py-3 space-y-2`}>
        <NavLink
          to="/"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) => (isActive ? activeClasses : inactiveClasses)}
        >
          Index
        </NavLink>
        {isLoggedIn && user?.userType === 'guest' && guestLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => (isActive ? activeClasses : inactiveClasses)}
          >
            {label}
          </NavLink>
        ))}
        {isLoggedIn && user?.userType === 'host' && hostLinks.map(({ to, label }) => (
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
              className={({ isActive }) =>
                isActive ? activeClasses : `${commonClasses} border-2 border-white hover:bg-orange-600`
              }
            >
              SignUp
            </NavLink>
            <NavLink
              to="/login-page"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                isActive ? activeClasses : `${commonClasses} border-2 border-white hover:bg-orange-600`
              }
            >
              Login
            </NavLink>
          </>
        )}
        {isLoggedIn && (
          <>
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className={inactiveClasses}
            >
              Profile
            </Link>
                  </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;