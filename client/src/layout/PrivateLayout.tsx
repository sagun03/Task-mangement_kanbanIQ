import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const PrivateLayout = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <div>
      <Navbar />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateLayout;
