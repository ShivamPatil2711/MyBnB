import React, { useState, useEffect } from "react";

const BookedHomes = () => {
  const [bookedHomes, setBookedHomes] = useState([]);

  useEffect(() => {
    const fetchBookedHomes = async () => {
      try {
        const response = await fetch(
          "https://api-mybnb-noss.onrender.com//api/host/booked-homes",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch booked homes");
        }

        const data = await response.json();
        setBookedHomes(data.bookedhomes);
      } catch (error) {
        console.error("Error fetching booked homes:", error);
      }
    };

    fetchBookedHomes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/70 px-5 py-10 md:px-8 lg:px-12 xl:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Booked Properties
          </h1>
          <p className="mt-3 text-gray-600">
            Overview of current and upcoming guest reservations
          </p>
        </div>

        {bookedHomes.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl bg-white px-8 py-14 text-center shadow-sm ring-1 ring-gray-200/70">
            <h3 className="text-xl font-medium text-gray-800">No bookings yet</h3>
            <p className="mt-3 text-gray-600">
              Confirmed reservations will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
            {bookedHomes.map((booking) => (
              <div
                key={booking._id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/30"
              >
                {/* Image */}
                <div className="relative aspect-[5/3] overflow-hidden bg-gray-100">
                  <img
                    src={booking.homeId.img}
                    alt={booking.homeId.housename}
                    className="h-full w-full object-cover "
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-75" />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="line-clamp-2 text-xl font-semibold text-gray-900 group-hover:text-orange-700">
                    {booking.homeId.housename}
                  </h2>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-orange-600">
                      ₹{booking.homeId.price}
                    </span>
                    <span className="text-sm font-medium text-gray-500">/ night</span>
                  </div>
   <div className="mt-2 flex justify-between">
    <span className="font-medium text-gray-800">Location</span>
    <span className="text-right truncate">{booking.homeId.location}</span>
  </div>


                  <div className="mt-5 space-y-2.5 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800">Guest</span>
                      <span className="text-right">{booking.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800">Email</span>
                      <span className="truncate text-right">{booking.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800">Check-in</span>
                      <span>
                        {new Date(booking.checkin).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800">Check-out</span>
                      <span>
                        {new Date(booking.checkout).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookedHomes;