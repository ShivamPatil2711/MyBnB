import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Favourite from './Favourite';
const FavouriteList = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [favouriteHomes, setFavouriteHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchFavourites = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('https://api-mybnb-noss.onrender.com//api/favourite-list', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        setFavouriteHomes(data.favouriteHomes || []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFavourites();
  }, [isLoggedIn]);

  const handleDeleteFavourite = (homeId) => {
    setFavouriteHomes(prev => prev.filter(h => h._id !== homeId));
  };

  if (!isLoggedIn) return <Navigate to="/login-page" replace />;
  if (loading) return <div className="text-center py-8">Loading favorites…</div>;
  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Favourite Homes</h1>
      {favouriteHomes.length === 0 ? (
        <p className="text-gray-600">No favorite homes added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favouriteHomes.map(home => (
            <Favourite
              key={home._id}
              home={home}
              onDelete={() => handleDeleteFavourite(home._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouriteList;
