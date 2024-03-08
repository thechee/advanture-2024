import { useDispatch, useSelector } from "react-redux"
import { SmallVanCard } from "../Vans/SmallVanCard/SmallVanCard";
import { thunkGetUserVans } from "../../redux/session";
import { useEffect } from "react";
import './Profile.css'


export const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const userVansObj = useSelector((state) => state.session.user?.vans);

  useEffect(() => {
    dispatch(thunkGetUserVans());
  }, [dispatch, user]);


  if (!userVansObj) {
    return (
      <h1>Loading...</h1>
    )
  }

  return (
    <div className="profile-div">
      <div className="profile-left-div"></div>
      <div className="profile-right-div">
        <h3>Your vans</h3>
        <ul className="profile-owned-vans">
        {Object.values(userVansObj).map((van) => (
          <SmallVanCard key={van.id} van={van}/>
          ))}
        </ul>
      </div>
    </div>
  )
}