import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import PrivateLayout from "./layout/PrivateLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PublicLayout from "./layout/PublicLayout";
import AuthLayout from "./layout/AuthLayout";
import LandingPage from "./pages/Landing";
import Dashboard from "./pages/Dashboard";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <AuthLayout>
                <Login />
              </AuthLayout>
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <AuthLayout>
                <Signup />
              </AuthLayout>
            )
          }
        />

        {/* Private Routes */}
        <Route
          path="/"
          element={<PublicLayout />}
        >
          <Route index element={<LandingPage />} />
        </Route>

        <Route
          path="/dashboard"
          element={<PrivateLayout />}
        >
          <Route index element={<Dashboard />} />
        </Route>


        {/* Redirect to Home if Route not found */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
