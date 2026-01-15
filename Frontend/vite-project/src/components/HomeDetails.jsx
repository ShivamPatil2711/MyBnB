import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './AuthContext'; // Adjust path based on your project structure
import BookingForm from './BookingForm'; // Import the new BookingForm component

const HomeDetails = () => {
  const { homeId } = useParams();
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [home, setHome] = useState(null);
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookForm, setShowBookForm] = useState(false); // State to control modal visibility

  // Dummy reviews data
  const dummyReviews = [
    {
      id: 1,
      author: 'Anjali Sharma',
      rating: 5,
      comment: 'Absolutely wonderful stay! The place was clean, cozy, and the host was very responsive.',
      date: 'July 15, 2025',
    },
    {
      id: 2,
      author: 'Rahul Verma',
      rating: 4,
      comment: 'Great location and amenities. Had a minor issue with Wi-Fi, but overall a pleasant experience.',
      date: 'July 10, 2025',
    },
    {
      id: 3,
      author: 'Priya Desai',
      rating: 5,
      comment: 'Loved the modern decor and the view! Perfect for a weekend getaway.',
      date: 'July 5, 2025',
    },
  ];

  useEffect(() => {
    const fetchHomeDetails = async () => {
      try {
        const response = await fetch(`https://api-mybnb-noss.onrender.com//api/homes/${homeId}`, {
          method: 'GET',
          credentials: 'include', // Include JWT cookie
        });

        const data = await response.json();
        setHome(data.home || null);
        setHost(data.host || null);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        toast.error(err.message);
      }
    };

    fetchHomeDetails();
  }, [homeId]);

  const handleBookClick = () => {
    if (!isLoggedIn) {
      toast.error('Please log in to book this home');
      navigate('/login-page');
      return;
    }
    setShowBookForm(true); // Show the booking modal
  };

  const handleCloseModal = () => {
    setShowBookForm(false); // Close the booking modal
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-2xl font-semibold text-orange-600 animate-pulse">Loading home details...</p>
      </div>
    );
  }

 // Validate latitude and longitude
  const hasValidCoordinates = home.latitude && home.longitude && !isNaN(home.latitude) && !isNaN(home.longitude);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto relative">
        {/* Image Section */}
        <div className="relative mb-8">
          <img
            src="https://www.cvent.com/sites/default/files/image/2021-08/exterior%20view%20of%20the%20sign%20at%20the%20front%20of%20a%20hotel.jpg"
            alt="Home image"
            className="w-full h-96 object-cover rounded-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
          <h1 className="absolute bottom-4 left-4 text-3xl font-bold text-white drop-shadow-lg">
            {home.housename || 'N/A'}
          </h1>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Property Details</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-medium">Housename:</span> {home.housename || 'N/A'}
              </p>
              <p>
                <span className="font-medium">Location:</span> {home.location || 'N/A'}
              </p>
              <p>
                <span className="font-medium">Price:</span> ₹{home.price?.toLocaleString() || 'N/A'}
              </p>
              <p>
                <span className="font-medium">Description:</span> {home.des || 'No description available'}
              </p>
              <p>
                <span className="font-medium">Longitude:</span> {home.longitude || 'No description available'}
              </p>
              <p>
                <span className="font-medium">Latitude:</span> {home.latitude || 'No description available'}
              </p>
              <div className="flex items-center">
                <span className="text-orange-500 mr-2">★</span>
                <span className="font-medium">{home.rate ? `${home.rate}/5` : 'N/A'}</span>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Host Information</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-medium">Host:</span> {host?.FirstName || 'N/A'} {host?.LastName || ''}
              </p>
              <p>
                <span className="font-medium">Email:</span> {host?.email || 'N/A'}
              </p>
              <div className="mt-20">
                <button
                  onClick={handleBookClick}
                  className="bg-orange-500 text-white font-semibold  rounded-lg py-3 px-6 hover:bg-orange-600 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        {hasValidCoordinates ? (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Location Map</h2>
            <div className="h-96 w-full rounded-lg overflow-hidden border-2 border-gray-300">
              <iframe
                src={`https://www.google.com/maps?q=${home.latitude},${home.longitude}&z=15&output=embed`}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Property Location"
              ></iframe>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Location Map</h2>
            <p className="text-gray-600">No valid location data available to display the map.</p>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Guest Reviews</h2>
          <div className="space-y-6">
            {dummyReviews.map((review) => (
              <div key={review.id} className="border-l-4 border-orange-500 pl-4 py-2 bg-gray-50 rounded-lg">
           <div className="flex items-center justify-between">
              <p className="font-medium text-gray-800">{review.author}</p>
         <div className="flex items-center">
               {[...Array(review.rating)].map((_, i) => (
            <span key={i} className="text-orange-500">★</span>
                    ))}
                </div>
                </div>
          <p className="text-gray-600 mt-1">{review.comment}</p>
             <p className="text-sm text-gray-500 mt-1">{review.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Modal */}
        {showBookForm && (
          <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
              <BookingForm homeId={homeId} onClose={handleCloseModal} />
            </div>
             </div>
           )}
      </div>
            </div>
  );
};

export default HomeDetails;