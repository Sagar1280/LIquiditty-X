import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const openAuth = useAuthStore((s) => s.openAuth);

  const handleSignup = async () => {
    if (!email || !password) return alert("Fields required");

    try {
      await axios.post("http://localhost:5000/auth/signup", {
        email,
        password,
      });

      alert("Signup success! Please login.");
      openAuth("login"); // <— your choice (B)

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className="auth-form">

      <input
        className="auth-input"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="auth-input"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="auth-submit" onClick={handleSignup}>
        Create Account
      </button>

    </div>
  );
};

export default SignupForm;
