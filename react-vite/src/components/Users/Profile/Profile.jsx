import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { thunkGetUserRatings, thunkGetUserVans } from "../../../redux/session";
import { SmallVanCard } from "../../Vans/SmallVanCard/SmallVanCard";
import { UserRating } from "../../Ratings/ManageRatings/UserRating/UserRating";
import "./Profile.css";

export const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user);  
  const vansObj = useSelector((state) => state.session.user?.vans);

  useEffect(() => {
    dispatch(thunkGetUserVans());
    dispatch(thunkGetUserRatings());
  }, [dispatch]);


  return (
    <div>
      <div className="profile-banner"></div>
      <div className="profile-container">
        <div className="profile-profile-image">
          <img src={user.profileImage}></img>
        </div>
        <div className="profile-content">
          <div className="profile-user-info">
            <h1>
              {user.firstName} {user.lastName.slice(0, 1)}.
            </h1>
            <span>Joined {format(user.createdAt, 'MMM yyyy')}</span>
          </div>
          <div className="profile-right-div">
            <div className="profile-right-div-info"> 
            <h4>{user.firstName}&apos;s vans</h4>
            <div className="profile-vans">
              {vansObj && Object.values(vansObj).length ? (
                Object.values(vansObj).map((van) => (
                  <SmallVanCard key={van.id} van={van} />
                )
              )
              )
            :
            (
              <div className="profile-no-vans">
                <p>You don&apos;t have any vans yet</p>
                <button className="submit-btn" onClick={() => navigate('/vans/new')}>Add a van</button>
              </div>
            )}
            </div>
            <h4>Reviews</h4>
            <div className="profile-reviews">
              {user.ratings && Object.values(user.ratings).length ? (
                Object.values(user.ratings).map((rating) => (
                  <UserRating key={rating.id} rating={rating} />
                ))
              ) : (
                <p>No reviews yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
