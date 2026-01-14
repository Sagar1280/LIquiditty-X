import SignupForm from "./SignupForm";
import { useAuthStore } from "../../store/authStore";
import AuthModal from "../AuthModal";

const LoginForm = () => {

  const openAuth = useAuthStore(s => s.openAuth);

  return (
    <div className="auth-form">
    
    <input className="auth-input" placeholder="Email" type="email" />

    <input className="auth-input" placeholder="Password" type="password" />

    <button className="new-user" onClick={()=>openAuth("signup")}>New to Liquidity-X ?</button>

    <button className="auth-submit">Login</button>

  </div>
  )
};

export default LoginForm;
