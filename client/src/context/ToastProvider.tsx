import { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar, Alert, Slide, AlertTitle } from "@mui/material";

interface ToastContextType {
  showToast: (
    message: string,
    type?: "success" | "error" | "info" | "warning"
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    open: false,
  });

  const showToast = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "success"
  ) => {
    setToast({ message, type, open: true });
  };

  const handleClose = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={toast.open}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={5000}
        onClose={handleClose}
        TransitionComponent={(props) => <Slide {...props} direction="left" />}
      >
        <Alert onClose={handleClose} variant="filled" sx={{ borderRadius: 4 }} severity={toast.type}>
          <AlertTitle sx={{textAlign: "left"}}>
            {toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
          </AlertTitle>

          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
