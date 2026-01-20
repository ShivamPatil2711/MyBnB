import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContext';

const BookingForm = ({ homeId, onClose }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    checkin: '',
    checkout: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error('Please log in to book this home');
      navigate('/login-page');
      return;
    }

    // 🔥 DATE VALIDATION (ONLY ON SUBMIT)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkinDate = new Date(formData.checkin);
    const checkoutDate = new Date(formData.checkout);

    if (!formData.checkin || !formData.checkout) {
      toast.error('Check-in and check-out dates are required');
      return;
    }

    if (checkinDate < today) {
      toast.error('Check-in date must be today or later');
      return;
    }

    if (checkoutDate < checkinDate) {
      toast.error('Check-out date must be after or equal to check-in date');
      return;
    }

    // ✅ ONLY IF VALID → CALL BACKEND
    try {
      const response = await fetch('http://localhost:4003/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          homeId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Booking failed');
        return;
      }

      toast.success('Booking successful!');
      onClose();
      navigate('/bookings');

    } catch (err) {
      toast.error('An error occurred while booking. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Book Your Stay</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Check-in Date
          </label>
          <input
            type="date"
            name="checkin"
            value={formData.checkin}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Check-out Date
          </label>
          <input
            type="date"
            name="checkout"
            value={formData.checkout}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
