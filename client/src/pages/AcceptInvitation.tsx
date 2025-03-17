import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgress, Typography, Paper, Box } from "@mui/material";
import { styled } from "styled-components";
import { useAuth } from "../context/AuthContext";
import { acceptInvitation } from "../services/api";
import { ActionButton } from "./KanbanBoard";

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledPaper = styled(Paper)`
  padding: 24px;
  width: 400px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const AcceptInvitation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [status, setStatus] = useState<"success" | "error" | "loading">("loading");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/accept-invitation/${token}`);
      return;
    }

    if (token) {
      handleAcceptInvitation(token);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "success") {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            navigate("/dashboard");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [status, navigate]);

  const handleAcceptInvitation = async (token: string) => {
    setStatus("loading");
    localStorage.removeItem("redirectPath");
    const response = await acceptInvitation(token, user?.id as string);

    if (response.success) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  return (
    <Container>
      <StyledPaper elevation={3}>
        <Typography variant="h5" fontWeight="bold">
          Board Invitation
        </Typography>

        {status === "loading" && (
          <>
            <CircularProgress size={40} style={{ margin: "20px 0" }} />
            <Typography>Processing your invitation...</Typography>
          </>
        )}

        {status === "success" && (
          <Box>
            <Typography variant="h6" color="success" sx={{ marginTop: 2 }}>
              🎉 Success! You have joined the board.
            </Typography>
            <Typography variant="body1" color="success" sx={{ marginTop: 2 }}>
              Redirecting to your dashboard in {countdown} seconds...
            </Typography>
            <ActionButton
              variant="contained"
              color="primary"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </ActionButton>
          </Box>
        )}

        {status === "error" && (
          <>
            <Typography variant="h6" color="error" sx={{ marginTop: 2 }}>
              ❌ Something went wrong. Please try again.
            </Typography>
            <ActionButton
              variant="contained"
              color="primary"
              onClick={() => handleAcceptInvitation(token as string)}
            >
              Retry Accept Invitation
            </ActionButton>
          </>
        )}
      </StyledPaper>
    </Container>
  );
};

export default AcceptInvitation;
