import React, { useState, useEffect } from "react";

const BookedHomes = () => {
  const [bookedHomes, setBookedHomes] = useState([]);
const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:4003';

  useEffect(() => {
    const fetchBookedHomes = async () => {
      try {
        const response = await fetch(`${backendApiUrl}/api/host/booked-homes`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch booked homes");
        }

        const data = await response.json();
        setBookedHomes(data.bookedhomes || []);
      } catch (error) {
        console.error("Error fetching booked homes:", error);
      }
    };

    fetchBookedHomes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-10 lg:py-8">
        {/* Header */}
        <div className="mb-10 md:mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Booked Properties
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Overview of current and upcoming guest reservations
          </p>
        </div>

        {bookedHomes.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl bg-white px-8 py-14 text-center shadow-sm ring-1 ring-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-5 text-xl font-medium text-gray-900">No bookings yet</h3>
            <p className="mt-3 text-gray-600">
              Confirmed reservations will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {bookedHomes.map((booking) => (
              <div
                key={booking._id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl "
              >
                {/* Wider and relatively shorter image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                  <img
                    src={
                      booking.homeId.img?.url ||
                      "https://via.placeholder.com/640x360?text=Property"
                    }
                    alt={booking.homeId.housename || "Booked property"}
                    className="h-full w-full object-cover "
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-80" />
                </div>

                {/* Content – reduced vertical spacing */}
                <div className="flex flex-1 flex-col p-4 md:p-5">
                  <h2 className="line-clamp-1 text-lg font-semibold text-gray-900  md:text-xl">
                    {booking.homeId.housename || "Unnamed Property"}
                  </h2>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-orange-600 md:text-2xl">
                      ₹{booking.homeId.price?.toLocaleString() || "—"}
                    </span>
                    <span className="text-sm font-medium text-gray-500">/ night</span>
                  </div>

                  {/* Location */}
                  <div className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-600">
                    <svg
                      className="h-4 w-4 text-orange-600 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="font-medium text-gray-700 truncate">
                      {booking.homeId.city|| "Location not specified"}
                    </span>
                  </div>
                  {/* Guest info – tighter layout */}
                  <div className="mt-3 space-y-1.5 text-sm text-gray-700 border-t border-gray-100 pt-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800">Guest</span>
                      <span className="text-right truncate">{booking.name || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800">Email</span>
                      <span className="text-right truncate">{booking.email || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800">Check-in</span>
                      <span className="text-right">
                        {booking.checkin
                          ? new Date(booking.checkin).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800">Check-out</span>
                      <span className="text-right">
                        {booking.checkout
                          ? new Date(booking.checkout).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
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