import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, setUser: setAuthUser } = useContext(AuthContext);

  const handleLogout = async (e) => {
     e.preventDefault();
    try {
      const response = await fetch("https://api-mybnb-noss.onrender.com//api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensure the JWT cookie is sent
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || "Logged out successfully");
        setIsLoggedIn(false);
        setAuthUser(null);
        navigate("/"); // Navigate to home page after logout
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Clear frontend state even if the request fails, as the cookie may be invalid
      toast.success("Logged out successfully");
      setIsLoggedIn(false);
      setAuthUser(null);
      navigate("/");
    }
  };

  async function getData() {
    try {
      const response = await fetch("https://api-mybnb-noss.onrender.com//api/profile", {
        method: "GET",
        credentials: "include", // Include cookies for session authentication
      });
      const data = await response.json();
      setUser(data.user); // Access the 'user' object from the API response
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text">
            User Profile
          </h1>
        </div>
        {loading && (
          <p className="text-center text-gray-600 animate-pulse">Loading...</p>
        )}
     
        {user && !loading &&  (
          <div className="space-y-6">
            {/* User Info Card */}
            <div className=" bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Personal Information
              </h2>
              <p className="text-gray-600">
                <span className="font-medium">Name:</span>{" "}
                {user.FirstName} {user.LastName}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">User Type:</span> {user.userType}
              </p>
            </div>
            <button
              className="mt-4 w-60 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200"
              onClick={handleLogout}
            >
              LogOut
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;