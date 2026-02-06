import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser: setAuthUser } = useContext(AuthContext);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4003/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Logged out successfully");
      } else {
        toast.error(data.error || "Logout failed");
      }
    } catch (error) {
      toast.success("Logged out successfully");
    } finally {
      setIsLoggedIn(false);
      setAuthUser(null);
      navigate("/");
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch("http://localhost:4003/api/profile", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8 py-10 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-lg border border-gray-200 p-6 sm:p-8 lg:p-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Profile
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Manage your account information
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-gray-600">Loading profile...</p>
          </div>
        )}

        {/* Profile Content */}
        {!loading && user && (
          <div className="space-y-8">
            
            {/* Profile Card */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-7 border border-gray-200 space-y-5">
              <div className="flex flex-row justify-between ">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {user.FirstName} {user.LastName}
                  </p>
                </div>

   <span className="inline-block h-8 leading-8 text-center text-sm font-medium bg-orange-100 text-orange-600 px-3 rounded-full">
  {user.userType}
</span>

              </div>

              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="text-base font-medium text-gray-700">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Logout
              </button>

              <button
                onClick={() =>navigate("/")}
                className="w-full sm:w-auto flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Go Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
