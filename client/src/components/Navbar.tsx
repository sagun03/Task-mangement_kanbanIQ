import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  InputBase,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaLayerGroup } from "react-icons/fa";
import {
  MdSearch,
  MdNotifications,
  MdHome,
  MdTimeline,
  MdFormatListBulleted,
  MdGroups,
  MdLogout,
} from "react-icons/md";
import { useState } from "react";

// Styled SearchBar component
const drawerWidth = 280;

const navStyle = { fontWeight: "600" };

const StyledDrawer = styled(Drawer)({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    backgroundColor: "#f8fafa",
    boxShadow: "0px 0 6px -2px rgba(0, 0, 0, 0.1)",
  },
});

const SearchBar = styled(Paper)(({ theme }) => ({
  padding: "2px 4px",
  display: "flex",
  alignItems: "center",
  width: "100%",
  maxWidth: 400,
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  boxShadow: "none",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
  },
}));

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Open & Close Dropdown
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Logout Function
  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/login");
  };

  const isHomePage = location.pathname === "/";

console.log("isAuthenticated", isAuthenticated)
  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar: Only show when authenticated */}
      {(isAuthenticated || !isHomePage) && (
        <StyledDrawer variant="permanent">
          <Box sx={{ p: 2 }}>
            <Typography sx={{ mb: 4, color: "#0e182b" }}>
              <ListItemButton>
                <ListItemIcon>
                  <FaLayerGroup
                    style={{ color: "#0e182b", fontSize: "26px" }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="KanbanIQ"
                  primaryTypographyProps={{ style: { fontSize: "26px" } }}
                />
              </ListItemButton>
            </Typography>
            <List>
              <ListItemButton selected>
                <ListItemIcon>
                  <MdHome style={{ color: "#0e182b", fontSize: "24px" }} />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <MdTimeline style={{ color: "#0e182b", fontSize: "24px" }} />
                </ListItemIcon>
                <ListItemText primary="My Boards" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <MdFormatListBulleted
                    style={{ color: "#0e182b", fontSize: "24px" }}
                  />
                </ListItemIcon>
                <ListItemText primary="Tasks" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <MdGroups style={{ color: "#0e182b", fontSize: "24px" }} />
                </ListItemIcon>
                <ListItemText primary="Team Collaboration" />
              </ListItemButton>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <MdLogout style={{ color: "#0e182b", fontSize: "24px" }} />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          </Box>
        </StyledDrawer>
      )}

      {/* Header: Always show the AppBar */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          color="transparent"
          sx={{ borderBottom: "2px solid #F5F5F5" }}
          elevation={0}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Show Logo only when NOT authenticated */}
            {(!isAuthenticated  || isHomePage) && (
              <>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FaLayerGroup style={{ marginRight: "10px" }} />
                  KanbanIQ
                </Typography>
              </>
            )}

            {/* Show Search, Notifications & Avatar when logged in */}
            {(isAuthenticated || !isHomePage) && (
              <>
                <SearchBar>
                  <InputBase
                    sx={{ ml: 1, flex: 1, color: "#0e182b" }}
                    placeholder="Search tasks, boards..."
                    inputProps={{ "aria-label": "search" }}
                  />
                  <IconButton type="button" aria-label="search">
                    <MdSearch style={{ color: "#0e182b" }} />
                  </IconButton>
                </SearchBar>
              </>
            )}

            {/* Authenticated User View */}
            {isAuthenticated && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton color="inherit">
                  <MdNotifications size={28} />
                </IconButton>
                <Typography
                  style={{ cursor: "pointer" }}
                  onClick={handleMenuOpen}
                  variant="body1"
                >
                  {user?.name || user?.email}
                </Typography>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/settings")}>
                    Settings
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box>
            )}
            {!isAuthenticated && (
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  gap: 2,
                  flexGrow: 1,
                  justifyContent: "center",
                }}
              >
                <Button color="inherit" style={navStyle}>
                  Features
                </Button>
                <Button color="inherit" style={navStyle}>
                  Demo
                </Button>
                <Button color="inherit" style={navStyle}>
                  Pricing
                </Button>
                <Button color="inherit" style={navStyle}>
                  Contact
                </Button>
              </Box>
            )}

            {/* Unauthenticated View */}
            {!isAuthenticated && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button color="inherit" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
                    borderRadius: 0,
                  }}
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </Box>
  );
};

export default Navbar;
