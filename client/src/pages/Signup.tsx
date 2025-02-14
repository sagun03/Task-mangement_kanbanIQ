import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AuthContainer, AuthPaper, AuthIllustration, AuthTextField, AuthButton } from "../styles/AuthStyles";
import { Typography } from "@mui/material";
import signupIllustration from "../assets/singup.jpg"; 

type SignupFormInputs = {
  name: string;
  email: string;
  password: string;
};

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<SignupFormInputs>();

  const onSubmit = (data: SignupFormInputs) => {
    console.log("Signing up with:", data);
    login();
    navigate("/");
  };

  return (
    <AuthContainer>
      <AuthPaper elevation={3}>
        <AuthIllustration src={signupIllustration} alt="Signup Illustration" />
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#fff" }}>
          Create Your Account
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ color: "rgba(255, 255, 255, 0.8)", marginBottom: "1rem" }}>
          Join the task management revolution!
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AuthTextField label="Full Name" fullWidth {...register("name", { required: true })} />
          <AuthTextField label="Email" type="email" fullWidth {...register("email", { required: true })} />
          <AuthTextField label="Password" type="password" fullWidth {...register("password", { required: true })} />
          <AuthButton type="submit" variant="contained" fullWidth>
            Sign Up
          </AuthButton>
        </form>
      </AuthPaper>
    </AuthContainer>
  );
};

export default Signup;

