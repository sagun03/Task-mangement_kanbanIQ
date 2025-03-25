/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Button as MUIButton,
  Container,
  Box,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import { ArrowRight, CheckCircle } from "lucide-react";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { FaLayerGroup } from "react-icons/fa";

// Styled components for Material-UI
const HeroSection = styled(Box)`
  position: relative;
  background: linear-gradient(to top right, #f0f4fa, #ffffff);
  text-align: left;
  min-height: 90vh; // Increased for better spacing
  display: flex;
  align-items: center; // Center vertically
  padding: 2rem 0; // Add padding top/bottom
`;
const KanbanCard = styled(Box)`
  position: relative;
  width: 450px; // Fixed width
  height: 320px; // Fixed height
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  @media (max-width: 900px) {
    display: none; // Hide on mobile devices
  }
`;
const Overlay = styled(Box)`
  position: absolute;
  inset: 0;
background: linear-gradient(to top right, rgba(32, 150, 243, 0.2), #ffffff);
`;

const AssistantCard = styled(Box)`
  position: absolute;
  bottom: -16px;
  right: -16px;
  padding: 16px 24px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  background: #ffffff;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
  
  @media (max-width: 900px) {
    display: none; // Hide on mobile devices
  }
`;

const AiBadge = styled(Box)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e9effd;
  color: #2562ea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;
const fadeInScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.3 } },
};

const Section = styled(Box)({
  padding: { xs: "3rem", md: "6rem" }, // Responsive padding
  backgroundColor: "#F5F8FA",
  minHeight: "80vh",
});

const FeatureCard = styled(Box)({
  padding: "1.5rem",
  backgroundColor: "#fff",
  width: "100%", // Changed from fixed 450px
  maxWidth: "450px", // Added maxWidth
  borderRadius: "20px",
  minHeight: "150px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0, 0, 2, 0.20)",
    transform: "scale(1.02)",
  },
});

const FeatureIcon = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  backgroundColor: "rgba(33, 150, 243, 0.1)", // Adjust to match your primary color
  color: "#2196F3", // Adjust to match primary
});

const ContentContainer = styled(Container)`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
`;

