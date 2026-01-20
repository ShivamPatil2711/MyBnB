import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './AuthContext'; // Adjust path based on your project structure
import BookingItem from './BookingItem'; // Import the separate BookingItem component

const Bookings = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
   const onDelete = (bookingId) => {
    setBookings((prevBookings) =>
      prevBookings.filter((booking) => booking._id !== bookingId)
    );
  }
  useEffect(() => {
    const fetchBookings = async () => {
      if (!isLoggedIn) {
        toast.error('Please log in to view your bookings');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(' http://localhost:4003/api/bookings', {
          method: 'GET',
          credentials: 'include', // Include JWT cookie
        });

        const data = await response.json();

         setBookings(data.bookings || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        toast.error(err.message);
      }
    };

    fetchBookings();
  }, [isLoggedIn]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-2xl font-semibold text-orange-600 animate-pulse">Loading bookings...</p>
      </div>
    );
  }

 
  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className=" w-full mx-auto">
        <h1 className=" text-center text-3xl font-bold text-gray-800 mb-10">Your Bookings</h1>
        {bookings.length === 0 ? (
          <p className="text-lg text-gray-600">No bookings found.</p>
        ) : (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
  {bookings.map(booking => (
    <div key={booking._id} className="w-full max-w-sm">
      <BookingItem
        booking={booking}
        onDelete={onDelete}
        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
      />
    </div>
  ))}
</div>

        )}
      </div>
    </div>
  );
};

export default Bookings;