import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Link} from"react-router-dom"
const IndexHome = ({ home }) => {
  const handleBookClick = (housename) => {
    toast.success(`Booking initiated for ${housename || 'home'}!`, {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'colored',
    });
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
          <span className="font-semibold">Housename:</span> {home.housename || 'N/A'}
        </p>
          <p className="mb-1">
          <span className="font-semibold">Location:</span> {home.location}
        </p>
        <p className="mb-1">
          <span className="font-semibold">Price:</span> ₹{home.price}
        </p>
        <p className="mb-1">
          <span className="font-semibold">Description:</span> {home.des || 'No description available'}
        </p>
      </div>
      <div className="flex justify-center items-center w-full mt-4">
<Link
  to={`/homedetails/${home._id}`}
  className="inline-block px-4 py-2 bg-orange-600 text-white font-medium rounded-md "
>
See Details</Link>
      </div>
    </div>
  );
};

export default IndexHome;