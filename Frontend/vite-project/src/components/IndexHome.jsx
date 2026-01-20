import React from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
const IndexHome = ({ home, isFavorited, addToFavourite, showHeart }) => {
  const handleFavoriteToggle = () => {
    addToFavourite(home._id);
    toast.info(
      isFavorited
        ? `Removed ${home.housename || 'this home'} from favorites`
        : `Added ${home.housename || 'this home'} to favorites`,
      {
        position: 'bottom-right',
        autoClose: 3000,
        theme: 'colored',
      }
    );
       
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden">

      <div className="relative">
        <img
          src={home.img?.url || 'https://via.placeholder.com/400x240'}
          alt={home.housename}
          className="w-full h-48 object-cover"
        />

        <div className="absolute top-3 left-3 bg-orange-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
          <FaStar className="mr-1" /> 4.0
        </div>

        {/* ❤️ HEART ONLY FOR LOGGED-IN GUEST */}
        {showHeart && (
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow"
          >
            {isFavorited ? (
              <FaHeart className="text-red-500 text-xl" />
            ) : (
              <FaRegHeart className="text-gray-700 text-xl" />
            )}
          </button>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold mb-1">
          {home.housename}
        </h3>

        <div className="flex items-center text-gray-600 text-sm mb-3">
          <FaMapMarkerAlt className="mr-1 text-orange-500" />
          {home.city || 'Unknown City'}
        </div>

        <div className="text-xl font-bold text-orange-600 mb-4">
          ₹{home.price}
          <span className="text-sm text-gray-500"> / night</span>
        </div>

        <Link
          to={`/homedetails/${home._id}`}
          className="block w-full bg-orange-600 text-white text-center py-2 rounded-lg"
        >
          See Details
        </Link>
      </div>
    </div>
  );
};

export default IndexHome;