const features = [
  {
    title: "Intuitive Drag & Drop",
    description:
      "Move tasks between columns with smooth drag and drop interactions",
  },
  {
    title: "AI Task Assistant",
    description:
      "Smart chatbot that helps you manage and find information about your tasks",
  },
  {
    title: "Beautiful UI",
    description:
      "Elegant and minimalist design inspired by modern design principles",
  },
  {
    title: "Task Categorization",
    description: "Organize tasks with tags, priorities, and due dates",
  },
  {
    title: "Real-time Updates",
    description:
      "See changes to your tasks in real-time as you move and edit them",
  },
  {
    title: "Task Search",
    description: "Quickly find tasks with powerful search functionality",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: any) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <main style={{ flex: 1 }}>
        <HeroSection>
          <ContentContainer>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: { xs: 6, md: 10 },
                py: { xs: 4, md: 8 }
              }}
            >
              {/* Left Section */}
              <Box 
                sx={{ 
                  flex: 1,
                  maxWidth: { xs: '100%', md: '45%' },
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  custom={0}
                >
                  <Typography 
                    variant="h1" 
                    fontWeight="bold"
                    sx={{
                      fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
                      lineHeight: { xs: 1.2, md: 1.1 },
                      mb: 3
                    }}
                  >
                    Organize your tasks with elegance
                  </Typography>
                  <Typography 
                    variant="h5" 
                    color="textSecondary"
                    sx={{
                      fontSize: { xs: "1.1rem", sm: "1.25rem" } // Responsive font size
                    }}
                  >
                    A beautiful Kanban board with AI assistance to help you manage
                    your workflow.
                  </Typography>

                  <Box
                    mt={4}
                    display="flex"
                    gap={2}
                    justifyContent={{ xs: "center", md: "flex-start" }}
                  >
                    <MUIButton
                      variant="contained"
                      size="large"
                      sx={{
                        background: "black",
                        borderRadius: 2,
                        color: "white",
                      }}
                      component={Link}
                      to={isAuthenticated ? "/dashboard" : "/login"}
                      endIcon={<ArrowRight size={20} />}
                    >
                      Get Started
                    </MUIButton>
                    {!isAuthenticated && (
                      <MUIButton
                        variant="outlined"
                        size="large"
                        sx={{ color: "black" }}
                        component={Link}
                        to="/login"
                      >
                        Log in
                      </MUIButton>
                    )}
                  </Box>
                </motion.div>
              </Box>

              {/* Right Section */}
              <Box
                sx={{
                  flex: "none", // Remove flex scaling
                  width: "450px", // Fixed width
                  position: "relative",
                  display: { xs: "none", md: "block" }, // Hide on mobile, show on desktop
                  mx: "auto" // Center the box
                }}
              >
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInScale}
                >
                  {/* Kanban Card */}
                  <KanbanCard>
                    <Overlay />
                    <Typography
                      variant="h5"
                      color="textSecondary"
                      fontWeight="500"
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100%',
                        textAlign: 'center'
                      }}
                    >
                      Interactive Kanban Board
                    </Typography>
                  </KanbanCard>

                  {/* AI Assistant Card */}
                  <AssistantCard>
                    <AiBadge>AI</AiBadge>
                    <Box>
                      <Typography variant="body2" fontWeight="600">
                        AI Assistant
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Ask me anything about your tasks
                      </Typography>
                    </Box>
                  </AssistantCard>
                </motion.div>
              </Box>
            </Box>
          </ContentContainer>
        </HeroSection>

        {/* Features Section */}
        <Section>
          <ContentContainer>
            <Box textAlign="center" mb={6}>
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                gutterBottom
                sx={{
                  fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" } // Responsive font size
                }}
              >
                Powerful Features
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                maxWidth="600px"
                margin="auto"
              >
                Everything you need to organize your tasks and boost productivity
              </Typography>
            </Box>

            <Grid container spacing={{ xs: 3, sm: 4, md: 5 }}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                    custom={index * 0.2}
                  >
                    <FeatureCard
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <FeatureIcon>
                          <CheckCircle fontSize="small" />
                        </FeatureIcon>
                        <Typography style={{ fontWeight: 550 }} variant="h6">
                          {feature.title}
                        </Typography>
                      </Box>
                      <Typography
                        style={{ textAlign: "left" }}
                        color="text.secondary"
                      >
                        {feature.description}
                      </Typography>
                    </FeatureCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </ContentContainer>
        </Section>

        {/* CTA Section */}
        <Box 
          py={{ xs: 5, md: 10 }} 
          height={{ xs: "auto", md: "50vh" }} 
          sx={{ display: "flex" }}
        >
          <Container maxWidth="lg">
            <Paper
              elevation={3}
              sx={{ 
                p: { xs: 3, md: 6 },
                textAlign: "center", 
                borderRadius: 3 
              }}
            >
              <Typography 
                variant="h3" 
                fontWeight="bold" 
                gutterBottom
                sx={{
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" } // Responsive font size
                }}
              >
                Ready to get organized?
              </Typography>
              <Typography variant="h6" color="textSecondary" mb={4}>
                Start managing your tasks with our beautiful Kanban board today.
              </Typography>
              <MUIButton
                variant="contained"
                size="large"
                sx={{ background: "black", borderRadius: 2, color: "white" }}
                component={Link}
                to={isAuthenticated ? "/dashboard" : "/signup"}
                endIcon={<ArrowRight size={20} />}
              >
                Get Started
              </MUIButton>
            </Paper>
          </Container>
        </Box>
      </main>

      {/* Footer */}
      <Box py={4} borderTop="1px solid #ddd">
        <Container>
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }} // Stack on mobile
            justifyContent="space-between"
            alignItems="center"
            gap={{ xs: 2, sm: 0 }} // Add gap for stacked layout
          >
            <Box display="flex" alignItems="center">
              <FaLayerGroup style={{ marginRight: "10px" }} />
              <Typography variant="h6" fontWeight="bold">
                Kanboard
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary">
              &copy; {new Date().getFullYear()} Kanboard. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
