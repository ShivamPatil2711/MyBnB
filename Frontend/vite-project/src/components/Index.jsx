import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Home from './Home';
import IndexHome from './IndexHome';

const Index = () => {
  const [homes, setHomes] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://mybnb-f13q.onrender.com/api/homes', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      setHomes(data.registeredhomes || []);
    } catch (error) {
      toast.error('Failed to load homes. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {loading ? (
      <p className=" text-2xl text-center">Loading homes...</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {homes.map((home) => (
          <IndexHome key={home._id} home={home} />
        ))}
      </div>
    )}
  </div>
);

};

export default Index;