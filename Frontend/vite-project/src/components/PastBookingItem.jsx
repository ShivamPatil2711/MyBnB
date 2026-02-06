import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PastBookingItem = ({ booking, onUpdate }) => {
  const [comment, setComment] = useState(booking.reviews?.comment || "");
  const [rating, setRating] = useState(booking.reviews?.rating || 0);
  const [isEditing, setIsEditing] = useState(false);
  const isReviewed = !!booking.reviews?.comment || booking.reviews?.rating > 0;

  const commentHandler = () => {
    booking.reviews = { rating, comment };
    onUpdate(booking);
    toast.success("Comment added successfully!");
    setIsEditing(false);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleRating = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl flex flex-col h-full min-h-[600px]">
      
      {/* Image Section */}
      <div className="relative h-48 sm:h-52 flex-shrink-0 overflow-hidden bg-gray-100">
        <img
          src={booking.homeId.img?.url || "https://via.placeholder.com/400x240?text=Property"}
          alt={booking.homeId.housename || 'Booked property'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-4 sm:p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
          {booking.homeId.housename || "Unnamed Property"}
        </h3>

        <div className="space-y-1 mb-3">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">Check-in:</span> {formatDate(booking.checkin)}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">Check-out:</span> {formatDate(booking.checkout)}
          </div>
        </div>

        <div className="flex items-baseline mb-4">
          <span className="text-xl font-bold text-orange-600">
            ₹{booking.homeId.price?.toLocaleString() || "—"}
          </span>
          <span className="text-xs text-gray-500 ml-1.5">/ night</span>
        </div>

        {/* Review Box */}
        <div className="flex-grow bg-gray-50 rounded-xl p-4 border border-gray-100 mb-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <span className="mr-2">⭐</span> Your Review
          </h4>
          
          {isReviewed && !isEditing ? (
            <div className="h-full">
              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-xl ${star <= rating ? 'text-orange-500' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 italic break-words line-clamp-3">
                &ldquo;{comment}&rdquo;
              </p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className={`text-2xl ${star <= rating ? 'text-orange-500' : 'text-gray-300'} transition-colors`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                placeholder="How was your stay?"
                className="w-full flex-grow min-h-[80px] p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none bg-white transition-all"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={150}
              />
            </div>
          )}
        </div>

        {/* Button Container - Forced side-by-side on all screens */}
        <div className="mt-auto flex flex-row gap-2 w-full">
          {isReviewed && !isEditing ? (
            <button
              onClick={handleEdit}
              className="flex-1 bg-white border border-orange-600 text-orange-600 text-sm py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={commentHandler}
              className="flex-1 bg-orange-600 text-white text-sm py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors shadow-sm"
            >
              Submit
            </button>
          )}
          
          <Link
            to={`/homedetails/${booking.homeId._id}`}
            className="flex-1 bg-gray-900 text-white text-center text-sm py-3 rounded-xl font-semibold hover:bg-black transition-colors shadow-sm"
          >
            Details
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PastBookingItem;