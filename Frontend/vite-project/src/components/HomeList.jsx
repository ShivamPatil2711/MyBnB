import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Home from './Home';

const HomeList = () => {
  const [homes, setHomes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api-mybnb-noss.onrender.com/api/homes', {
          method: 'GET',
          credentials: 'include', // Include cookies for session authentication
        });
              const data = await response.json();
        setHomes(data.registeredhomes || []);
      } catch (error) {
        toast.error('Failed to load homes. Please try again.');
      }
    };
    fetchData();
  }, []); // Empty dependency array to run once on mount

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {homes.map((home) => (
          <Home key={home._id} home={home} />
        ))}
      </div>
    </div>
  );
};

export default HomeList;