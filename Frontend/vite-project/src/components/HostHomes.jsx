import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './AuthContext'; // Adjust path as needed
import { FaLocationDot } from "react-icons/fa6";

const HostHomes = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please log in to view your registered homes');
      navigate('/login-page');
      return;
    }

    const fetchHostHomes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:4003/api/host/host-homes', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        setHomes(data.registeredhomes || data || []);
      } catch (err) {
        console.error('Failed to fetch host homes:', err);
        setError('Unable to load your registered homes. Please try again later.');
        toast.error('Failed to load homes');
      } finally {
        setLoading(false);
      }
    };

    fetchHostHomes();
  }, [isLoggedIn, navigate]);

  const handleDeleteHome = async (homeId) => {
    if (!window.confirm('Are you sure you want to delete this home? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4003/api/host/deletehome/${homeId}`, {
        method: 'DELETE', // More RESTful than POST for deletion
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete home');
      }

      setHomes((prev) => prev.filter((home) => home._id !== homeId));
      toast.success('Home deleted successfully');
    } catch (err) {
      toast.error('Failed to delete home. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-10 lg:py-8">
        {/* Header */}
        <div className="mb-10 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Your Registered Homes
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Manage the properties you have listed for hosting
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mb-4"></div>
            <p className="text-xl font-medium text-gray-700">Loading your homes...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
            <div className="flex items-center">
              <svg
                className="h-6 w-6 text-red-500 mr-3 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {homes.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <h3 className="mt-4 text-xl font-medium text-gray-900">No homes registered yet</h3>
                <p className="mt-2 text-gray-600 mb-6">
                  Start listing your properties to begin hosting.
                </p>
                <Link
                  to="/host/add-home" // Adjust route as per your app
                  className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
                >
                  Add New Home
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {homes.map((home) => (
                  <div
                    key={home._id}
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative h-56 flex-shrink-0">
                      <img
                        src={home.img?.url || 'https://via.placeholder.com/400x240?text=Your+Home'}
                        alt={home.housename || 'Property'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                        {home.housename || 'Unnamed Property'}
                      </h3>

                     <div className="flex items-center gap-1.5 text-gray-600 text-sm mb-2">
  <FaLocationDot className="text-orange-600 flex-shrink-0 mt-0.5" />
  <span className="font-medium text-gray-700 truncate">
    {home.city || 'Location not specified'}
  </span>
</div>

                      <div className="flex items-baseline mb-3">
                        <span className="text-xl font-bold text-gray-900">
                          ₹{home.price?.toLocaleString() || '—'}
                        </span>
                        <span className="text-sm text-gray-500 ml-1.5">/ night</span>
                      </div>


                      {/* Action Buttons */}
                      <div className="flex gap-4 mt-auto">
                        <Link
                          to={`/host/edit-home/${home._id}`}
                          className="flex-1 bg-gray-800 text-white text-center py-3 rounded-xl font-medium hover:bg-gray-900 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteHome(home._id)}
                          className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HostHomes;