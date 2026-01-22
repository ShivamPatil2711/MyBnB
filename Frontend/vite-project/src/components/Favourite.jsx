import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './AuthContext';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';

const Favourite = ({ home, onDelete }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:4003';

  const handleDeleteFavourite = async () => {
    if (!isLoggedIn) {
      toast.error('Please log in to remove from favorites');
      navigate('/login-page');
      return;
    }

    try {
      const response = await fetch(`${backendApiUrl}/api/deletefavourite`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: home._id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove favorite');
      }

      toast.success(`Removed ${home.housename || 'this home'} from favorites`);
      onDelete(home._id); // Update parent list
    } catch (err) {
      toast.error(err.message || 'Error removing from favorites');
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 flex flex-col h-full hover:-translate-y-1 hover:shadow-xl">
      {/* Image Section */}
      <div className="relative h-48 sm:h-52 flex-shrink-0 overflow-hidden">
        <img
          src={home.img?.url || 'https://via.placeholder.com/400x240?text=Property'}
          alt={home.housename || 'Favorite property'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Rating badge */}
        <div className="absolute top-3 left-3 bg-orange-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center shadow-md">
          <FaStar className="mr-1 text-white" /> 4.0
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
          {home.housename || 'Unnamed Property'}
        </h3>

        <div className="flex items-center text-gray-600 text-sm mb-3">
          <FaMapMarkerAlt className="mr-1.5 text-orange-500 flex-shrink-0" />
          <span className="truncate">{home.city || 'Unknown City'}</span>
        </div>

        <div className="text-xl font-bold text-orange-600 mb-5">
          ₹{home.price?.toLocaleString() || '—'}
          <span className="text-xs sm:text-sm text-gray-500 font-normal"> / night</span>
        </div>

        {/* Buttons Container - Side by Side on all screens */}
        <div className="mt-auto flex flex-row gap-2 sm:gap-4 w-full">
          <Link
            to={`/homedetails/${home._id}`}
            className="flex-1 bg-orange-600 text-white text-center py-3 rounded-xl text-sm font-medium hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 whitespace-nowrap"
          >
            See Details
          </Link>

          <button
            onClick={handleDeleteFavourite}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl text-sm font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 whitespace-nowrap"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default Favourite;