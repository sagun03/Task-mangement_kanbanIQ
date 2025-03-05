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
import { HiEye, HiEyeOff } from "react-icons/hi";

interface SignupFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

const Signup: React.FC = () => {
  const [error, setError] = useState("");
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


  const onSubmit = async (data: SignupFormInputs) => {
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await signup(data.email, data.password, data.name);
      navigate("/login");
    } catch (err: unknown) {
      setError((err as Record<string, string>).message as string);
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

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%"}} >
          <Box
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
            <StyledTextField
            placeholder="Email"
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
                    <i className="fa fa-envelope" />
                  </InputAdornment>
                ),
              }}
            />

            <StyledTextField
              fullWidth
              placeholder="Name"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="fa fa-user" />
                  </InputAdornment>
                ),
              }}
            />

            <StyledTextField
              fullWidth
              placeholder="Password"
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
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <HiEyeOff /> : <HiEye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <StyledTextField
              fullWidth
              placeholder="Confirm Password"
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

            <SubmitButton variant="contained" style={{ background: "black" }} type="submit">Sign Up</SubmitButton>
          </form>
        </FormBox>
      </Container>
    </Wrapper>
  );
};

export default Signup;
