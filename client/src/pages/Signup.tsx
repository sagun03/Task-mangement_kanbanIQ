import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = () => {
    login();
    navigate("/");
  };

  return (
    <div>
      <h1>Signup</h1>
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default Signup;
