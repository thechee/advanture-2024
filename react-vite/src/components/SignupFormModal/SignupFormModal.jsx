import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "../LoginFormModal/LoginForm.css";

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
        <label>Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          // required
        />
        <div className="errors">{errors.email && <p>{errors.email}</p>}</div>
        <label>First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          // required
        />
        <div className="errors">
          {errors.firstName && <p>{errors.firstName}</p>}
        </div>
        <label>Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          // required
        />
        <div className="errors">
          {errors.lastName && <p>{errors.lastName}</p>}
        </div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          // required
        />
        <div className="errors">
          {errors.password && <p>{errors.password}</p>}
        </div>
        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          // required
        />
        <div className="errors">
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        </div>
        {/* <label>
          Profile Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImg(e.target.files[0])}
          />
        <div className="errors">
          {errors.profileImg && <p>{errors.profileImg}</p>}
        </div> */}

        <label htmlFor="post-image-input" className="file-input-labels">
          Profile Image
        </label>



        <div className="file-inputs-container">
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            id="post-image-input"
            onChange={fileWrap}
          />
          {/* <div
            className="file-inputs-filename"
            style={{ color: fileName === maxFileError ? "red" : "#B7BBBF",
          fontSize: "12px" }}
          >
            {fileName !== maxFileError && fileName}
          </div> */}
          {/* <div style={{ position: "absolute", top: "-34px", left: "39px" }}>
            <img src={imageURL} className="thumbnails"></img>
          </div> */}

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
    </div>
  );
}

export default SignupFormModal;
