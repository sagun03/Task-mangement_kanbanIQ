import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { theme } from "./theme";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./Routes";
import { ToastProvider } from "./context/ToastProvider";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <StyledThemeProvider theme={{ primaryColor: "#1976d2" }}>
        <CssBaseline />
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </StyledThemeProvider>
    </ThemeProvider>
  );
}

export default App;
