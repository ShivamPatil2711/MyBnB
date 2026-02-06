import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './AuthContext'; // Adjust path based on your project structure
import BookingItem from './BookingItem'; // Import the separate BookingItem component
import PastBookingItem from './PastBookingItem';

const Bookings = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBooking, setCurrentBooking] = useState([]);
  const [pastBooking, setPastBooking] = useState([]);
  const [view, setView] = useState("current"); // "current" or "past"
   const onDelete = (bookingId) => {
    {/*setBookings((prevBookings) =>
      prevBookings.filter((booking) => booking._id !== bookingId)
    );*/}
    setCurrentBooking((prevBookings) =>
      prevBookings.filter((booking) => booking._id !== bookingId)
    );  
  }
  const handleReviewSubmit = async (booking) => {
    try {
      const response = await fetch('http://localhost:4003/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking._id,
          homeId: booking.homeId._id,
          rating:booking.reviews.rating || 4,
          comment :booking.reviews.comment || "Great stay!"
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setPastBooking(pastBooking.map(bk => {
          if (bk._id === booking._id) {
            return data.booking;
          }
          return bk;
        }));
        toast.success("Review submitted!");
      } else {
        throw new Error( "Failed to submit review");
      }
    } catch (err) {
    } finally {
    }
  };

  const onUpdate = (updatedBooking) => {
    handleReviewSubmit(updatedBooking);
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking._id === updatedBooking._id ? updatedBooking : booking
      )
    );
  };
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
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch bookings');
        }
        setBookings(data.bookings || []);
        
      const current = [];
      const past = [];
      const now = new Date();

      (data.bookings || []).forEach((b) => {
        if (new Date(b.checkout) < now) past.push(b);
        else current.push(b);
      });

      setCurrentBooking(current);
      setPastBooking(past);
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
        <div className="flex justify-center gap-6 mb-8">
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="radio"
      name="bookingType"
      value="current"
      checked={view === "current"}
      onChange={() => setView("current")}
    />
    Current Bookings
  </label>

  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="radio"
      name="bookingType"
      value="past"
      checked={view === "past"}
      onChange={() => setView("past")}
    />
    Past Bookings
  </label>
</div>

        {bookings.length === 0 ? (
          <p className="text-lg text-gray-600">No bookings found.</p>
        ) : (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
  {view==='current' ? currentBooking.map(booking => (
    <div key={booking._id} className="w-full max-w-sm">
     <BookingItem
        booking={booking}
        onDelete={onDelete}
        onUpdate={onUpdate}
        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
      />
    </div>
  )) : pastBooking.map(booking => (
    <div key={booking._id} className="w-full max-w-sm">
      <PastBookingItem booking={booking} onUpdate={onUpdate}></PastBookingItem>
    </div>
  ))}
</div>

        )}
      </div>
    </div>
  );
};

export default Bookings;