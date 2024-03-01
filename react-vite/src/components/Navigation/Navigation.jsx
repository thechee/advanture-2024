import { Link } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { useSelector } from "react-redux";

function Navigation() {
  const user = useSelector(state => state.session.user)

  return (
    <header className="nav-bar">
      <Link id='logo' to="/">
          <span>ADVANTURE</span>

      </Link>
      <div id="empty-header">
      </div>
      {user && <Link to='/vans/new'>
      <div id="host-div">
        <span>Add a van</span>
      </div>
      </Link>}
      <div className="profile-button-div">
        <ProfileButton />
      </div>
    </header>
  );
}

export default Navigation;
