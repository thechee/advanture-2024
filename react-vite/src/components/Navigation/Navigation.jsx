import { Link } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <ul className="nav-bar">
      <Link to="/">
      <li id="logo">
          ADVANTURE
      </li>
      </Link>

      <li>
        <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;
