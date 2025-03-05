import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Dashboard from "../pages/Dashboard";

const PrivateLayout = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <div>
      <Dashboard/>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateLayout;
