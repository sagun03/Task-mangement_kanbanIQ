import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  User, 
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import api from "../config/axiosInstance";

// Define context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
  }, [])
  const fetchUser = async (userId: string) => {
    try {
      const response = await api.get(`/users/${userId}`);
      if (!response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
      setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setIsAuthenticated(false)
    }
  }

  // Email & Password Login
  const login = async (email: string, password: string) => {
    const { user } =  await signInWithEmailAndPassword(auth, email, password);
    await fetchUser(user?.uid || "");
  };

  // Email & Password Signup
  const signup = async (email: string, password: string, name?: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await api.post("/auth/register", { email, userId: user.uid, name });
    await fetchUser(user?.uid || "");
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("user");
  };

  // Google Login
  const loginWithGoogle = async () => {
    const { user } = await signInWithPopup(auth, googleProvider);
    try {
      // Check if the user exists in the backend
      const response = await api.get(`/users/${user?.uid}`);
      if (!response.data) {
        // If user doesn't exist, register the user
        await api.post("/auth/register", { email: user?.email, userId: user?.uid });
      }
      console.log("User:", user);
      await fetchUser(user?.uid || "");
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };

  // Forgot Password function
  const forgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent. Please check your inbox.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      alert("Error sending password reset email. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, loginWithGoogle, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
