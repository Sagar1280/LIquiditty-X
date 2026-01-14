import { useAuthStore } from "../store/authStore";
import SignupForm from "./auth/SignupForm";
import LoginForm from "./auth/LoginForm";

const AuthModal = () => {
    const authMode = useAuthStore(s => s.authModal);
    const closeAuth = useAuthStore(s => s.closeAuth);
    const openAuth = useAuthStore(s => s.openAuth);

    return (
        <div className="auth-overlay" onClick={closeAuth}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>

                <button className="auth-close" onClick={closeAuth}>×</button>

                <div className="auth-tabs">
                    <button className={authMode === "login" ? "active" : ""} onClick={() => openAuth("login")}>Login</button>
                    <button className={authMode === "signup" ? "active" : ""} onClick={() => openAuth("signup")}>Signup</button>

                </div>

                {authMode === "login" ? <LoginForm /> : <SignupForm />}

            </div>
        </div>
    );
};

export default AuthModal;
