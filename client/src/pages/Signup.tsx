import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Wrapper,
  Container,
  FormBox,
  TabContainer,
  Tab,
  ErrorText,
  StyledTextField,
  SubmitButton,
} from "../styles/signup";
import EmailIcon from "@mui/icons-material/Email";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useToast } from "../context/ToastProvider";
import PersonIcon from "@mui/icons-material/Person";
import LoadingOverlay from "../components/Loader";
import DOMPurify from 'dompurify';

interface SignupFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

const Signup: React.FC = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormInputs>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const onSubmit = async (data: SignupFormInputs) => {
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signup(data.email, data.password, data.name);
      showToast("Signup successful! Redirecting...", "success");
      navigate("/login");
    } catch (err: unknown) {
      showToast(
        (err as Record<string, string>).message ||
          "Signup failed. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Container>
        <FormBox>
          <TabContainer>
            <Tab
              as={Link}
              to="/login"
              style={{ textDecoration: "none", color: "black" }}
            >
              Login
            </Tab>
            <Tab active>Sign Up</Tab>
          </TabContainer>
          <Divider style={{ width: "100%" }} />

          {error && <ErrorText>{error}</ErrorText>}

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <Box
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <StyledTextField
                sx={{
                  backgroundColor: "white",
                  "& .MuiFormLabel-root": {
                    color: "black",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ced4da" },
                    "&:hover fieldset": { borderColor: "black" },
                    "&.Mui-focused fieldset": { borderColor: "black" },
                  },
                }}
                label={
                  <>
                    Email <span style={{ color: "red" }}>*</span>
                  </>
                }
                fullWidth
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
                fullWidth
                sx={{
                  backgroundColor: "white",
                  "& .MuiFormLabel-root": {
                    color: "black",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ced4da" },
                    "&:hover fieldset": { borderColor: "black" },
                    "&.Mui-focused fieldset": { borderColor: "black" },
                  },
                }}
                label="Name"
                {...register("name", {
                  validate: (value) => {
                    const cleanValue = DOMPurify.sanitize(value); // Sanitize input
                    return cleanValue === value || "Invalid characters detected!";
                  },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <StyledTextField
                fullWidth
                sx={{
                  backgroundColor: "white",
                  "& .MuiFormLabel-root": {
                    color: "black",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ced4da" },
                    "&:hover fieldset": { borderColor: "black" },
                    "&.Mui-focused fieldset": { borderColor: "black" },
                  },
                }}
                label={
                  <>
                    Password <span style={{ color: "red" }}>*</span>
                  </>
                }
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
                      "Must have 1 uppercase, 1 number, 1 special character",
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

              <StyledTextField
                fullWidth
                sx={{
                  backgroundColor: "white",
                  "& .MuiFormLabel-root": {
                    color: "black",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ced4da" },
                    "&:hover fieldset": { borderColor: "black" },
                    "&.Mui-focused fieldset": { borderColor: "black" },
                  },
                }}
                label={
                  <>
                    Confirm Password <span style={{ color: "red" }}>*</span>
                  </>
                }
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="fa fa-lock" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? <HiEyeOff /> : <HiEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <FormControlLabel
              control={<Checkbox />}
              style={{ margin: "10px" }}
              label="I agree to the Terms & Conditions"
            />

            <SubmitButton
              variant="contained"
              style={{ background: "black" }}
              type="submit"
              disabled={loading}
            >
              Sign Up
            </SubmitButton>
          </form>
        </FormBox>
      </Container>
      <LoadingOverlay loading={loading} />
    </Wrapper>
  );
};

export default Signup;
