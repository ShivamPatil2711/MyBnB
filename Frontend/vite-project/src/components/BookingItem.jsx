import { Link } from 'react-router-dom';

const BookingItem = ({ booking }) => {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-sm mx-auto hover:shadow-2xl transition-shadow duration-300">
      <img
        src={booking.homeId.img}
        alt={booking.homeId.housename || 'Home Image'}
        className="w-full h-48 object-cover"
      />
      <div className="p-6 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">
          {booking.homeId.housename || "Unknown Home"}
        </h2>
        <p className="text-gray-600">
          <span className="font-medium">Check-in:</span> {formatDate(booking.checkin)}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Check-out:</span> {formatDate(booking.checkout)}
        </p>
        <Link
          to={`/homedetails/${booking.homeId._id}`}
          className="block bg-orange-500 text-white text-center py-2 rounded-md font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 transition-colors duration-200"
        >
          Details
        </Link>
      </div>
    </div>
  );
};

export default BookingItem;
