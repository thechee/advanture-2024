import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkGetUserRatings } from "../../../redux/session"
import { UserRating } from "./UserRating/UserRating"
import { OpenModalLink } from "../../OpenModalLink/OpenModalLink"
import { Link } from "react-router-dom"
import './ManageRatings.css'
import LoginFormModal from "../../LoginFormModal"

export const ManageRatings = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.session.user)
  const userRatingsObj = useSelector(state => state.session.user?.ratings)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    if (loggedIn) dispatch(thunkGetUserRatings())
  }, [loggedIn, dispatch])

  useEffect(() => {
    if (user) setLoggedIn(true)
    if (!user) setLoggedIn(false)
  }, [user])

  if (!user) {
    return (
      <div className="manage-vans-div">
        <h1>You must be logged in to view your ratings</h1>
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

  if (!userRatingsObj) return null

  const userRatings = Object.values(userRatingsObj)

  return (
    <div className="manage-ratings">
    <h2>Reviews you&apos;ve left</h2>
      {userRatings.length ? 
        (<ul>
        {userRatings.map(rating => (
          <UserRating rating={rating} key={rating.id}/>
        ))}
      </ul>) :
      (<h2>You have no reviews</h2>)
    }
    </div>
  )
}