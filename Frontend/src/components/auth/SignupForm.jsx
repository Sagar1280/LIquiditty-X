const SignupForm = () => (
  <div className="auth-form">
    <input className="auth-input" placeholder="Email" />

    <input className="auth-input" placeholder="Password" type="password" />

    <input className="auth-input" placeholder="Confirm Password" type="password" />

    <button className="auth-submit" >Signup</button>
  </div>
);
export default SignupForm;
