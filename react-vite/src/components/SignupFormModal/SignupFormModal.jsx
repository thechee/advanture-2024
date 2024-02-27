import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const validationErrors = {};
    if (!email) validationErrors.email = "Email is required";
    if (!email.match(validRegex))
      validationErrors.email = "Must be valid email";
    if (!firstName) validationErrors.firstName = "First name is required";
    if (!lastName) validationErrors.lastName = "Last name is required";
    if (!password) validationErrors.password = "Password is required";
    if (password.length < 6)
      validationErrors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword)
      validationErrors.confirmPassword =
        "Passwords must match";
    if (!profileImg) validationErrors.profileImg = "A profile image is required"


    if (Object.values(validationErrors).length) {
      setErrors(validationErrors)
    } else {
      const formData = new FormData() 
      formData.append("email", email)
      formData.append("first_name", firstName)
      formData.append("last_name", lastName)
      formData.append("profile_image", profileImg)
      formData.append("password", password)
      
      const serverResponse = await dispatch(thunkSignup(formData));
  
      if (serverResponse) {
        setErrors(serverResponse);
      } else {
        closeModal();
      }
    }
  };

  return (
    <div className="signup-div">
      <h1>Sign Up</h1>
      {errors.server && <p>{errors.server}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <div className="errors">{errors.email && <p>{errors.email}</p>}</div>
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <div className="errors">
          {errors.firstName && <p>{errors.firstName}</p>}
        </div>
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <div className="errors">
          {errors.lastName && <p>{errors.lastName}</p>}
        </div>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <div className="errors">
          {errors.password && <p>{errors.password}</p>}
        </div>
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <div className="errors">
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        </div>
        <label>
          <p className="profile-img">Profile Image</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImg(e.target.files[0])}
          />
        </label>
        <div className="errors">
          {errors.profileImg && <p>{errors.profileImg}</p>}
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
