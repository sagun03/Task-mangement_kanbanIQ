import type React from "react"
import { AppBar, Box, Button, Card, CardContent, Container, Grid, Toolbar, Typography } from "@mui/material"
import { MdPerson, MdDragIndicator } from "react-icons/md"
import { FaDatabase, FaGithub, FaLayerGroup, FaLinkedin, FaTwitter } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const LandingPage: React.FC = () => {

    const navStyle = { fontWeight: "600" }
    const iconStyle = { fontSize: "24px", marginRight: "8px" }
    const navigate = useNavigate();
    const toSignup = () => {
        navigate("/signup");
    }
    const toLogin = () => {
        navigate("/login");
    }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navigation Bar */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
              <FaLayerGroup style={{ marginRight: "10px" }} />
              KanbanIQ
            </Typography>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, flexGrow: 1, justifyContent: "center" }}>
            <Button color="inherit" style={navStyle}>Features</Button>
            <Button color="inherit" style={navStyle}>Demo</Button>
            <Button color="inherit" style={navStyle}>Pricing</Button>
            <Button color="inherit" style={navStyle}>Contact</Button>
          </Box>

          <Box>
            <Button color="inherit" onClick={toLogin}>Login</Button>
            <Button
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "black",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                },
                borderRadius: 0,
              }}
              onClick={toSignup}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 8, mb: 8 }}>
        <Typography variant="h2" component="h1" sx={{ fontWeight: "bold", mb: 2 }}>
          Manage Tasks with Intelligence
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4 }}>
          KanbanIQ combines AI-powered insights with intuitive task management to supercharge your team's productivity
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "black",
            color: "white",
            px: 3,
            py: 1.5,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
            },
            borderRadius: 0,
          }}
        >
          Get Started for Free
        </Button>

        {/* Placeholder for Animation */}
        <Box
          sx={{
            mt: 6,
            height: 250,
            backgroundColor: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            AI-powered Task Management Animation
          </Typography>
        </Box>
      </Container>

      {/* Features Section */}
      <Container maxWidth="md" sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: "bold", textAlign: "center", mb: 6 }}>
          Core Features
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", border: "1px solid #eee", boxShadow: "none", borderRadius: 0 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                    <MdPerson style={iconStyle} />
                    User Authentication
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Secure role-based access control and user management
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", border: "1px solid #eee", boxShadow: "none", borderRadius: 0 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <MdDragIndicator style={iconStyle} />
                  <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                    Drag-and-Drop
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Intuitive task management with drag-and-drop functionality
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", border: "1px solid #eee", boxShadow: "none", borderRadius: 0 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <FaDatabase style={iconStyle} />
                  <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                    CRUD Operations
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Seamlessly create, read, update and delete tasks and boards
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer Section */}
      <Box sx={{ bgcolor: "black", color: "white", pt: 6, pb: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={0}>
            {/* Logo and Description */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <FaLayerGroup style={{ fontSize: "26px", color: "white", marginRight: "10px" }} />
                <Typography variant="h6" sx={{ color: "white" }}>
                  KanbanIQ
                </Typography>
              </Box>
            </Grid>

            {/* Product Links */}
            <Grid item xs={12} sm={6} md={3} sx={{ justifyContent: "center" }}>
              
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {["Features", "Pricing", "API"].map((item) => (
                  <Button
                    key={item}
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      justifyContent: "flex-start",
                      p: 0,
                      "&:hover": { color: "white" },
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Box>
            </Grid>

            {/* Company Links */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {["About", "Blog", "Careers"].map((item) => (
                  <Button
                    key={item}
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      justifyContent: "flex-start",
                      p: 0,
                      "&:hover": { color: "white" },
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Box>
            </Grid>

            {/* Legal Links */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {["Privacy", "Terms", "Security"].map((item) => (
                  <Button
                    key={item}
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      justifyContent: "flex-start",
                      p: 0,
                      "&:hover": { color: "white" },
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Box>
            </Grid>
          </Grid>

          {/* Bottom Section */}
          <Box
            sx={{
              mt: 8,
              pt: 4,
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
              © 2025 KanbanIQ. All rights reserved.
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              {[FaTwitter, FaGithub, FaLinkedin].map((Icon, index) => (
                <Button
                  key={index}
                  sx={{
                    minWidth: "auto",
                    p: 1,
                    color: "rgba(255, 255, 255, 0.7)",
                    "&:hover": { color: "white" },
                  }}
                >
                  <Icon size={20} />
                </Button>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default LandingPage