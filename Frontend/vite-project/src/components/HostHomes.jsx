import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './AuthContext'; // Adjust path based on your project structure

const HostHomes = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please log in to view your homes');
      navigate('/login-page');
      return;
    }

    const fetchHomes = async () => {
      try {
        const response = await fetch('http://localhost:4002/api/host/host-homes', {
          method: 'GET',
          credentials: 'include', // Include JWT cookie
        });

        const data = await response.json();
        setHomes(data.registeredhomes || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        toast.error(err.message);
      }
    };

    fetchHomes();
  }, [isLoggedIn, navigate]);

  const handleDeleteHome = async (homeId) => {
    try {
      const response = await fetch(`http://localhost:4002/api/host/deletehome/${homeId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setHomes((prev) => prev.filter((home) => home._id !== homeId));
      toast.success('Home deleted successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-red-700 text-xl font-medium">Loading homes...</p>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-red-700 mb-6 text-center">Your Registered Homes</h1>
      {homes.length === 0 ? (
        <p className="text-red-700 text-lg text-center">No homes registered yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {homes.map((home) => (
            <div
              key={home._id}
              className="bg-white text-red-700 w-auto rounded-2xl p-6 shadow-lg flex flex-col items-center border border-red-100 hover:shadow-2xl hover:border-red-300 transition"
            >
               <img
        src={home.img || "https://www.cvent.com/sites/default/files/image/2021-08/default-home.jpg"}
        alt={home.housename}
        className="w-full h-40 object-cover rounded-lg mb-4 border-b-2 border-orange-500"
      />
              <div className="w-full text-base space-y-1 mb-4">
                <p>
                  <span className="font-semibold">Housename:</span> {home.housename || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">Location:</span> {home.location || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">Price:</span> ₹{home.price || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">Rate:</span> {home.rate ? `${home.rate}/5` : 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">Description:</span> {home.des || 'No description available'}
                </p>
              </div>
              <div className="flex gap-4 mt-2">
                <Link
                  to={`/host/edit-home/${home._id}`}
                  className="h-10 w-20 flex items-center justify-center bg-red-500 text-white rounded-lg font-semibold text-base hover:bg-red-700 transition"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteHome(home._id)}
                  className="h-10 w-20 bg-red-500 text-white rounded-lg font-semibold text-base hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HostHomes;