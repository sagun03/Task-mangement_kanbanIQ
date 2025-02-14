import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AuthContainer, AuthPaper, AuthIllustration, AuthTextField, AuthButton } from "../styles/AuthStyles";
import { Typography } from "@mui/material";
import loginIllustration from "../assets/login.png"; 

type LoginFormInputs = {
  email: string;
  password: string;
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<LoginFormInputs>();

  const onSubmit = (data: LoginFormInputs) => {
    console.log("Logging in with:", data);
    login();
    navigate("/");
  };

  return (
    <AuthContainer>
      <AuthPaper elevation={3}>
        <AuthIllustration src={loginIllustration} alt="Login Illustration" />
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#fff" }}>
          Welcome Back!
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ color: "rgba(255, 255, 255, 0.8)", marginBottom: "1rem" }}>
          Enter your credentials to access your tasks.
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AuthTextField label="Email" type="email" fullWidth {...register("email", { required: true })} />
          <AuthTextField label="Password" type="password" fullWidth {...register("password", { required: true })} />
          <AuthButton type="submit" variant="contained" fullWidth>
            Login
          </AuthButton>
        </form>
      </AuthPaper>
    </AuthContainer>
  );
};

export default Login;