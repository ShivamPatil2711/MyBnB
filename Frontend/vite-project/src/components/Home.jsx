import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './AuthContext'; // Adjust path based on your project structure
const Home = ({ home }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleAddToFavourites = async () => {
    if (!isLoggedIn) {
      toast.error('Please log in to add to favorites');
      navigate('/login-page');
      return;
    }

    try {
      const response = await fetch('https://api-mybnb-noss.onrender.com//api/favourites', {
        method: 'POST',
        credentials: 'include', // Include JWT cookie
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: home._id }),
      });

      const data = await response.json();

         toast.success(`Added ${home.housename} to favorites`);
    } catch (err) {
      console.error('Error adding to favorites:', err);
      toast.error(err.message);
    }
    navigate("/favourite-list");
  };
 return (
    <div className="bg-white rounded-xl shadow-md border flex flex-col items-center p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <img
        src={home.img || "https://www.cvent.com/sites/default/files/image/2021-08/default-home.jpg"}
        alt={home.housename}
        className="w-full h-40 object-cover rounded-lg mb-4 border-b-2 border-orange-500"
      />
      <div className="text-orange-700 text-base flex flex-col w-full">
        <p className="mb-1">
          <span className="font-semibold">Housename:</span> {home.housename}
        </p>
        <p className="mb-1">
          <span className="font-semibold">Location:</span> {home.location}
        </p>
        <p className="mb-1">
          <span className="font-semibold">Price:</span> ₹{home.price}
        </p>
         <p className="mb-1">
          <span className="font-semibold">Des:</span> ₹{home.des}
        </p>
        <div className="flex items-center mb-2">
          <span className="text-orange-500 mr-1">★</span>
          <span>{home.rate}/5</span>
        </div>
      </div>
      <div className="flex justify-between items-center w-full mt-4">
        <Link
          to={`/homedetails/${home._id}`}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200 text-center"
                >
          Details
        </Link>
        <button
          className="bg-gray-200 text-orange-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
          onClick={handleAddToFavourites}
        >
          Favourite
        </button>
      </div>
    </div>
  );
};
export default Home;

