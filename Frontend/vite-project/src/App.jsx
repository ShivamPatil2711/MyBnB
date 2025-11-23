import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, AuthContext } from './components/AuthContext';
import Layout from "./components/Layout";
import ErrorPage from "./components/ErrorPage";
import Bookings from "./components/Bookings";
import HostAddHome from "./components/HostAddHome";
import FavouriteList from "./components/FavouriteList";
import HostHomes from "./components/HostHomes";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import HomeList from "./components/HomeList";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./components/Index";
import HomeDetails from "./components/HomeDetails";
import HostEditHome from "./components/HostEditHome";
import Profile from "./components/Profile";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Index /> }, // Public route
        {
          path: "/bookings",
          element: (
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          ),
        },
        {
          path: "/homes",
          element: (
            <ProtectedRoute>
              <HomeList />
            </ProtectedRoute>
          ),
        },
           {
          path: "/homedetails/:homeId",
          element: (
            <ProtectedRoute>
              <HomeDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "/favourite-list",
          element: (
            <ProtectedRoute>
              <FavouriteList />
            </ProtectedRoute>
          ),
        },
        {
          path: "/host/airbnb-home",
          element: (
            <ProtectedRoute>
              <HostAddHome />
            </ProtectedRoute>
          ),
        },
           {
          path: "/host/edit-home/:homeId",
          element: (
            <ProtectedRoute>
              <HostEditHome />
            </ProtectedRoute>
          ),
        },
        {
          path: "/host/host-homes",
          element: (
            <ProtectedRoute>
              <HostHomes />
            </ProtectedRoute>
          ),
        },
             {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        { path: "/signup", element: <SignUp /> }, // Public route
        { path: "/login-page", element: <Login /> }, // Public route
      ],
    },
    { path: "*", element: <ErrorPage /> },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;