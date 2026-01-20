import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const BookingItem = ({ booking, onDelete }) => {
  const navigate = useNavigate();

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const cancelBooking = async (booking_id) => {
    try {
      const response = await fetch(`http://localhost:4003/api/cancelbooking/${booking_id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel booking");
      }

      toast.success("Booking canceled successfully!");
      onDelete(booking_id); // Remove from list
    } catch (error) {
      console.error("Error canceling booking:", error);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
   <div className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 h hover:-translate-y-1">
      {/* Image – same height & style as IndexHome */}
      <div className="relative h-48 flex-shrink-0 overflow-hidden bg-gray-100">
        <img
          src={booking.homeId.img?.url || "https://via.placeholder.com/400x240?text=Property"}
          alt={booking.homeId.housename || 'Booked property'}
          className="w-full h-full object-cover "
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1.5 line-clamp-1 ">
          {booking.homeId.housename || "Unnamed Property"}
        </h3>

        <div className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Check-in:</span> {formatDate(booking.checkin)}
        </div>

        <div className="text-sm text-gray-600 mb-4">
          <span className="font-medium">Check-out:</span> {formatDate(booking.checkout)}
        </div>

        <div className="flex items-baseline mb-5">
          <span className="text-xl font-bold text-orange-600">
            ₹{booking.homeId.price?.toLocaleString() || "—"}
          </span>
          <span className="text-sm text-gray-500 ml-2">/ night</span>
        </div>

        {/* Buttons – same layout as IndexHome */}
        <div className="flex gap-4 ">
          <Link
            to={`/homedetails/${booking.homeId._id}`}
            className="flex-1 bg-orange-600 text-white text-center py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            See Details
          </Link>

          <button
            onClick={() => cancelBooking(booking._id)}
            className="flex-1 bg-red-50 text-red-700 py-3 rounded-xl font-medium hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingItem;