import { useState } from "react";
import { thunkLogin } from "../../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Oauth } from "../Oauth/Oauth";
import "./LoginForm.css";

export function LoginFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    
    if (serverResponse) {
      setIsLoading(false);
      setErrors(serverResponse);
    } else {
      setIsLoading(false);
      navigate(location.state?.from || "/");
    }
  };

  const handleDemoSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const serverResponse = await dispatch(
      thunkLogin({
        email: "demo@aa.io",
        password: "password"
      })
    );


    if (serverResponse) {
      setIsLoading(false);
      setErrors(serverResponse);
    } else {
      setIsLoading(false);
      navigate(location.state?.from || "/");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Replace this with your actual loading component
  }

  console.log(location.state.from)

  return (
    <div id="login-div">
      <h1>Log In</h1>
      {errors.length > 0 &&
        errors.map((message) => <p key={message}>{message}</p>)}
      <form onSubmit={handleSubmit} className="login-signup-form">
        <label>
          Email
        </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        <div className="errors">
          {errors.email && <p>{errors.email}</p>}
        </div>
        <label>
          Password
        </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        <div className="errors">
          {errors.password && <p>{errors.password}</p>}
        </div>
        <button type="submit" id="login-btn" className="submit-btn">Continue</button>
        <button className="btn" onClick={handleDemoSubmit} >Demo User</button>
      </form>
      <Oauth />
    </div>
  );
}