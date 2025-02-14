import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { styled } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#1976d2",
});

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <StyledAppBar position="static">
      <Container>
        <Toolbar>
          {/* Logo */}
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: "none", color: "white" }}>
            KanbanIQ
          </Typography>

          {/* Navigation Links */}
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" onClick={() => { logout(); navigate("/login"); }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Navbar;
