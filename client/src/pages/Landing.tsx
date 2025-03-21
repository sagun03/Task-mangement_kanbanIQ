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
  min-height: 80vh;
  display: flex;
`;
const KanbanCard = styled(Box)`
  position: relative;
  width: 100%;
  height: 380px; /* Increased height */
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 8px; /* Slightly larger border-radius */
  box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px,
    rgba(0, 0, 0, 0.3) 0px 18px 36px -18px;
  border: 1px solid #ccc; /* Softer border */
  background: linear-gradient(to top right, rgba(0, 0, 255, 0.05), #fff);
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Overlay = styled(Box)`
  position: absolute;
  inset: 0;
background: linear-gradient(to top right, rgba(32, 150, 243, 0.2), #ffffff);
`;

const AssistantCard = styled(Box)`
  position: absolute;
  bottom: -24px;
  right: -24px;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  border: 1px solid #ddd;
  background: #fff;
  display: flex;
  align-items: center;
  transition: all 0.3s ease-in-out;
  gap: 12px;
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
  padding: "6rem",
  backgroundColor: "#F5F8FA",
  minHeight: "80vh",
});

const FeatureCard = styled(Box)({
  padding: "1.5rem",
  backgroundColor: "#fff",
  width: "450px",
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
    <Box display="flex" flexDirection="column" mt={"64px"} minHeight="100vh">
      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <HeroSection>
          {/* <Container> */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "center",
              margin: "auto",
              px: ".6rem",
              maxWidth: "1500px",
              gap: 10, // Replacing Grid spacing
            }}
          >
            {/* Left Section */}
            <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                custom={0}
              >
                <Typography variant="h2" fontWeight="bold" gutterBottom>
                  Organize your tasks with elegance
                </Typography>
                <Typography variant="h5" color="textSecondary">
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
                flex: 1,
                display: "flex",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInScale}
              >
                {/* Kanban Card */}
                <KanbanCard >
                  <Overlay />
                  <Typography
                    variant="h5"
                    color="textSecondary"
                    fontWeight="500"
                  >
                    Interactive Kanban Board
                  </Typography>
                </KanbanCard>

                {/* AI Assistant Card */}
                <AssistantCard
                
                  // sx={{ position: "absolute", bottom: -20, right: -20 }}
                >
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

          {/* </Container> */}
        </HeroSection>

        {/* Features Section */}
        <Section>
          {/* <Container> */}
          <Box textAlign="center" mb={6}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
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

          <Grid container spacing={8}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeIn}
                  custom={index * 0.2}
                >
                  <FeatureCard>
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
          {/* </Container> */}
        </Section>

        {/* CTA Section */}
        <Box py={10} height={"50vh"} sx={{ display: "flex" }}>
          <Container>
            <Paper
              elevation={3}
              sx={{ p: 6, textAlign: "center", borderRadius: 3 }}
            >
              <Typography variant="h3" fontWeight="bold" gutterBottom>
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
            justifyContent="space-between"
            alignItems="center"
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
