import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { thunkSignup } from "../../../redux/session";
import "../LoginFormModal/LoginForm.css";
import { Oauth } from "../Oauth/Oauth";
import OpenModalButton from "../../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import { FaRegCircleXmark } from "react-icons/fa6";


function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [fileName, setFilename] = useState("");
  const [imageURL, setImageURL] = useState("");
  const { closeModal } = useModal();
  const maxFileError = "Image exceeds the maximum file size of 5Mb";

  const fileWrap = (e) => {
    e.stopPropagation();

    const tempFile = e.target.files[0];

    // Check for max image size of 5Mb
    if (tempFile.size > 5000000) {
      setFilename(maxFileError);
      return;
    }

    const newImageURL = URL.createObjectURL(tempFile); // Generate a local URL to render the image file inside of the <img> tag.
    setImageURL(newImageURL);
    setProfileImg(tempFile);
    setFilename(tempFile.name);
    // setOptional("");
  };

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
    if (!confirmPassword)
      validationErrors.confirmPassword = "Confirmation password is required";
    if (password.length < 6)
      validationErrors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword)
      validationErrors.confirmPassword = "Passwords must match";
    if (!profileImg)
      validationErrors.profileImg = "A profile image is required";

    if (Object.values(validationErrors).length) {
      setErrors(validationErrors);
    } else {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("profile_image", profileImg);
      formData.append("password", password);

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
      <form className="login-signup-form" onSubmit={handleSubmit}>
        <div className="signup-names-div">
          <div className="signup-name">
              
            <label>First Name</label>
            <div className="input-wrapper">
              <input
                className={errors.firstName ? "input-error" : ""}
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                />
              {errors.firstName && <FaRegCircleXmark className="error-icon" />}
            </div>
            <div className="errors">
              {errors.firstName && <p>{errors.firstName}</p>}
            </div>
          </div>
          <div className="signup-name">
            <label>Last Name</label>
            <div className="input-wrapper">
              <input
                className={errors.lastName ? "input-error" : ""}
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                />
                {errors.lastName && <FaRegCircleXmark className="error-icon" />}
            </div>
            <div className="errors">
              {errors.lastName && <p>{errors.lastName}</p>}
            </div>
          </div>
        </div>
        <label>Email</label>
            <div className="input-wrapper">
              <input
                className={errors.email ? "input-error" : ""}
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
              {errors.email && <FaRegCircleXmark className="error-icon" />}
            </div>
        <div className="errors">{errors.email && <p>{errors.email}</p>}</div>
        <label>Password</label>
          <div className="input-wrapper">
            <input
              className={errors.password ? "input-error" : ""}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
            {errors.password && <FaRegCircleXmark className="error-icon" />}
          </div>
        <div className="errors">
          {errors.password && <p>{errors.password}</p>}
        </div>
        <label>Confirm Password</label>
            <div className="input-wrapper">
        <input
          className={errors.confirmPassword ? "input-error" : ""}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          />
        {errors.confirmPassword && <FaRegCircleXmark className="error-icon" />}
        </div>
        <div className="errors">
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        </div>
        <label>
          Profile Image
        </label>
        <div className="input-wrapper">
          <input
            className={errors.profileImg ? "input-error" : ""}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            id="post-image-input"
            onChange={fileWrap}
          />
          {imageURL && <img className="profile-preview" src={imageURL}></img>}
          {fileName === maxFileError || errors.profileImg && <FaRegCircleXmark className="error-icon" />}
        </div>

        <div className="errors">
          {!fileName && errors.profileImg && <p>{errors.profileImg}</p>}
          {fileName === maxFileError && <p>{fileName}</p>}
          {fileName !== maxFileError && <p style={{color: "#B7BBBF"}}>{fileName.length < 45 ? fileName : fileName.slice(0, 45) + "..."}</p>}
        </div>

        <button className="submit-btn" type="submit">
          Sign Up
        </button>
      </form>
      <Oauth />
      <div className="switch-form">
        <span>Already have an account?</span>
        <OpenModalButton 
          className={"white-square-btn"}
          modalComponent={<LoginFormModal />}
          buttonText="Log In"
        />
      </div>
    </div>
  );
}

export default SignupFormModal;
