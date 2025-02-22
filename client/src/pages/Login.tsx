import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Divider,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { HiEye, HiEyeOff } from "react-icons/hi"; // Eye icons for password visibility
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase"; // Assuming auth is exported from here
import {
  Wrapper,
  Container,
  FormBox,
  TabContainer,
  Tab,
  ErrorText,
  StyledTextField,
  FormActions,
  ForgotPasswordText,
  SubmitButton,
  DividerText,
  OAuthButtons,
  OAuthButton,
} from "../styles/login";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [error, setError] = useState("");
  const { login, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false); // Modal state
  const [resetEmail, setResetEmail] = useState(""); // Email for password reset
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (err: unknown) {
      setError((err as Record<string, string>).message as string);
    }
  };

  const handleForgotPasswordSubmit = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setError("Password reset email sent. Please check your inbox.");
      setIsForgotPasswordOpen(false); // Close the modal after email is sent
    } catch{
      setError("Error sending reset email. Please try again.");
    }
  };

  return (
    <Wrapper>
      <Container>
        <FormBox>
          <TabContainer>
            <Tab active>Login</Tab>
            <Tab
              as={Link}
              to="/signup"
              style={{ textDecoration: "none", color: "black" }}
            >
              Sign Up
            </Tab>
          </TabContainer>
          <Divider style={{ width: "100%" }} />

          {error && <ErrorText>{error}</ErrorText>}

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <Box
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <StyledTextField
                fullWidth
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email format",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="fa fa-envelope" />
                    </InputAdornment>
                  ),
                }}
              />

              <StyledTextField
                placeholder="Password"
                fullWidth
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                    message:
                      "Password must contain at least one uppercase letter, one number, and one special character",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="fa fa-lock" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <HiEyeOff /> : <HiEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <FormActions>
              <FormControlLabel control={<Checkbox />} label="Remember me" />
              <ForgotPasswordText
                onClick={() => setIsForgotPasswordOpen(true)} // Open the modal
                style={{ cursor: "pointer" }}
              >
                Forgot password?
              </ForgotPasswordText>
            </FormActions>

            <SubmitButton variant="contained" style={{ background: "black" }} type="submit">
              Login
            </SubmitButton>
          </form>

          <DividerText>Or continue with</DividerText>

          <OAuthButtons>
            <OAuthButton variant="outlined" onClick={async () => { await loginWithGoogle(); navigate("/") }}>
              <FcGoogle size={22} /> Google
            </OAuthButton>
          </OAuthButtons>
        </FormBox>
      </Container>

      {/* Modal for Forgot Password */}
      <Dialog open={isForgotPasswordOpen} onClose={() => setIsForgotPasswordOpen(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <StyledTextField
            fullWidth
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            error={!resetEmail}
            helperText={!resetEmail ? "Email is required" : ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="fa fa-envelope" />
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <SubmitButton
            variant="contained"
            style={{ background: "black" }}
            onClick={handleForgotPasswordSubmit}
          >
            Send Reset Link
          </SubmitButton>
        </DialogActions>
      </Dialog>
    </Wrapper>
  );
};

export default Login;
