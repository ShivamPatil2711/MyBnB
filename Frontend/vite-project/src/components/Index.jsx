import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import IndexHome from './IndexHome';

const Index = () => {
  const [homes, setHomes] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:4003';

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const response = await fetch(`${backendApiUrl}/api/homes`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch homes');
        }

        const data = await response.json();

        setHomes(data.registeredhomes || []);
        setFavourites((data.favourites || []).map(id => id.toString()));
        setIsLoggedIn(!!data.isLoggedIn);
        setUserRole(data.user?.userType || null);
      } catch (err) {
        console.error(err);
        setError('Failed to load homes');
        toast.error('Failed to load homes');
      } finally {
        setLoading(false);
      }
    };

    fetchHomes();
  }, []);

  const addToFavourite = async (homeId) => {
    const isAlreadyFav = favourites.includes(homeId);

    try {
      const url = isAlreadyFav
        ? 'http://localhost:4003/api/deletefavourite'
        : 'http://localhost:4003/api/favourites';

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: homeId }),
      });

      if (!response.ok) {
        throw new Error('Favourite update failed');
      }

      setFavourites((prev) =>
        isAlreadyFav
          ? prev.filter((id) => id !== homeId)
          : [...prev, homeId]
      );

    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Explore Properties</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {homes.map((home) => (
          <IndexHome
            key={home._id}
            home={home}
            isFavorited={favourites.includes(home._id)}
            addToFavourite={addToFavourite}
            showHeart={isLoggedIn && userRole === 'guest'} // 👈 IMPORTANT
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
