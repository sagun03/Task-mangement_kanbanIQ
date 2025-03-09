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
import CreateBoard from "./pages/Createboard";
import Myboards from "./pages/Myboards";
import Tasks from "./pages/Tasks";
import MyTasks from "./pages/Mytasks";

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

        {/* Update the dashboard routes section */}
        <Route
          path="/dashboard"
          element={<PrivateLayout />}
        >
          <Route index element={<Dashboard />} />
          <Route path="myboards" element={<Myboards />} />
          
          <Route path="tasks" element={<MyTasks />} />
          
        </Route>
        <Route path="/createtask" element={<Tasks />} />
        <Route path="/createboard" element={<CreateBoard />} />
        {/* Redirect to Home if Route not found */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
