import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './AuthContext';
import BookingForm from './BookingForm';
import { FaStar } from 'react-icons/fa';
import { FaMapMarkerAlt } from 'react-icons/fa';
const HomeDetails = () => {
  const { homeId } = useParams();
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [home, setHome] = useState(null);
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookForm, setShowBookForm] = useState(false);
const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:4003';
const [dummyReviews,setdummyReviews]=useState([]);
  
  

  useEffect(() => {
    const fetchHomeDetails = async () => {
      try {
        const response = await fetch(
          `${backendApiUrl}/api/homes/${homeId}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch home details');
        }

        const data = await response.json();
        setHome(data.home || null);
        setHost(data.host || null);
        setdummyReviews(data.reviews || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        toast.error(err.message || 'Error loading home details');
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
    setShowBookForm(true);
  };

  const handleCloseModal = () => {
    setShowBookForm(false);
  };

  const handleEmailHost = () => {
    if (!host?.email) {
      toast.error('Host email not available');
      return;
    }
    const subject = encodeURIComponent(
      `Inquiry about ${home?.housename || 'your property'}`
    );
    const body = encodeURIComponent(
      `Hello ${host.FirstName || ''},\n\nI am interested in booking your property.\n\nThank you!`
    );
    window.location.href = `mailto:${host.email}?subject=${subject}&body=${body}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-orange-600 rounded-full animate-spin" />
          <p className="text-lg font-medium text-gray-600">
            Loading property details...
          </p>
        </div>
      </div>
    );
  }

  if (!home) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-semibold text-gray-600">
          Property not found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12 space-y-12">
        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl">
       <div className=" w-full h-full  flex items-center justify-center">
  <img
    src={home.img?.url}
    alt={home.housename}
    className="max-h-full max-w-full object-contain"
  />
</div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white space-y-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
              {home.housename}
            </h1>
        <div className="flex items-center gap-2 sm:gap-3 text-white text-base sm:text-lg md:text-xl mb-3 md:mb-4">
  <FaMapMarkerAlt className="text-orange-500 text-lg sm:text-xl flex-shrink-0" />
  <span className="font-medium truncate">
    {home.city || 'Unknown City'}
  </span>
</div>

          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left */}
          <div className="lg:col-span-2 space-y-12">
            {/* Property Details */}
            <section className="bg-white rounded-2xl shadow-md p-10 space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Property Details
              </h2>

              <div className="space-y-6 text-gray-700">
                <DetailRow label="House Name" value={home.housename} />
                <DetailRow
                  label="Address"
                  value={`${home.street || ''}, ${home.city || ''}, ${home.pinCode}`}
                />
                <DetailRow
                  label="Price"
                  value={
                    <span className="text-xl font-bold text-orange-600">
                      ₹{home.price?.toLocaleString()} / night
                    </span>
                  }
                />
                <DetailRow
                  label="Description"
                  value={
                    <p className="leading-relaxed text-gray-600">
                      {home.des || 'No description available'}
                    </p>
                  }
                />
                <DetailRow
                  label="Rating"
                  value={
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-xl ${
                            i < Math.round(home.rate || 4)
                              ? 'text-orange-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  }
                />
              </div>
            </section>

            {/* Reviews */}
            <section className="bg-white rounded-2xl shadow-md p-10 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Guest Reviews
              </h2>

              <div className="space-y-8">
  {dummyReviews.map((review) => (
    <div
      className="bg-gray-50 rounded-xl p-6 space-y-3 border-l-4 border-orange-500 overflow-hidden"
    >
      <div className="flex items-center justify-between gap-4">
        <h4 className="font-semibold text-gray-900 truncate">
          {review.guestName||  'Anonymous'}
        </h4>
        <div className="flex gap-1 flex-shrink-0">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`${
                i < review.rating ? 'text-orange-500' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* FIXED SECTION BELOW */}
      <p className="text-gray-700 leading-relaxed break-words whitespace-pre-wrap">
        {review.comment}
      </p>
      
     <p className="text-sm text-gray-500">
  {review.date 
    ? new Date(review.date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : 'No date provided'}
</p>
    </div>
  ))}
</div>
            </section>
          </div>

          {/* Right / Sidebar */}
          <div className="space-y-8 lg:sticky lg:top-10">
            <section className="bg-white rounded-2xl shadow-md p-8 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Host Information
              </h2>

              <div className="space-y-3 text-gray-700">
                <p>
                  <span className="font-semibold">Name:</span>{' '}
                  {host?.FirstName} {host?.LastName}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{' '}
                  {host?.email}
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <button
                  onClick={handleBookClick}
                  className="w-full bg-orange-600 text-white py-4 rounded-xl font-semibold hover:bg-orange-700 transition"
                >
                  Book Now
                </button>

                {host?.email && (
                  <button
                    onClick={handleEmailHost}
                    className="w-full bg-gray-100 text-gray-800 py-4 rounded-xl font-semibold hover:bg-gray-200 transition"
                  >
                    Email Host
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg relative p-6">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-2xl font-bold text-gray-600"
              >
                ×
              </button>
              <BookingForm homeId={homeId} onClose={handleCloseModal} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
    <span className="font-semibold text-gray-800 min-w-[140px]">
      {label}
    </span>
    <div className="text-gray-600">{value}</div>
  </div>
);

export default HomeDetails;
