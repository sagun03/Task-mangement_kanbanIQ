import React from "react";
import styled from "styled-components";
import { Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import login from '../assets/login.png';
import signup from '../assets/singup.jpg';


const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: #f8f9fc;
`;

const FormWrapper = styled.div`
  display: flex;
  padding: 20px;
`;

const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  text-align: left;
  padding: 20px;
`;

const RightPanel = styled.div`
  flex: 1;
  padding: 20px;
`;

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation(); // Get current route

  // Determine the page type based on the current route
  const isSignUpPage = location.pathname.includes("signup");

  // Select the appropriate image for Sign Up or Login
  const imageUrl = isSignUpPage
    ? signup
    : login

  return (
    <AuthContainer>
      <FormWrapper>
        <LeftPanel>
          <img src={imageUrl} alt={isSignUpPage ? "Sign Up" : "Login"} width="500" />
          <Typography variant="h5" style={{ marginTop: "40px"}} fontWeight="bold">KanbanIQ</Typography>
          <Typography variant="body1">
            {isSignUpPage
              ? "Create your account to start using KanbanIQ"
              : "Login to manage your tasks and projects"}
          </Typography>
        </LeftPanel>
        <RightPanel>{children}</RightPanel>
      </FormWrapper>
    </AuthContainer>
  );
};

export default AuthLayout;
