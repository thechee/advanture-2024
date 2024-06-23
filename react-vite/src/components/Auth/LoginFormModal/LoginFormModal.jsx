import { useState } from "react";
import { thunkLogin } from "../../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import OpenModalLink from "../../OpenModalLink";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import "./LoginForm.css";
import { Oauth } from "../Oauth/Oauth";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  const handleDemoSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email: "demo@aa.io",
        password: "password"
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div id="login-div">
      <h1>Log In</h1>
      <form className="login-signup-form" onSubmit={handleSubmit}>
        <label>
          Email
        </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={errors.email ? "input-error" : ""}
          />
        <div className="errors">{errors.email && <p>{errors.email}</p>}</div>
        <label>
          Password
        </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={errors.password ? "input-error" : ""}
          />
        <div className="errors">
          {errors.password && <p>{errors.password}</p>}
        </div>
        <button id='login-btn' className='submit-btn' type="submit">Log In</button>
        <button className="btn" onClick={handleDemoSubmit} >Demo User</button>
      </form>
      <Oauth />
      <div className="switch-form">
        <OpenModalLink 
          modalComponent={<SignupFormModal />}
          linkText="Don&apos;t have an account? Sign Up"
          className="modal-link"
        />
      </div>
    </div>
  );
}

export default LoginFormModal;
