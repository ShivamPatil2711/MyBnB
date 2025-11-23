import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './AuthContext'; // Adjust path based on your project structure

const Favourite = ({ home, onDelete }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleDeleteFavourite = async () => {
    if (!isLoggedIn) {
      toast.error('Please log in to remove from favorites');
      navigate('/login-page');
      return;
    }

    try {
      const response = await fetch('http://localhost:4002/api/deletefavourite', {
        method: 'POST',
        credentials: 'include', // Include JWT cookie
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: home._id }),
      });

      const data = await response.json();

        toast.success(`Removed ${home.housename || 'home'} from favorites`);
      onDelete(home._id); // Call onDelete to update parent state
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-md border p-6 transition hover:-translate-y-1 hover:shadow-xl">
      <img
        src={"https://www.cvent.com/sites/default/files/image/2021-08/exterior%20view%20of%20the%20sign%20at%20the%20front%20of%20a%20hotel.jpg"}
        alt="Home image"
        className="w-full h-40 object-cover rounded-lg mb-4"
      />
  
      <div className="text-orange-700 text-base flex-1 flex flex-col">
        <p className="mb-1"><span className="font-semibold">Housename:</span> {home.housename}</p>
        <p className="mb-1"><span className="font-semibold">Location:</span> {home.location}</p>
        <p className="mb-1"><span className="font-semibold">Price:</span> ₹{home.price}</p>
        <p className="mb-1"><span className="font-semibold">Description:</span> {home.des}</p>
      </div>
  
      <div className="mt-auto flex justify-between items-center pt-4 ">
        <Link
          to={`/homedetails/${home._id}`}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition"
        >
          Details
        </Link>
        <button
          className="bg-gray-200 text-orange-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
          onClick={handleDeleteFavourite}
        >
          Delete Favourite
        </button>
      </div>
    </div>
  );
};

export default Favourite;