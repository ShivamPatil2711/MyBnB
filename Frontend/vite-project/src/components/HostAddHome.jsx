import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './AuthContext';

const HostAddHome = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:4003';

  const [formData, setFormData] = useState({
    housename: '',
    street: '',
    city: '',
    pinCode: '',
    price: '',
    img: null,
    des: '',
  });

  const [loading, setLoading] = useState(false);
  const imgUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (imgUrlRef.current) {
        URL.revokeObjectURL(imgUrlRef.current);
        imgUrlRef.current = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        e.target.value = '';
        return;
      }
      if (imgUrlRef.current) {
        URL.revokeObjectURL(imgUrlRef.current);
      }
      imgUrlRef.current = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, img: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('Please log in to submit');
      navigate('/login-page');
      return;
    }

    const { housename, street, city, pinCode, price, des, img } = formData;
    if (!housename || !street || !city || !pinCode || !price || !des || !img) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('housename', housename);
      formDataToSend.append('street', street);
      formDataToSend.append('city', city);
      formDataToSend.append('pinCode', pinCode);
      formDataToSend.append('price', price);
      formDataToSend.append('des', des);
      formDataToSend.append('img', img);

      await fetch(`${backendApiUrl}/api/host/airbnb-home`, {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
      });

      toast.success('Home added successfully');
      navigate('/host/host-homes');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 font-bold text-xl animate-pulse">Submitting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-transparent to-gray-100 backdrop-blur-sm p-6">
      <div className="max-w-3xl w-full bg-white/40 backdrop-blur-lg border border-white/30 rounded-3xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-red-600 text-center mb-6">Register Your Home</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Home Name */}
          <div>
            <label className="block text-red-700 font-semibold mb-1">Home Name</label>
            <input
              type="text"
              name="housename"
              value={formData.housename}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border border-red-300 focus:ring-2 focus:ring-red-400"
              placeholder="Enter your home name"
              required
            />
          </div>

          {/* Address Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-red-700 font-semibold mb-1">Street Name</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-red-300 focus:ring-2 focus:ring-red-400"
                placeholder="Street Name"
                required
              />
            </div>

            <div>
              <label className="block text-red-700 font-semibold mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-red-300 focus:ring-2 focus:ring-red-400"
                placeholder="City"
                required
              />
            </div>

            <div>
              <label className="block text-red-700 font-semibold mb-1">Pin Code</label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-red-300 focus:ring-2 focus:ring-red-400"
                placeholder="Pin Code"
                required
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-red-700 font-semibold mb-1">Price (₹)</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-red-300 focus:ring-2 focus:ring-red-400"
              placeholder="Enter price"
              required
            />
          </div>

                   {/* Description */}
          <div>
            <label className="block text-red-700 font-semibold mb-1">Description</label>
            <textarea
              name="des"
              value={formData.des}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-red-300 focus:ring-2 focus:ring-red-400 resize-y"
              placeholder="Describe your home"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-red-700 font-semibold mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold
              file:bg-red-200 file:text-red-800 hover:file:bg-red-300"
              required
            />
            {formData.img && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Selected: {formData.img.name}</p>
                <img
                  src={imgUrlRef.current}
                  alt="Preview"
                  className="mt-2 h-36 rounded-lg object-cover border border-gray-200"
                />
              </div>
            
            )}
          </div>
      
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default HostAddHome;
