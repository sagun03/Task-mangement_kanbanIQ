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
  CircularProgress,
} from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase";
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
import PasswordIcon from '@mui/icons-material/Password';
import {
  Wrapper,
  Container,
  FormBox,
  TabContainer,
  Tab,
  StyledTextField,
  FormActions,
  ForgotPasswordText,
  SubmitButton,
  DividerText,
  OAuthButtons,
  OAuthButton,
} from "../styles/login";
import { useToast } from "../context/ToastProvider";
import LoadingOverlay from "../components/Loader";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();
  const { showToast } = useToast(); // Fetch the toast function
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false); // State for loader
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
      showToast("Login successful!", "success");
      navigate("/dashboard");
    } catch (err: unknown) {
      const errorMsg = (err as Record<string, string>).message as string;
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      showToast("Password reset email sent. Check your inbox.", "success");
      setIsForgotPasswordOpen(false);
    } catch {
      showToast("Error sending reset email. Please try again.", "error");
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

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <Box style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
                    <EmailIcon color="action" />
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
                     <PasswordIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
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
                onClick={() => setIsForgotPasswordOpen(true)}
                style={{ cursor: "pointer" }}
              >
                Forgot password?
              </ForgotPasswordText>
            </FormActions>

            <SubmitButton variant="contained" style={{ background: "black" }} type="submit" disabled={loading}>
            Login
            </SubmitButton>
          </form>

          <DividerText>Or continue with</DividerText>

          <OAuthButtons>
            <OAuthButton
              variant="outlined"
              onClick={async () => {
                try {
                  setLoading(true);
                  await loginWithGoogle();
                  showToast("Login successful!", "success");
                  navigate("/dashboard");
                } catch (error) {
                  showToast(error?.message || "Login failed. Please try again.", "error");
                } finally {
                  setLoading(false);
                }
              }}
            >
              <FcGoogle size={22} /> Google
            </OAuthButton>
          </OAuthButtons>
        </FormBox>
      </Container>

      {/* Modal for Forgot Password */}
      <Dialog open={isForgotPasswordOpen} onClose={() => setIsForgotPasswordOpen(false)}>
         <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Reset Password
        <IconButton onClick={() => setIsForgotPasswordOpen(false)} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pb: 2 }}>
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
                <EmailIcon color="action" />
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
      <LoadingOverlay loading={loading} />
    </Wrapper>
  );
};

export default Login;
