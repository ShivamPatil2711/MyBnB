import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContext';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { setIsLoggedIn, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4002/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      });
if(response.ok){
      const data = await response.json();
      toast.success(data.message);
      setIsLoggedIn(true);
      setUser(data.user);
      setEmail('');
      setPassword('');
      navigate("/");
}
else {
        const errorData = await response.json();
        toast.error(errorData.error || 'LogIn failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="absolute top-24 text-3xl font-bold text-orange-500 tracking-wide animate-fade-in">
        Welcome Back!
      </h1>
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xs text-center border mt-20 hover:-translate-y-1 hover:shadow-xl flex flex-col">
         <form onSubmit={handleSubmit} id="loginForm" className="space-y-4">
          <div className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />
            <button
              type="submit"
              className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition"
            >
              Login
            </button>
            <div className="mt-4 text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-orange-500 hover:text-orange-700 font-semibold">
                Create one now
              </Link>
            </div>
          </div>
        </form>
      </div>
      <style>
        {`
          @keyframes fade-in {
            from { 
              opacity: 0; 
              transform: translateY(-20px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.8s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Login;