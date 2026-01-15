import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '',
    terms: false,
  });
  const [errorMessages, setErrorMessages] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://mybnb-f13q.onrender.com/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          FirstName: formData.FirstName,
          LastName: formData.LastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          userType: formData.userType,
          terms: formData.terms ? 'on' : '',
        }),
      });

      const data = await response.json();
      if (!response.ok || data.errorMessages) {
        setErrorMessages(data.errorMessages || ['An error occurred']);
        setShowErrors(true);
        setFormData((prev) => ({
          ...prev,
          password: '',
          confirmPassword: '',
        }));
        toast.error('Registration failed. Please check the errors.');
        return;
      }

      toast.success(data.message);
      navigate(data.redirect);
    } catch (error) {
      setErrorMessages(['An error occurred. Please try again later.']);
      setShowErrors(true);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <main className="container mx-auto mt-8 p-8 bg-white rounded-lg shadow-md max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800  pb-4">
        Create Your Account
      </h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        {showErrors && errorMessages.length > 0 && (
          <div
            id="error-alert"
            className="bg-orange-50 text-orange-800 border border-orange-300 p-6 rounded-lg mb-6 relative shadow-md"
            role="alert"
          >
            <h2 className="text-lg font-semibold text-orange-900 mb-3">Error:-</h2>
            <button
              type="button"
              onClick={() => setShowErrors(false)}
              className="absolute top-3 right-3 text-2xl font-bold text-orange-600 hover:text-orange-800 focus:outline-none transition-colors duration-200"
              aria-label="Close alert"
            >
              ×
            </button>
            <ul className="pl-6 list-disc">
              {errorMessages.map((error, idx) => (
                <li key={idx} className="text-sm">{error}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <input
                type="text"
                id="firstName"
                name="FirstName"
                placeholder="First Name"
                value={formData.FirstName}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                required
              />
            </div>
          </div>
          <div className="flex-1">
            <label htmlFor="LastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <input
                type="text"
                id="LastName"
                name="LastName"
                placeholder="Last Name"
                value={formData.LastName}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter Your Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              required
            />
          </div>
        </div>
        <div className="mb-5">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Your Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              required
            />
          </div>
        </div>
        <div className="mb-5 p-4 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">I want to register as:</p>
          <div className="flex space-x-6">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="userType"
                value="guest"
                id="guest"
                checked={formData.userType === 'guest'}
                onChange={handleChange}
                className="form-radio text-orange-500 focus:ring-orange-500"
              />
              <span className="ml-2">Guest</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="userType"
                value="host"
                id="host"
                checked={formData.userType === 'host'}
                onChange={handleChange}
                className="form-radio text-orange-500 focus:ring-orange-500"
              />
              <span className="ml-2">Host</span>
            </label>
          </div>
        </div>
        <div className="mb-6">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="terms"
              id="terms"
              checked={formData.terms}
              onChange={handleChange}
              className="form-checkbox text-orange-500 focus:ring-orange-500"
              required
            />
            <span className="ml-2 text-gray-700">
              I agree to the{' '}
              <a href="#" className="text-orange-500 hover:underline">
                terms and conditions
              </a>
            </span>
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 font-medium transition duration-300 flex items-center justify-center"
        >
          <span>Register</span>
          <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
        </button>
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <Link to="/login-page" className="text-orange-500 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
};

export default SignUp;