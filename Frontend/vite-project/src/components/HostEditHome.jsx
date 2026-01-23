import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './AuthContext';

const HostEditHome = () => {
  const { homeId } = useParams();
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:4003';

  const [formData, setFormData] = useState({
    housename: '',
    street: '',
    city: '',
    pinCode: '',
    price: '',
    des: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please log in to access this page');
      navigate('/login-page');
      return;
    }

    const fetchHomeDetails = async () => {
      try {
        const response = await fetch(`${backendApiUrl}/api/homes/${homeId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch home');
        }

        const data = await response.json();
        const home = data.home || {};

        setFormData({
          housename: home.housename || '',
          street: home.street || '',
          city: home.city || '',
          pinCode: home.pinCode || '',
          price: home.price || '',
          des: home.des || '',
        });

        if (home.img?.url) {
          setExistingImage(home.img.url);
          setImagePreview(home.img.url);
        }

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formDataToSend = new FormData();

    // 🔑 VERY IMPORTANT
    formDataToSend.append('id', homeId);
    formDataToSend.append('housename', formData.housename);
    formDataToSend.append('street', formData.street);
    formDataToSend.append('city', formData.city);
    formDataToSend.append('pinCode', formData.pinCode);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('des', formData.des);

    if (imageFile) {
      formDataToSend.append('img', imageFile);
    }
    const response = await fetch(
      `${backendApiUrl}/api/host/edithome`,
      {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend, // ✅ THIS IS THE FIX
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Update failed');
    }

    toast.success('Home updated successfully');
    navigate('/host/host-homes');
  } catch (err) {
    toast.error(err.message || 'Error updating home');
  }
};


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-orange-600 rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-700">Loading home details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Edit Property
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Update details of your listed home
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
            {/* Image Section */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-800">
                Property Image
              </label>

              <div className="flex flex-col items-center gap-5">
                <div className="w-full max-w-2xl aspect-[16/10] overflow-hidden rounded-xl border border-gray-200 shadow-md bg-gray-50">
                  <img
                    src={
                      imagePreview ||
                      existingImage ||
                      'https://via.placeholder.com/800x500?text=Property+Image'
                    }
                    alt="Property preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <label className="cursor-pointer inline-flex items-center px-6 py-3 bg-orange-50 hover:bg-orange-100 text-orange-700 font-medium rounded-lg border border-orange-200 transition-colors">
                  {imagePreview ? 'Change Image' : 'Upload New Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                <p className="text-sm text-gray-500">
                  Recommended: JPG, PNG — 800×500 px or larger
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="housename" className="block text-sm font-medium text-gray-700 mb-1.5">
                  House Name *
                </label>
                <input
                  type="text"
                  id="housename"
                  name="housename"
                  value={formData.housename}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="Enter house name"
                />
              </div>

              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Street *
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="Street address"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="City name"
                />
              </div>

              <div>
                <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700 mb-1.5">
                  PIN Code *
                </label>
                <input
                  type="text"
                  id="pinCode"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{6}"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="6-digit PIN code"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Price per Night (₹) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="Enter price"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="des" className="block text-sm font-medium text-gray-700 mb-1.5">
                Description *
              </label>
              <textarea
                id="des"
                name="des"
                value={formData.des}
                onChange={handleChange}
                rows={5}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-y"
                placeholder="Describe your property in detail..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 py-3.5 px-8 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition"
              >
                Update Property
              </button>

              <button
                type="button"
                onClick={() => navigate('/host/host-homes')}
                className="flex-1 py-3.5 px-8 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HostEditHome;