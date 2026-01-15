import { useState } from "react";
import { useAuthStore } from "../../store/authStore";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useAuthStore((s) => s.login);
  const openAuth = useAuthStore((s) => s.openAuth);

  const handleSubmit = async () => {
    if (!email || !password) return alert("Please enter email & password");
    await login(email, password);
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

      <button className="new-user" onClick={() => openAuth("signup")}>
        New to Liquidity-X ?
      </button>

      <button className="auth-submit" onClick={handleSubmit}>
        Login
      </button>
      
    </div>
  );
};

export default LoginForm;
