import { useDispatch, useSelector } from "react-redux";
import { VanListItem } from "../VanListItem/VanListItem";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { thunkGetUserVans } from "../../../redux/session";
import LoginFormModal from "../../LoginFormModal";
import "./ManageVans.css";
import { OpenModalLink } from "../../OpenModalLink/OpenModalLink";

export const ManageVans = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const vansObj = useSelector((state) => state.session.user?.vans);

  useEffect(() => {
    dispatch(thunkGetUserVans());
  }, [dispatch, user]);

  if (!user) {
    return (
      <div className="manage-vans-div">
        <h1>You must be logged in to view your vans</h1>
        <div className="manage-vans-links">
          <OpenModalLink
            linkText="Login"
            modalComponent={<LoginFormModal />}
            className={"manage-vans-link"}
          />
          <Link className="manage-vans-link" to={"/vans"}>
            Check out vans to rent
          </Link>
        </div>
      </div>
    );
  }

  if (!vansObj || !Object.values(vansObj).length) {
    return (
      <div className="manage-vans-div">
        <h1>You don&apos;t have any vans yet</h1>
        <div className="manage-vans-links">
          <Link className="manage-vans-link" to={"/vans/new"}>
            Add a van to Advanture
          </Link>

          <Link className="manage-vans-link" to={"/vans"}>
            Check out vans to rent
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="manage-vans-div">
        <h1>Your vans</h1>
        <ul className="manage-vans-ul">
          {Object.values(vansObj).map((van) => (
            <VanListItem key={van.id} van={van} />
          ))}
        </ul>
      </div>
    </div>
  );
};
