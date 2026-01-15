import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './AuthContext';

const HostEditHome = () => {
  const { homeId } = useParams();
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    housename: '',
    location: '',
    price: '',
    rate: '',
    des: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please log in to access this page');
      navigate('/login-page');
      return;
    }

    const fetchHomeDetails = async () => {
      try {
        const response = await fetch(`https://mybnb-f13q.onrender.com/api/homes/${homeId}`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
           setFormData({
          housename: data.home.housename || '',
          location: data.home.location || '',
          price: data.home.price || '',
          rate: data.home.rate || '',
          des: data.home.des || '',
        });
        setLoading(false);
      } catch (err) {
        setLoading(false);
        toast.error('Error fetching home details');
      }
    };

    fetchHomeDetails();
  }, [homeId, isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('Please log in to submit');
      navigate('/login-page');
      return;
    }

    try {
      const response = await fetch('https://mybnb-f13q.onrender.com/api/host/edithome', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: homeId,
          ...formData,
        }),
      });

      const data = await response.json();
     toast.success('Home updated successfully');
      navigate('/host/host-homes');
    } catch (err) {
      toast.error('Error updating home');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-red-700 text-xl font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center border border-red-100 font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
        <h1 className="text-2xl font-bold text-red-600 mb-6">Edit Your Home</h1>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input type="hidden" name="id" value={homeId} />
          <div>
            <label htmlFor="housename" className="block font-semibold text-red-700 mb-1">
              Housename:
            </label>
            <input
              type="text"
              id="housename"
              name="housename"
              placeholder="Enter house name"
              value={formData.housename}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
          </div>
          <div>
            <label htmlFor="location" className="block font-semibold text-red-700 mb-1">
              Location:
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Enter Location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
          </div>
          <div>
            <label htmlFor="price" className="block font-semibold text-red-700 mb-1">
              Price:
            </label>
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*"     // Only allows digits
              id="price"
              name="price"
              placeholder="Enter price (₹)"
              value={formData.price}
              onChange={handleChange}
              min="0"
              required
              className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
          </div>
          <div>
            <label htmlFor="rate" className="block font-semibold text-red-700 mb-1">
              Rating:
            </label>
            <input
              type="number"
              id="rate"
              name="rate"
              placeholder="Enter rating (0-5)"
              value={formData.rate}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              required
              className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
          </div>
          <div>
            <label htmlFor="des" className="block font-semibold text-red-700 mb-1">
              Description:
            </label>
            <textarea
              id="des"
              name="des"
              placeholder="Enter Description"
              value={formData.des}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition min-h-[80px] resize-y"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-red-500 hover:bg-red-700 text-white rounded-lg font-semibold transition mt-2"
          >
            Edit Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default HostEditHome;