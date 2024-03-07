import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { FaBars, FaRegUser } from "react-icons/fa";
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
  };

  return (
    <>
      <button
        className={
          showMenu ? "profile-active profile-button" : "profile-button"
        }
        onClick={toggleMenu}
      >
        <FaBars />
        <div className="profile-img-div">
          {user ? <img src={user?.profileImage} alt="" /> : <FaRegUser />}
        </div>
      </button>
      {showMenu && (
        <ul className={"profile-dropdown"} ref={ulRef}>
          {user ? (
            <>
            <div className="profile-dropdown-links-div">
              <NavLink to={`/users/${user.id}/favorites`}
              onClick={toggleMenu}>
                <li>Favorites</li>
              </NavLink>
              <NavLink to={`trips`} onClick={toggleMenu}>
                <li>Trips</li>
              </NavLink>
              <NavLink to={`/notifications`} onClick={toggleMenu}>
                <li>Notifications</li>
              </NavLink>
            </div>
            <div className="profile-dropdown-user-div">
              <NavLink to={`/users/${user.id}`} onClick={toggleMenu}>
                <li id='profile-navlink'>Profile</li>
              </NavLink>
              <NavLink to={`/account`} onClick={toggleMenu}>
                <li>Account</li>
              </NavLink>
              <NavLink to={`/vans/new`} onClick={toggleMenu}>
                <li>Add a van</li>
              </NavLink>
            </div>
            <div className="profile-dropdown-manage-div">
              <NavLink to={'/vans/manage'} onClick={toggleMenu}>
                <li>Manage vans</li>
              </NavLink>
              <NavLink to={'/reviews/manage'} onClick={toggleMenu}>
                <li>Manage reviews</li>
              </NavLink>
            </div>
            <div className="profile-dropdown-logout-div">
              <li id='logout-li' onClick={logout}>Log Out</li>
            </div>
            </>
          ) : (
            <>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </>
          )}
        </ul>
      )}
    </>
  );
}

export default ProfileButton;
