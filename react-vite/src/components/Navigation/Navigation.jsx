import { Link, useLocation } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { useSelector } from "react-redux";

function Navigation() {
  const user = useSelector(state => state.session.user)
  const location = useLocation()

  return (
    <header className="nav-bar">
      <Link id='logo' to="/">
          <span>ADVANTURE</span>

      </Link>
      <div id="empty-header">
      </div>
      {!location.pathname.endsWith("/vans") && <Link to={"/vans"}>
      <div id="host-div">
        <span>View all vans</span>
      </div>
      </Link>}
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
