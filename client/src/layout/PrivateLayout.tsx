import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";
import Navbar from "../components/Navbar";

// Lazy load the Sidebar and Navbar components

const PrivateLayout = ({ isSideBar = true }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <div>
      {/* Suspense wrapper for lazy-loaded components */}
     <Navbar isSideBar={isSideBar}/>

      <React.Suspense fallback={<CircularProgress />}>
        <Box
          sx={{
            flexGrow: 1,
            marginLeft: isSideBar ? "280px" : "none", // Adjust content width for the sidebar (sidebar width)
            padding: 2,
            transition: "margin-left 0.3s ease", // Smooth transition
          }}
        >
          {/* Outlet to render nested routes */}
          <Outlet />
        </Box>
      </React.Suspense>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateLayout;
