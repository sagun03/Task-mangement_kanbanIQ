import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  User, 
  sendPasswordResetEmail, 
  onAuthStateChanged
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import api from "../config/axiosInstance";

// Define context type
interface AuthContextType {
  user: any; // Updated to handle backend user object
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<User>; // Changed return type to Promise<User>
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null
  );  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("user") ? true : false);

  const fetchUser = async (userId: string) => {
    try {
      const response = await api.get(`/users/${userId}`);
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        throw new Error("No user data received");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      throw new Error("User not found");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (!user)
        await fetchUser(firebaseUser.uid);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
      }
    });
    return () => unsubscribe();
  }, []);

  // Email & Password Login
  const login = async (email: string, password: string) => {
    try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    await fetchUser(user?.uid || "");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Email & Password Signup
  const signup = async (email: string, password: string, name?: string) => {
    try {
      // 1. Create Firebase user
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Register user in your backend
      await api.post("/auth/register", { 
        email, 
        userId: firebaseUser.uid, 
        name: name || email.split('@')[0] // Use name if provided, otherwise use email username
      });
  
      // 3. Wait a brief moment to ensure backend registration is complete
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // 4. Fetch the newly created user
      await fetchUser(firebaseUser.uid);
      
      return firebaseUser;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
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
      throw error;
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
