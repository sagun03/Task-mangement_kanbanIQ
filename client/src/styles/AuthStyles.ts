import { styled } from "@mui/system";
import { Paper, TextField, Button } from "@mui/material";


export const AuthCheckbox = () => {
  // Checkbox implementation
};

export const AuthLink = () => {
  // Link implementation
};

// Gradient Background with Glassmorphism
export const AuthContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "linear-gradient(135deg, #1A2980, #26D0CE)",
});

// Glassmorphism Card
export const AuthPaper = styled(Paper)({
  padding: "2rem",
  width: "400px",
  textAlign: "center",
  backdropFilter: "blur(10px)",
  background: "rgba(255, 255, 255, 0.2)",
  borderRadius: "15px",
  boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  color: "#fff",
});

// Illustration with Soft Shadow
export const AuthIllustration = styled("img")({
  width: "100%",
  maxHeight: "220px",
  marginBottom: "1rem",
  filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.2))",
});

// Custom Input Fields
export const AuthTextField = styled(TextField)({
  marginBottom: "1rem",
  "& .MuiInputBase-root": {
    color: "#fff",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    "&:hover fieldset": {
      borderColor: "#fff",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#26D0CE",
    },
  },
});

// Gradient Button with Animation
export const AuthButton = styled(Button)({
  marginTop: "1rem",
  padding: "10px",
  fontSize: "16px",
  fontWeight: "bold",
  textTransform: "none",
  background: "linear-gradient(135deg, #26D0CE, #1A2980)",
  color: "#fff",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
    background: "linear-gradient(135deg, #1A2980, #26D0CE)",
  },
});
